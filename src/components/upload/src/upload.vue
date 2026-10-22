<script setup lang="ts">
import { ref, watch } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { formatSize } from '../../../utils'
import { useLocale } from '../../../locale'

// i18n：内置触发区/拖拽区/文件行 aria 文案走词包（ConfigProvider locale 注入）
const { upload: upLabels } = useLocale()

/**
 * 上传文件描述（v-model 元素）。
 * @property uid  文件唯一 id（组件内部按自增序号生成，用于 key 与跨事件定位）
 * @property status  状态：ready 待处理 / done 完成 / error 失败 / uploading 上传中（配合 success/error 事件流转）
 */
export interface UploadFile {
  uid: number
  name: string
  size: number
  status: 'ready' | 'uploading' | 'done' | 'error'
  /** 上传成功后的响应（用户侧管道写入，组件本身不碰网络——见 index 注释） */
  url?: string
  percent?: number
}

export type UploadStatus = UploadFile['status']

/** beforeUpload 钩子：返回 false / Promise<false> 取消该文件；返回 File/Blob 视为以新文件替换；返回 undefined 用原文件 */
export type BeforeUploadHook = (file: File, files: File[]) => false | File | Blob | void | Promise<false | File | Blob | void>

/** 触发区/按钮的自定义渲染。替代内置「选择文件」按钮，D-CR-1 同款能力供外部（含 Cropper）复用 */
// UploadTriggerSlot 为 slot props 类型占位（{ trigger: () => void }），供文档与类型提示；不对外导出

const props = withDefaults(
  defineProps<{
    /** 受控文件列表（v-model） */
    modelValue?: UploadFile[]
    multiple?: boolean
    accept?: string
    /** 拖拽区 */
    drag?: boolean
    disabled?: boolean
    /** 最多文件数（配合 limit 达上限触发 exceed；0/缺省不限） */
    limit?: number
    /** 表单字段名（随 beforeUpload/upload 事件透传给用户侧管道，组件自身不做网络上传——D-UP-1） */
    name?: string
    /** 是否携带凭证（同上，透传字段） */
    withCredentials?: boolean
    /** 关闭文件列表渲染（保留 v-model 数据流） */
    showFileList?: boolean
    /** 列表样式：text=文字行 / picture=缩略图 / picture-card=卡片（picture* 需用户侧在 file slot 提供缩略图） */
    listType?: 'text' | 'picture' | 'picture-card'
    /** 拖拽区/按钮下提示文案（tip slot 缺省时的文本） */
    tip?: string
    /** 选择后逐文件执行：取消 / 替换 / 直接通过（见 BeforeUploadHook） */
    beforeUpload?: BeforeUploadHook
    /** 移除前执行：返回 false / Promise<false> 取消移除 */
    beforeRemove?: (f: UploadFile) => false | void | Promise<false | void>
  }>(),
  {
    modelValue: () => [],
    multiple: false,
    accept: '',
    drag: false,
    disabled: false,
    limit: 0,
    name: 'file',
    withCredentials: false,
    showFileList: true,
    listType: 'text',
    beforeUpload: undefined,
    beforeRemove: undefined,
  },
)

