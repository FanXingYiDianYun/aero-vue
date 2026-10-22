<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'
import { defaultCropperLabels, type CropResult, type CropFrameState, type CropperLabels } from '../cropper.types'

// i18n：组件文案走 useLocale() 词包（ConfigProvider locale prop 注入），
// labels prop 优先级最高（覆盖词包）
const { cropper } = useLocale()

/** 导出图片 → 各尺寸 dataURL + Blob */
async function cropToResults(img: HTMLImageElement, frame: CropFrameState, imgRect: { x: number; y: number; w: number; h: number }, sizes: number[], circleRatio: number, view: number): Promise<CropResult[]> {
  const out: CropResult[] = []
  const kw = img.naturalWidth / imgRect.w
  const kh = img.naturalHeight / imgRect.h
  const cxA = (frame.cx - imgRect.x) * kw
  const cyA = (frame.cy - imgRect.y) * kh
  for (const size of sizes) {
    const cvs = document.createElement('canvas')
    cvs.width = size
    cvs.height = size
    const ctx = cvs.getContext('2d')!
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()
    const rad = (frame.rot * Math.PI) / 180
    const k = size / (frame.size * 2 * circleRatio * kw)
    ctx.translate(size / 2, size / 2)
    ctx.scale(k, k)
    ctx.rotate(rad)
    ctx.translate(-cxA, -cyA)
    ctx.drawImage(img, 0, 0)
    const blob = await new Promise<Blob>((res) => cvs.toBlob((b) => res(b as Blob), 'image/png'))
    out.push({ size, url: cvs.toDataURL('image/png'), blob })
  }
  return out
}

/** 视窗默认 260、圆形裁取半径占框比例 0.42（与 demo 原视觉对齐） */
const VIEW = 260
const CIRCLE_RATIO = 0.42
const FRAME_BORDER = 2

const props = withDefaults(
  defineProps<{
    /** 导出尺寸档（px） */
    exportSizes?: number[]
    /** 裁取形状 */
    shape?: 'circle' | 'rect'
    /** 框最小边长 */
    minSize?: number
    /** 框最大边长（px）；缺省 0 = 自动（view - 10），view=260 时自动值 250 与旧硬编码一致 */
    maxSize?: number
    disabled?: boolean
    /** 视窗边长 px（默认 260，与 demo 原值） */
    view?: number
    /** 工具栏文案（i18n 覆盖入口；缺省 defaultCropperLabels 中文） */
    labels?: Partial<CropperLabels>
  }>(),
  {
    exportSizes: () => [32, 48, 64, 96, 128],
    shape: 'circle',
    minSize: 60,
    maxSize: 0,
    disabled: false,
    view: 260,
    labels: () => ({}),
  },
)

/** maxSize 动态默认：未传时 = view - 10（动态默认，不写死 250 特例） */
const effectiveMaxSize = computed(() => props.maxSize > 0 ? props.maxSize : props.view - 10)
/** labels：词包（useLocale 跟随 ConfigProvider locale）为底，labels prop 覆盖（优先级最高） */
const labels = computed(() => ({ ...defaultCropperLabels, ...cropper.value, ...props.labels }))

const emit = defineEmits<{
  (e: 'change', f: CropFrameState): void
  (e: 'export', results: CropResult[]): void
  (e: 'error', err: unknown): void
}>()

const frame = ref<CropFrameState>({ cx: VIEW / 2, cy: VIEW / 2, size: 200, rot: 0 })
const imgSrc = ref('')
const fileName = ref('')
const imgEl = ref<HTMLImageElement>()
const fileInput = ref<HTMLInputElement>()
const imgRect = ref({ x: 0, y: 0, w: VIEW, h: VIEW })

function fitImage() {
  const el = imgEl.value
  if (!el || !el.naturalWidth) return
  const k = Math.min(props.view / el.naturalWidth, props.view / el.naturalHeight)
  const w = el.naturalWidth * k
  const h = el.naturalHeight * k
  imgRect.value = { x: (props.view - w) / 2, y: (props.view - h) / 2, w, h }
  frame.value = { cx: props.view / 2, cy: props.view / 2, size: Math.min(200, w, h) * 0.9, rot: 0 }
}

