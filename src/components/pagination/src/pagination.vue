<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：上一页/下一页 aria、jumper「前往」「确定」、总数「N 页」走词包（ConfigProvider locale 注入）
const { pagination: pgLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue: number
    /** 总条数 */
    total: number
    /** 每页条数 */
    pageSize?: number
    /** 显示页码跳转输入框（默认 true；H4 收回上轮「<480px 隐藏」条款：紧凑模式 jumper 不隐藏，折行独占一行） */
    jumper?: boolean
  }>(),
  { pageSize: 10, jumper: true },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

// —— 容器宽度响应：measure() 取「最近块级祖先 clientWidth ∩ 视口宽」为可用宽度，
//    <480px 进入紧凑模式：页码窗收缩为 5；jumper 不隐藏、折行独占一行（H4 收回上轮隐藏条款）——
const root = ref<HTMLElement>()
const containerW = ref(0)
let ro: ResizeObserver | undefined
function measure() {
  const nav = root.value
  if (!nav) return
  // 可用容器宽度 = 最近块级祖先（display 非 inline-*）的 clientWidth。
  // 不能用「> nav.clientWidth」做判据：未换行时 nav 会撑破收缩父级，
  // 导致爬升过头选到远端大容器（桌面 mount 误取 stage 后又被 wrap 缩回，状态错乱）。
  // 同时以视口宽度为上限钳制——inline-flex 祖先不反映视口收缩，
  // 若不钳制则移动端横向溢出场景下 nav.clientWidth 恒 >480 → 永不紧凑。
  let target: HTMLElement | null = nav.parentElement
  while (target) {
    const d = getComputedStyle(target).display
    if (!d.startsWith('inline')) break
    target = target.parentElement
  }
  if (!target) target = nav.parentElement ?? nav
  containerW.value = Math.min(target.clientWidth, document.documentElement.clientWidth)
}
onMounted(() => {
  if (!root.value) return
  measure()
  // ResizeObserver：捕获容器自身尺寸变化（侧栏折叠等）；
  // window resize 同步补测：视口变化不一定触发目标元素 RO（如滚动条出现/消失、
  // demo flex 子项重排前的一帧），必须即时刷新避免紧凑态滞后一帧。
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    let t: HTMLElement | null = root.value.parentElement
    while (t) {
      const d = getComputedStyle(t).display
      if (!d.startsWith('inline')) break
      t = t.parentElement
    }
    if (t) ro.observe(t)
  }
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('resize', measure)
})
const compact = computed(() => containerW.value > 0 && containerW.value < 480)

const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const current = computed(() => Math.min(props.modelValue, pages.value))

// —— 输入跳页：本地输入缓冲，Enter / 点跳转提交，越界钳制到 1..pages，空值忽略 ——
const jumpInput = ref('')
watch(current, () => {
  // 外部 modelValue 变更时同步输入框（仅当输入框非焦点编辑态才覆盖，避免打断手输）
  if (document.activeElement?.tagName !== 'INPUT') jumpInput.value = ''
})

function commitJump() {
  const raw = jumpInput.value.trim()
  if (!raw) return
  let n = parseInt(raw, 10)
  if (Number.isNaN(n)) return
  n = Math.min(pages.value, Math.max(1, n)) // 越界钳制
  jumpInput.value = ''
  go(n)
}

function onJumpKey(e: KeyboardEvent) {
  if (e.key === 'Enter') commitJump()
}

const shown = computed(() => {
  const c = current.value
  const n = pages.value
  const arr: (number | string)[] = []
  const add = (v: number | string) => arr.push(v)
  // 紧凑模式（<480px）：窗口收缩为 5 项 = 首页/末页/当前±1/省略号
  if (compact.value || n <= 5) {
    if (n <= 5) {
      for (let i = 1; i <= n; i++) add(i)
    } else {
      add(1)
      if (c > 2) add('…')
      if (c > 1 && c < n) add(c)
      if (c < n - 1) add('…')
      add(n)
    }
    return arr
  }
  // 常规模式：1 … c-1 c c+1 … n
  add(1)
  if (c > 3) add('…')
  for (let i = Math.max(2, c - 1); i <= Math.min(n - 1, c + 1); i++) add(i)
  if (c < n - 2) add('…')
  add(n)
  return arr
})

function go(p: number) {
  if (p < 1 || p > pages.value || p === current.value) return
  emit('update:modelValue', p)
  emit('change', p)
}
</script>