type Emit = {
  (e: 'update:modelValue', v: UploadFile[]): void
  /**
   * 选择/拖入完成（已通过 beforeUpload 过滤）时触发。
   * @param files      本次新增文件（按接受顺序；single 模式 = 1 项）
   * @param allPicked  本次选择器全量（含被 limit 拒掉的；single 模式 = 1 项）
   * 注：均非全量列表；全量请用 modelValue。EP 口径为 (单文件, 全量列表)，本组件批量语义不同，
   * 用户侧全量列表请监听 modelValue 或维护自己的 files 数组。
   */
  (e: 'change', files: File[], allPicked: File[]): void
  (e: 'remove', f: UploadFile): void
  /** 达 limit 时超出部分（不并入列表） */
  (e: 'exceed', files: File[], uploadFiles: UploadFile[]): void
  /** 点击列表项预览（用户侧接管；listType text 默认无预览钮，用户可经 file slot 渲染） */
  (e: 'preview', f: UploadFile): void
  /**
   * 用户侧上传管道挂载点：把 (file, opts) 交给外部 fetch/axios。
   * 组件自身不做网络——upload 事件触发后由用户接管，
   * 进度/结果经 watch modelValue.status 自动回报（见下方 watch 块）。
   */
  (e: 'upload', file: File, opts: { name: string; withCredentials: boolean; headers: Record<string, string> }): void
  /**
   * 监听 v-model 中文件的 status 字段：
   * status → 'uploading' 且 percent 变化时自动 emit progress；
   * status → 'done'    时自动 emit success（payload.url 即 response）；
   * status → 'error'   时自动 emit error。
   * 即：用户把文件标记完成/失败，组件自动回报，无需手动 emit。
   */
  (e: 'success', f: UploadFile, response: unknown): void
  (e: 'progress', f: UploadFile, percent: number): void
  (e: 'error', f: UploadFile, err: unknown): void
}
const emit = defineEmits<Emit>()

let uidSeq = 0
const inputRef = ref<HTMLInputElement>()
const over = ref(false)

function nextUid() {
  return ++uidSeq
}

function resolveBeforeUpload(file: File, files: File[]): Promise<false | File | Blob | void> {
  if (!props.beforeUpload) return Promise.resolve()
  return Promise.resolve(props.beforeUpload(file, files)).then((r) => {
    if (r === false) return false
    if (r instanceof File || r instanceof Blob) return r
    return undefined
  })
}

async function addFiles(incoming: File[]) {
  if (!incoming.length || props.disabled) return
  const raw = props.multiple ? incoming : incoming.slice(0, 1)
  // 过滤经 beforeUpload
  type Picked = { file: File; repl?: File | Blob }
  const passed: Picked[] = []
  for (const f of raw) {
    const r = await resolveBeforeUpload(f, raw)
    if (r === false) continue
    passed.push({ file: f, repl: r === undefined ? undefined : r })
  }
  if (!passed.length) return
  // limit 超额检查（按现有列表 + 本次通过数）
  const room = props.limit > 0 ? Math.max(0, props.limit - props.modelValue.length) : Infinity
  const accepted = passed.slice(0, room)
  const rejected = passed.slice(room)
  if (rejected.length) emit('exceed', rejected.map((x) => x.file), props.modelValue)
  if (!accepted.length) return
  const mapped: UploadFile[] = accepted.map((a) => ({
    uid: nextUid(),
    name: (a.repl as File | undefined)?.name ?? a.file.name,
    size: (a.repl as Blob | undefined)?.size ?? a.file.size,
    status: 'ready',
  }))
  emit('update:modelValue', props.multiple ? [...props.modelValue, ...mapped] : mapped)
  emit('change', accepted.map((a) => (a.repl && a.repl instanceof File ? a.repl : a.file)), passed.map((p) => p.file))
  // 逐条通知用户侧上传管道（组件自身不碰网络——D-UP-1）
  for (const a of accepted) {
    const fin = a.repl instanceof File ? a.repl : a.file
    emit('upload', fin, { name: props.name, withCredentials: props.withCredentials, headers: {} })
  }
}

function onPick(e: Event) {
  const fl = (e.target as HTMLInputElement).files
  void addFiles(Array.from(fl ?? []))
  inputRef.value!.value = ''
}

function onDrop(e: DragEvent) {
  over.value = false
  void addFiles(Array.from(e.dataTransfer?.files ?? []))
}

async function remove(i: number) {
  const f = props.modelValue[i]
  if (!f) return
  if (props.beforeRemove) {
    const r = await Promise.resolve(props.beforeRemove(f))
    if (r === false) return
  }
  emit('update:modelValue', props.modelValue.filter((_, k) => k !== i))
  emit('remove', f)
}