function onUpload(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  fileName.value = f.name
  const reader = new FileReader()
  reader.onload = () => {
    imgSrc.value = String(reader.result)
  }
  reader.onerror = () => emit('error', reader.error)
  reader.readAsDataURL(f)
  ;(e.target as HTMLInputElement).value = ''
}

function resetFrame() {
  frame.value = { cx: props.view / 2, cy: props.view / 2, size: Math.min(200, imgRect.value.w, imgRect.value.h) * 0.9, rot: 0 }
}

type DragState = {
  kind: 'move' | 'scale' | 'rotate'
  ox: number
  oy: number
  osize: number
  orot: number
  odist: number
  oang: number
}
let drag: DragState | null = null
const dragStart = ref({ x: 0, y: 0 })

function getLocalCoords(clientX: number, clientY: number): { lx: number; ly: number } {
  const frameEl = document.querySelector('.aero-cropper__frame') as HTMLElement | null
  if (!frameEl) return { lx: 0, ly: 0 }
  const fr = frameEl.getBoundingClientRect()
  return {
    lx: clientX - (fr.left + FRAME_BORDER),
    ly: clientY - (fr.top + FRAME_BORDER),
  }
}

function onHandleDown(kind: 'move' | 'scale' | 'rotate', e: PointerEvent) {
  if (props.disabled) return
  const target = e.currentTarget as HTMLElement | null
  if (!target) return
  const { lx, ly } = getLocalCoords(e.clientX, e.clientY)
  dragStart.value = { x: e.clientX, y: e.clientY }
  const dx = lx - frame.value.cx
  const dy = ly - frame.value.cy
  drag = {
    kind,
    ox: frame.value.cx,
    oy: frame.value.cy,
    osize: frame.value.size,
    orot: frame.value.rot,
    odist: Math.max(1, Math.hypot(dx, dy)),
    oang: Math.atan2(dy, dx),
  }
  startDrag(target, e)
}

function onHandleMove(e: PointerEvent) {
  if (!drag) return
  if (drag.kind === 'move') {
    const start = dragStart.value
    frame.value.cx = clamp(drag.ox + (e.clientX - start.x), 20, props.view - 20)
    frame.value.cy = clamp(drag.oy + (e.clientY - start.y), 20, props.view - 20)
  } else {
    const { lx, ly } = getLocalCoords(e.clientX, e.clientY)
    const dx = lx - frame.value.cx
    const dy = ly - frame.value.cy
    if (drag.kind === 'scale') {
      const k = Math.hypot(dx, dy) / drag.odist
      frame.value.size = clamp(drag.osize * k, props.minSize, effectiveMaxSize.value)
    } else {
      const ang = Math.atan2(dy, dx)
      let deg = ((ang - drag.oang) * 180) / Math.PI
      if (deg > 180) deg -= 360
      if (deg < -180) deg += 360
      frame.value.rot = ((Math.round(drag.orot + deg) % 360) + 360) % 360
    }
  }
  emit('change', { ...frame.value })
}