<template>
  <nav ref="root" class="aero-pg" :class="{ 'is-compact': compact }" role="navigation">
    <button class="aero-pg__btn aero-pg__arrow" type="button" :disabled="current <= 1" :aria-label="pgLabels.prev" @click="go(current - 1)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['chevron-left']" :key="i" :d="d" />
      </svg>
    </button>
    <template v-for="(p, i) in shown" :key="i">
      <span v-if="p === '…'" class="aero-pg__dots">…</span>
      <button
        v-else
        class="aero-pg__btn"
        type="button"
        :class="{ 'is-active': p === current }"
        @click="go(p as number)"
      >
        {{ p }}
      </button>
    </template>
    <button class="aero-pg__btn aero-pg__arrow" type="button" :disabled="current >= pages" :aria-label="pgLabels.next" @click="go(current + 1)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['chevron-right']" :key="i" :d="d" />
      </svg>
    </button>
    <!-- jumper 禁止隐藏（收回上轮 G1.5 隐藏条款）。紧凑模式折行独占一行；
 「N 页」总数在 ≤480px 缩写为纯「N 页」（去掉前导斜杠），桌面保留「/ N 页」 -->
    <span v-if="jumper" class="aero-pg__jump">
      {{ pgLabels.go }}
      <input
        v-model="jumpInput"
        class="aero-pg__jump-input"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :aria-label="pgLabels.jumpAria(pages)"
        @keydown.enter.prevent="commitJump"
      />
      <template v-if="!compact">/ </template>{{ pages }} {{ pgLabels.page }}
      <button class="aero-pg__jump-go" type="button" @click="commitJump">{{ pgLabels.confirm }}</button>
    </span>
  </nav>
</template>

<style scoped lang="scss">
.aero-pg {
  box-sizing: border-box;
  display: inline-flex;
  gap: 6px;
  /* 紧凑模式允许换行，jumper 独占一行（禁止 display:none 隐藏） */
  &.is-compact { flex-wrap: wrap; }

  &__btn {
    min-width: 38px;
    height: 38px;
    border-radius: var(--ui-radius-md);
    border: 2px solid var(--ui-line);
    background: var(--ui-card);
    font-family: var(--ui-font-en);
    font-weight: 600;
    font-size: 14px;
    color: var(--ui-ink-2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    transition: 0.22s var(--ui-spring);
    cursor: pointer;
    flex: none;

    &:hover:not(:disabled) {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
      transform: translateY(-2px);
    }
    &.is-active {
      background: var(--ui-brand);
      border-color: var(--ui-ink);
      color: var(--ui-on-brand);
      box-shadow: 2.5px 2.5px 0 var(--ui-ink);
      transform: rotate(-3deg);
    }
    &:disabled {
      opacity: 0.4;
      pointer-events: none;
      /* 禁用仍保持圆角与边框可辨识 */
      border-color: var(--ui-line);
      color: var(--ui-ink-3);
    }
    /* 左右切换箭头钮：胶囊形，与方形页码钮形成视觉区分，圆角始终可读 */
    &.aero-pg__arrow {
      border-radius: 99px;
      width: 38px;
      min-width: 38px;
    }
  }
  &__dots {
    display: inline-flex;
    align-items: center;
    color: var(--ui-ink-3);
    padding: 0 2px;
  }

  /* 输入跳页 */
  &__jump {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-left: 8px;
    font-size: 13px;
    color: var(--ui-ink-2);
    font-family: var(--ui-font-mono);
    /* 紧凑模式 jumper 折行后独占一行，左对齐取消桌面 margin-left */
    .aero-pg.is-compact & { width: 100%; margin-left: 0; }
  }
  &__jump-input {
    width: 46px;
    height: 38px;
    border: 2px solid var(--ui-line);
    border-radius: var(--ui-radius-md);
    background: var(--ui-card);
    font-family: var(--ui-font-en);
    font-weight: 600;
    font-size: 14px;
    color: var(--ui-ink);
    text-align: center;
    padding: 0 6px;
    transition: 0.22s var(--ui-spring);
    &:focus {
      outline: none;
      border-color: var(--ui-brand);
      box-shadow: var(--ui-focus-ring);
    }
  }
  &__jump-go {
    height: 38px;
    padding: 0 12px;
    border: 2px solid var(--ui-line);
    border-radius: var(--ui-radius-md);
    background: var(--ui-card);
    font-family: var(--ui-font-en);
    font-weight: 600;
    font-size: 13px;
    color: var(--ui-ink-2);
    cursor: pointer;
    transition: 0.22s var(--ui-spring);
    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
    }
  }
}
</style>
