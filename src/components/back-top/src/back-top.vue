<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useRafScroll } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：返回顶部 aria 走词包（ConfigProvider locale 注入）
const { backTop: backTopLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 滚动触发阈值 px */
    threshold?: number
    /** 右偏移 */
    right?: number
    /** 底偏移 */
    bottom?: number
    /**
 * 滚动目标（EP 惯例，默认 window）
 * - string：滚动容器选择器（如 '.pg-main'），组件内 document.querySelector 求值
 * - 旧 API：`() => HTMLElement | Window | null` 兼容保留
 * 移动端布局滚动发生在内部 overflow-y 容器时，window scroll 永不触发 → 传选择器
 */
    target?: string | (() => HTMLElement | Window | null)
  }>(),
  { threshold: 240, right: 26, bottom: 26 },
)

const show = ref(false)

/**
 * 解析滚动目标（target 未传时自动探测真实滚动容器——容错）。
 * - string：document.querySelector 求值（EP 惯例）
 * - function：调用求值（旧 API 兼容）
 * - 未传：先试 window；若 window 不可滚（documentElement/body scrollHeight ≤ clientHeight，
 * 典型为 PC 端内部 overflow-y 容器滚动布局），再扫描 main/.pg-main/#app 等候选容器，
 * 取第一个 overflow-y ∈ {auto, scroll} 且内容溢出者兜底。
 * 注：移动端整页由 window 滚动（.pg-main 上无滚动，scrollTop 恒 0），
 * 故移动端不传 target 即走 window 正确分支；本兜底主要救 PC 内部滚动漏配场景。
 */
function getTarget(): HTMLElement | Window | null | undefined {
  if (typeof props.target === 'function') return props.target()
  if (typeof props.target === 'string') {
    return document.querySelector<HTMLElement>(props.target) ?? undefined
  }
  // 未传 target：window 可滚 → 默认 window
  const de = document.documentElement
  const winScrollable = de.scrollHeight > de.clientHeight + 1 || document.body.scrollHeight > document.body.clientHeight + 1
  if (winScrollable) return undefined
  // window 不可滚（PC 内部容器布局）→ 扫描常见滚动容器候选兜底
  const candidates = Array.from(document.querySelectorAll('main, .pg-main, #app [class*="scroll"], .aero-scrollbar__bar')) as HTMLElement[]
  for (const c of candidates) {
    const cs = getComputedStyle(c)
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && c.scrollHeight > c.clientHeight + 1) return c
  }
  return undefined // 仍找不到 → 回落 window
}

const onSample = (s: { scrollTop: number }) => {
  show.value = s.scrollTop > props.threshold
}

// useRafScroll 的 getTarget：string 选择器每次采样重新求值（支持容器动态切换）
const scrollerRaf = useRafScroll(() => getTarget(), onSample)

function goTop() {
  const el = getTarget() ?? window
  ;(el as Window | HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
}

// resize 重绑——真实滚动容器随布局断点切换（桌面 .pg-main
// overflow-y:auto ↔ 移动端/真空带 window 整页滚动，站点 L3 单一断点 960 驱动），
// 旧版 resize 只 sample（按当时布局读 getTarget()），scroll 监听始终绑在
// start() 时的旧容器上：跨越断点后新容器的滚动无人采样，show 卡死——
// 桌面(滚 .pg-main 800)→窄屏：卡「可见」浮在页顶；窄屏→桌面：卡「隐藏」
// 直到下次 resize。start() 幂等且自带目标漂移重绑（useRafScroll 语义），
// 故 resize 时 rAF 一帧后（断点类切换的布局已 settle）重绑 + 重采样；
// 首帧的 sample() 保留即时读（不等 rAF，沿用原行为）。不引入任何宽度常量——
// 修复对断点无感知，任意「overflow 模式随视口切换」的宿主布局均受益。
function onResize() {
  scrollerRaf.sample()
  requestAnimationFrame(() => scrollerRaf.start())
}

// show 判定不再以「一次性事件重绑」为正确性依赖——rAF 循环内每
// FRAME_BUDGET 帧采样一次，直接读 getTarget() 求值出的「当前真实滚动容器」的
// scrollTop 判定 show（容器漂移自动跟随，不新增宽度判据）；
// useRafScroll 的 scroll 监听与 resize 重绑仅作优化（更快收敛），
// 正确性由轮询兜底（连续 resize 中 rAF 重绑丢帧 / 监听残留在已失效容器
// / 视觉视口变化不触发 window resize 的场景均被轮询覆盖）。
const FRAME_BUDGET = 4 // 60fps 下 ~15Hz 采样，帧预算限制避免每帧 getComputedStyle
let pollRaf = 0
let pollFrame = 0

function poll() {
  if (!pollRaf) return // 已卸载
  if (++pollFrame >= FRAME_BUDGET) {
    pollFrame = 0
    scrollerRaf.sample()
  }
  pollRaf = requestAnimationFrame(poll)
}

onMounted(() => {
  scrollerRaf.start()
  window.addEventListener('resize', onResize, { passive: true })
  requestAnimationFrame(scrollerRaf.sample)
  pollRaf = requestAnimationFrame(poll)
})
onBeforeUnmount(() => {
  pollRaf = 0 // 终止轮询（挂起的 rAF 回调见 !pollRaf 早退）
  scrollerRaf.stop()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <Teleport to="body">
    <transition name="aero-backtop">
      <button
        v-if="show"
        class="aero-backtop"
        type="button"
        :style="{ right: right + 'px', bottom: bottom + 'px' }"
        :aria-label="backTopLabels.aria"
        @click="goTop"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['arrow-up']" :key="i" :d="d" />
        </svg>
      </button>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.aero-backtop {
  box-sizing: border-box;
  position: fixed;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--ui-ink);
  color: var(--ui-bg);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--ui-z-nav) + 100);
  cursor: pointer;
  transition: background 0.35s, color 0.35s, transform 0.35s;

  &:hover {
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    transform: translateY(-3px) rotate(-6deg);
  }
}

.aero-backtop-enter-active,
.aero-backtop-leave-active {
  transition: opacity 0.35s, transform 0.35s;
}
.aero-backtop-enter-from,
.aero-backtop-leave-to {
  opacity: 0;
  transform: translateY(14px);
}
</style>