function onHandleEnd() {
  drag = null
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）；move/scale/rotate 共用 onMove，
// 业务上按 drag.kind 写入不同字段，释放统一收口 onHandleEnd（kind 不再需要保留区分）
const { startDrag } = usePointerDrag(
  (e) => onHandleMove(e),
  { onEnd: onHandleEnd },
)

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

const frameCss = computed(() => ({
  left: frame.value.cx - frame.value.size / 2 + 'px',
  top: frame.value.cy - frame.value.size / 2 + 'px',
  width: frame.value.size + 'px',
  height: frame.value.size + 'px',
  transform: `rotate(${frame.value.rot}deg)`,
}))

const cropped = ref<CropResult[]>([])

async function exportCrop() {
  if (!imgSrc.value) return
  const img = new Image()
  img.onload = async () => {
    try {
      cropped.value = await cropToResults(img, frame.value, imgRect.value, props.exportSizes, CIRCLE_RATIO, props.view)
      emit('export', cropped.value)
    } catch (err) {
      emit('error', err)
    }
  }
  img.onerror = () => emit('error', new Error('image load failed'))
  img.src = imgSrc.value
}

defineExpose({
  reset() {
    resetFrame()
  },
  /** 打开内置文件选择器（组件内封装，不泄漏回 demo 层——D-CR-1） */
  openFilePicker() {
    fileInput.value?.click()
  },
  /** 程序化载入图片（跳过 file 选择） */
  setSource(src: string, name?: string) {
    imgSrc.value = src
    if (name) fileName.value = name
  },
})

/** 模板内调用的开选择器（同 expose，供默认 trigger 按钮使用） */
function openFilePicker() {
  fileInput.value?.click()
}

const frameMeta = computed(() => {
  if (!imgSrc.value) return labels.value.ready
  const meta = labels.value.metaFrame
    ? labels.value.metaFrame(frame.value.size, frame.value.rot)
    : `${Math.round(frame.value.size)}px · ${Math.round(frame.value.rot)}°`
  return `${fileName.value || labels.value.upload} · ${meta}`
})
</script>

<template>
  <div class="aero-cropper" :class="{ 'is-disabled': disabled }">
    <div class="aero-cropper__viewer">
      <div
        class="aero-cropper__frame"
        :style="{ width: view + 'px', height: view + 'px' }"
        @pointerdown="onHandleDown('move', $event)"
      >
        <img v-if="imgSrc" ref="imgEl" class="aero-cropper__img" :src="imgSrc" :alt="fileName" :style="{ left: imgRect.x + 'px', top: imgRect.y + 'px', width: imgRect.w + 'px', height: imgRect.h + 'px' }" draggable="false" @load="fitImage" @error="emit('error', $event)" />
        <span v-else class="aero-cropper__empty">{{ labels.empty }}</span>

        <div v-if="imgSrc" class="aero-cropper__crop" :class="{ 'is-rect': shape === 'rect' }" :style="frameCss">
          <div class="aero-cropper__grid" />
          <div v-if="shape === 'circle'" class="aero-cropper__circle" />
          <div class="aero-cropper__cross" />
          <div class="aero-cropper__north">▲</div>
          <svg class="aero-cropper__rotate-hint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 4a8 8 0 0 1 8 8" />
            <path d="M20 8l-2 4 4-1z" fill="currentColor" stroke="none" />
          </svg>
          <i v-for="h in ['tl', 'tr', 'br', 'bl']" :key="h" class="aero-cropper__h aero-cropper__h--corner" :class="`aero-cropper__h--${h}`" @pointerdown="onHandleDown('scale', $event)" />
          <i v-for="h in ['t', 'r', 'b', 'l']" :key="h" class="aero-cropper__h" :class="`aero-cropper__h--${h}`" @pointerdown="onHandleDown('rotate', $event)" />
        </div>
      </div>
      <slot name="tip">{{ labels.hint }}</slot>
    </div>

    <div class="aero-cropper__ctrls">
      <div class="aero-cropper__upload">
        <!-- D-CR-1：内置原生 file input 封装（组件内部实现，不泄漏回 demo 层） -->
        <input ref="fileInput" class="aero-cropper__input" type="file" accept="image/*" hidden @change="onUpload" />
 <slot name="trigger" :disabled="disabled" :fileName="fileName" :open="openFilePicker">
 <button v-if="!$slots.trigger" class="aero-cropper__btn" type="button" :disabled="disabled" @click="openFilePicker()">{{ fileName || labels.upload }}</button>
 </slot>
 </div>

 <div class="aero-cropper__rot">
 <button class="aero-cropper__mini" type="button" :disabled="disabled || !imgSrc" @click="frame.size = Math.min(effectiveMaxSize, frame.size + 24)">{{ labels.enlarge }}</button>
 <button class="aero-cropper__mini" type="button" :disabled="disabled || !imgSrc" @click="frame.size = Math.max(minSize, frame.size - 24)">{{ labels.shrink }}</button>
 <button class="aero-cropper__mini" type="button" :disabled="disabled || !imgSrc" @click="frame.rot += 90">{{ labels.rotate90 }}</button>
 <button class="aero-cropper__mini" type="button" :disabled="disabled || !imgSrc" @click="resetFrame()">{{ labels.reset }}</button>
 </div>

 <div class="aero-cropper__meta">{{ frameMeta }}</div>
 <button class="aero-cropper__export" type="button" :disabled="disabled || !imgSrc" @click="exportCrop">{{ labels.export }}</button>

 <div v-if="cropped.length" class="aero-cropper__result">
 <div v-for="c in cropped" :key="c.size" class="aero-cropper__result-item">
 <!-- 真实像素渲染——移除 Math.min(c.size, 64) 钳制，96/128 档按导出尺寸原样呈现 -->
 <img :src="c.url" :width="c.size" :height="c.size" :alt="c.size + 'px'" />
 <span>{{ c.size }}px</span>
 </div>
 </div>
 </div>
 </div>
</template>

<style scoped lang="scss">
.aero-cropper {
 box-sizing: border-box;
 display: flex;
 gap: 26px;
 align-items: flex-start;
 flex-wrap: wrap;
 &.is-disabled {
 opacity: 0.55;
 pointer-events: none;
 }

 &__viewer {
 display: flex;
 flex-direction: column;
 gap: 8px;
 }

 &__frame {
 position: relative;
 overflow: hidden;
 border: 2px solid var(--ui-line-2);
 border-radius: 12px;
 background: repeating-linear-gradient(-45deg, var(--ui-bg-soft) 0 10px, transparent 10px 20px), var(--ui-bg-soft);
 cursor: move;
 touch-action: none;
 user-select: none;
 }

 &__empty {
 position: absolute;
 inset: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 12px;
 color: var(--ui-ink-3);
 }

 &__img {
 position: absolute;
 max-width: none;
 pointer-events: none;
 user-select: none;
 }

 &__crop {
 position: absolute;
 border: 2px solid var(--ui-brand);
 box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.35);
 pointer-events: none;
 &.is-rect {
 &__circle {
 display: none;
 }
 }
 }

 &__circle {
 position: absolute;
 inset: 8%;
 border-radius: 50%;
 border: 2px dashed var(--ui-brand-ink);
 opacity: 0.7;
 }

 &__grid {
 position: absolute;
 inset: 8%;
 background: linear-gradient(var(--ui-line-2) 1px, transparent 1px), linear-gradient(90deg, var(--ui-line-2) 1px, transparent 1px);
 background-size: 33.33% 33.33%;
 opacity: 0.5;
 }

 &__cross {
 position: absolute;
 left: 50%;
 top: 50%;
 width: 14px;
 height: 14px;
 transform: translate(-50%, -50%);
 background: linear-gradient(var(--ui-brand), var(--ui-brand)) center/2px 14px no-repeat, linear-gradient(var(--ui-brand), var(--ui-brand)) center/14px 2px no-repeat;
 }

 &__h {
 position: absolute;
 width: 12px;
 height: 12px;
 background: var(--ui-card);
 border: 2px solid var(--ui-brand);
 border-radius: 3px;
 transform: translate(-50%, -50%);
 pointer-events: auto;
 cursor: grab;
 &:active {
 cursor: grabbing;
 }
 &--corner {
 cursor: nwse-resize;
 }
 &--tr,
 &--bl {
 cursor: nesw-resize;
 }
 &--tl {
 left: 0;
 top: 0;
 }
 &--tr {
 left: 100%;
 top: 0;
 }
 &--br {
 left: 100%;
 top: 100%;
 }
 &--bl {
 left: 0;
 top: 100%;
 }
 &--t {
 left: 50%;
 top: 0;
 }
 &--b {
 left: 50%;
 top: 100%;
 }
 &--l {
 left: 0;
 top: 50%;
 }
 &--r {
 left: 100%;
 top: 50%;
 }
 &--t,
 &--b {
 width: 20px;
 height: 9px;
 border-radius: 99px;
 }
 &--l,
 &--r {
 width: 9px;
 height: 20px;
 border-radius: 99px;
 }
 &--t,
 &--b,
 &--l,
 &--r {
 cursor: alias;
 &:active {
 cursor: grabbing;
 }
 }
 }

 &__north {
 position: absolute;
 top: 5px;
 left: 50%;
 transform: translateX(-50%);
 font-size: 11px;
 color: var(--ui-brand);
 font-weight: 800;
 text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
 pointer-events: none;
 user-select: none;
 line-height: 1;
 }

 &__rotate-hint {
 position: absolute;
 top: 6px;
 right: 6px;
 width: 18px;
 height: 18px;
 pointer-events: none;
 opacity: 0.55;
 color: var(--ui-brand-ink);
 }

 &__ctrls {
 display: flex;
 flex-direction: column;
 gap: 12px;
 min-width: 240px;
 flex: 1;
 }

 &__upload {
 display: inline-flex;
 }

 &__input {
 display: none;
 }

 &__btn {
 font-family: inherit;
 font-weight: 700;
 font-size: 13.5px;
 padding: 7px 15px;
 border-radius: 11px;
 border: 2px solid var(--ui-ink);
 background: var(--ui-card);
 color: var(--ui-ink);
 cursor: pointer;
 transition: transform 0.18s var(--ui-spring), box-shadow 0.18s;
 &:hover {
 transform: translate(-2px, -2px) rotate(0.6deg);
 box-shadow: var(--ui-shadow-sm-brand);
 border-color: var(--ui-brand-ink);
 color: var(--ui-brand-ink);
 }
 &:disabled {
 opacity: 0.45;
 pointer-events: none;
 }
 }

 &__rot {
 display: flex;
 gap: 8px;
 flex-wrap: wrap;
 }

 &__mini {
 font-family: inherit;
 font-size: 12.5px;
 font-weight: 700;
 padding: 4px 10px;
 border-radius: 9px;
 border: 2px solid var(--ui-line-2);
 background: var(--ui-card);
 color: var(--ui-ink-2);
 cursor: pointer;
 transition: transform 0.15s var(--ui-spring), box-shadow 0.15s;
 &:hover {
 transform: translateY(-1px);
 box-shadow: 2px 2px 0 var(--ui-bg-tint);
 border-color: var(--ui-brand);
 color: var(--ui-brand-ink);
 }
 &:disabled {
 opacity: 0.4;
 pointer-events: none;
 }
 }

 &__meta {
 font-family: var(--ui-font-mono);
 font-size: 11.5px;
 color: var(--ui-ink-3);
 }

 &__export {
 align-self: flex-start;
 font-family: inherit;
 font-weight: 700;
 font-size: 13px;
 padding: 7px 16px;
 border-radius: 11px;
 border: 2px solid var(--ui-brand);
 background: var(--ui-ink);
 color: var(--ui-bg);
 cursor: pointer;
 transition: transform 0.18s var(--ui-spring), box-shadow 0.18s;
 &:hover {
 transform: translate(-2px, -2px);
 box-shadow: var(--ui-shadow-sm-brand);
 }
 &:disabled {
 opacity: 0.45;
 pointer-events: none;
 }
 }

 &__result {
 display: flex;
 gap: 12px;
 flex-wrap: wrap;
 padding: 12px;
 border: 2px solid var(--ui-line);
 border-radius: 14px;
 background: var(--ui-card);
 }

 &__result-item {
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 6px;
 font-size: 11px;
 font-family: var(--ui-font-mono);
 color: var(--ui-ink-3);
 img {
 /* border-box 使 rect.width 精确等于 :width 属性（真实导出尺寸）；
 否则 2px 边框 ×2 会把 rect 撑大 4px，全量枚举断言 ±1px 必挂 */
      box-sizing: border-box;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--ui-line);
    }
  }
}
</style>