function preview(f: UploadFile) {
  emit('preview', f)
}

/* —— Q5 落实：监听 v-model 中 status 字段变化，自动回报 progress/success/error ——
   组件本身不碰网络（D-UP-1），但用户把上传结果写回 modelValue 的 status/percent/url 时，
   组件自动 emit 对应事件，三事件从此有真实触发路径，不再是僵尸 API。 */
watch(
  () => props.modelValue,
  (list, prev) => {
    for (const f of list ?? []) {
      const prevF = prev?.find((p) => p.uid === f.uid)
      if (!prevF) continue
      if (f.status === 'uploading' && f.percent !== prevF.percent) {
        emit('progress', f, f.percent ?? 0)
      }
      if (f.status === 'done' && prevF.status !== 'done') {
        emit('success', f, f.url)
      }
      if (f.status === 'error' && prevF.status !== 'error') {
        emit('error', f, undefined)
      }
    }
  },
  { deep: true },
)

/* —— expose（对标 EP：submit 手动触发攒起文件 / clearFiles / abort / handleStart）—— */
const pending = ref<File[]>([])
defineExpose({
  /** 手动提交（autoUpload 语义由用户侧管道控制；组件提供入口） */
  submit() {
    if (!pending.value.length) return
    const fl = pending.value
    pending.value = []
    void addFiles(fl)
  },
  clearFiles() {
    emit('update:modelValue', [])
  },
  /** 取消进行中的用户侧管道（组件侧无网络，仅清空 pending） */
  abort() {
    pending.value = []
  },
  /** 暴露文件输入控件（外部可 .click()） */
  handleStart() {
    inputRef.value?.click()
  },
})

function trigger() {
  if (props.disabled) return
  inputRef.value?.click()
}
</script>

<template>
  <div class="aero-upload" :class="{ 'is-disabled': disabled }" :data-list-type="listType">
    <!-- 触发区：default slot（trigger）自定义，否则内置按钮/拖拽区（默认样式 = 当前视觉） -->
    <slot name="trigger" :trigger="trigger">
      <div
        v-if="drag"
        class="aero-upload__drop"
        :class="{ 'is-over': over }"
        @click="trigger"
        @dragover.prevent="over = true"
        @dragleave="over = false"
        @drop.prevent="onDrop"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['upload']" :key="i" :d="d" />
        </svg>
        <b>{{ upLabels.dragTitle }}</b>
        <span>{{ upLabels.dragSub(accept || upLabels.anyType) }}</span>
      </div>
      <button v-else class="aero-upload__btn" type="button" @click="trigger">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['upload']" :key="i" :d="d" />
        </svg>
        {{ upLabels.select }}
      </button>
    </slot>

    <input
      ref="inputRef"
      class="aero-upload__input"
      type="file"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled"
      @change="onPick"
    />

    <slot name="tip">{{ tip }}</slot>

    <!-- 文件列表：file slot 自定义行，默认内置行 -->
    <ul v-if="showFileList && modelValue.length" class="aero-upload__list" :class="{ 'is-picture': listType === 'picture', 'is-card': listType === 'picture-card' }">
      <li v-for="(f, i) in modelValue" :key="f.uid ?? f.name + i">
        <slot name="file" :file="f" :index="i" :preview="() => preview(f)" :remove="() => remove(i)">
          <button class="aero-upload__preview" type="button" :aria-label="upLabels.previewAria" @click="preview(f)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, k) in iconPaths['file-text']" :key="k" :d="d" />
            </svg>
          </button>
          <span class="aero-upload__name">{{ f.name }}</span>
          <span class="aero-upload__size">{{ formatSize(f.size) }}</span>
          <button class="aero-upload__x" type="button" :aria-label="upLabels.removeAria" @click="remove(i)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path v-for="(d, k) in iconPaths['x']" :key="k" :d="d" />
            </svg>
          </button>
        </slot>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.aero-upload {
  box-sizing: border-box;
  /* flex 链路 min-width:0 自查——作为 .pg-stage flex item / 任意窄宿主
 flex 子项，min-width:auto 会让 li（行 min-content = 全文件名字宽）把
 整条 .aero-upload 列宽撑到宿主宽之外（触发器与列表同容器，list 撑宽
 连带把 drop 区拉宽，390 页出横向滚动条）→ 根 + 列表 + 行三级放行 */
  min-width: 0;
  max-width: 100%;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 13.5px;
    padding: 7px 15px;
    border-radius: 11px;
    border: 2px solid var(--ui-ink);
    background: var(--ui-card);
    color: var(--ui-ink);
    cursor: pointer;
    transition: transform 0.18s var(--ui-spring), box-shadow 0.18s;
    font-family: inherit;
    &:hover {
      transform: translate(-2px, -2px) rotate(0.6deg);
      box-shadow: var(--ui-shadow-sm-brand);
      border-color: var(--ui-brand-ink);
      color: var(--ui-brand-ink);
    }
  }

  /* 触发器（拖拽区）宽度与文件列表解耦——自身 max-width:100% 顶到
 宿主内容宽为止，不被同行 flex 兄弟（list）min-content 拉宽；
 短名现状：宿主够宽时 drop 区本就是内容自适应居中，布局零变化 */
  &__drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 34px 20px;
    border: 2px dashed var(--ui-line-2);
    border-radius: var(--ui-radius-lg);
    background: var(--ui-bg-soft);
    color: var(--ui-ink-2);
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s, transform 0.25s var(--ui-spring);
    max-width: 100%;
    box-sizing: border-box;

    b {
      color: var(--ui-ink);
      font-size: 14.5px;
    }
    span {
      font-size: 12.5px;
      color: var(--ui-ink-3);
    }
    &:hover,
    &.is-over {
      border-color: var(--ui-brand);
      background: var(--ui-bg-tint);
      transform: translateY(-2px);
    }
  }

  &__input {
    display: none;
  }

  &__list {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    /* min-width:0 放行 li 的 min-content（文件名）向上传播，列表不再撑宽宿主 */
    min-width: 0;
    max-width: 100%;
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 13px;
      background: var(--ui-card);
      border: 2px solid var(--ui-line-2);
      border-radius: 13px;
      font-size: 13.5px;
      color: var(--ui-ink);
      transition: border-color 0.25s, transform 0.25s var(--ui-spring), box-shadow 0.25s;
      /* 行 max-width:100% + min-width:0（本行即 min-width:auto 传递的断点），
 让文件名 ellipsis 生效而非把行撑出宿主 */
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      &:hover {
        border-color: var(--ui-brand);
        transform: translateY(-1px);
        box-shadow: 3px 3px 0 var(--ui-bg-tint);
      }
      svg {
        color: var(--ui-brand-ink);
        flex: none;
      }
    }
    /* picture / picture-card 视觉档（默认 text 档不变） */
    &.is-picture li {
      align-items: flex-start;
    }
    &.is-card li {
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
    }
  }
  &__preview {
    display: flex;
    align-items: center;
    border: 0;
    background: none;
    padding: 2px;
    cursor: pointer;
    color: var(--ui-brand-ink);
    flex: none;
  }
  &__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__size {
    font-family: var(--ui-font-mono);
    font-size: 12px;
    color: var(--ui-ink-3);
    /* flex:none——文件大小不被压缩，保证截断发生在文件名而非尺寸列 */
    flex: none;
  }
  &__x {
    border: 0;
    background: none;
    color: var(--ui-ink-3);
    display: flex;
    cursor: pointer;
    padding: 2px;
    /* flex:none——关闭钮不被压缩，保证极端窄宿主下仍可见可点 */
    flex: none;
    transition: color 0.2s, transform 0.2s;
    &:hover {
      color: var(--ui-err);
      transform: rotate(90deg);
    }
  }
}
</style>
