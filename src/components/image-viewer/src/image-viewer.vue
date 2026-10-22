<script setup lang="ts">
/**
 * ImageViewer 图片查看器 —— 滚轮缩放 / 拖拽平移 / 双指无极捏合 / 双击复位 / 左右旋转 / 多图切换
 * 快捷键：Esc 关闭、←→ 切换、+/- 缩放、0 复位、R 旋转
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：工具条/翻页/关闭 aria 走词包（ConfigProvider locale 注入）
const { imageViewer: viewerLabels, common: commonLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    urlList: string[]
    /** 初始索引 */
    initial?: number
  }>(),
  { initial: 0 },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const idx = ref(props.initial)
const scale = ref(1)
const rotate = ref(0)
const tx = ref(0)
const ty = ref(0)
/** 未变换（scale=1, 无位移）时 img 左上角的屏幕坐标：flex 容器中心对齐后的
    落点。捏合锚点公式需要把「视口坐标的指尖中点」与「translate 语义下的
    左上角偏移」换算到同一坐标系，缺了它锚点会混入落点常数而随 k 漂移 */
const origin = ref({ x: 0, y: 0 })
/** 未变换时 img 尺寸的一半（元素内中心点 C，origin=50% 50% 的旋转/缩放
 不动点）。transform-origin 取 center 后 M·(C) = C 自动成立，左上角屏幕坐标 = L + t + C − M·C，
 捏合锚点公式须补 C − M·C 项（M = scale(k)·rotate(r)，r 捏合期间恒定） */
const center = ref({ x: 0, y: 0 })
const imgEl = ref<HTMLImageElement | null>(null)
/* dragging：单指/鼠标平移，驱动 cursor 与去过渡；pinching：双指捏合 */
const dragging = ref(false)
const pinching = ref(false)
const panning = computed(() => dragging.value || pinching.value)

const total = computed(() => props.urlList.length)
const cur = computed(() => props.urlList[idx.value] ?? '')

const imgStyle = computed(() => ({
  transform: `translate(${tx.value}px, ${ty.value}px) scale(${scale.value}) rotate(${rotate.value}deg)`,
}))

const MIN_SCALE = 0.2
const MAX_SCALE = 6

/** 缩放钳制到 [MIN, MAX]：滚轮/工具条步进与捏合写回共用的唯一收口 */
function clampScale(v: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, v))
}

function reset() {
  scale.value = 1
  rotate.value = 0
  tx.value = 0
  ty.value = 0
}

/** 校准未变换落点与元素中心：临时归零 transform 读 img 左上角屏幕坐标与
    几何中心（origin=center 旋转/缩放不动点），读完恢复。
    落点随图片尺寸/容器变化，故在每次打开与切换图片后各校准一次 */
function calibrateOrigin() {
  const el = imgEl.value
  if (!el) return
  const t = tx.value
  const r = ty.value
  const s = scale.value
  const rot = rotate.value
  tx.value = 0
  ty.value = 0
  scale.value = 1
  rotate.value = 0
  requestAnimationFrame(() => {
    const b = el.getBoundingClientRect()
    origin.value = { x: b.left, y: b.top }
    center.value = { x: b.width / 2, y: b.height / 2 }
    // rAF 与恢复之间若发生手势，保留手势态，避免踩掉进行中的捏合
    tx.value = t
    ty.value = r
    scale.value = s
    rotate.value = rot
  })
}

/** transform-origin 0 0 → center 后捏合锚点补差——origin=center 时
 元素左上角屏幕坐标 = L + t + C − k·R·C（C = 元素内中心，k = 缩放，
 R = 旋转；旋转贴于 C 时 R·C 项使左上角多偏移）。锚定推导（m/m0 为
 指尖中点视口坐标，u 为被锚定像素的元素坐标）：
 m − L − C − t = k·R(u − C)
 m0 − L − C − t0 = s0·R(u − C) （r 捏合期间恒定，R 消去）
 t = m − L − C − (k/s0)(m0 − L − t0 − C)
 = [m − L − (k/s0)(m0 − L − t0)] + C·(k/s0 − 1) ← 旧式 + 补差
 补差两轴同式（不依赖 R）：ratio=1（起始帧）时为 0，无跳变；
 纯旋转 k=s0 时亦为 0 */
function pinchOriginFix(ratio: number) {
  const c = center.value
  const f = ratio - 1
  return { x: c.x * f, y: c.y * f }
}

function zoom(delta: number) {
  scale.value = clampScale(scale.value * delta)
}

function rotateBy(deg: number) {
  rotate.value = (rotate.value + deg + 360) % 360
}

function close() {
  emit('update:modelValue', false)
}
function prev() {
  reset()
  idx.value = (idx.value - 1 + total.value) % total.value
}
function next() {
  reset()
  idx.value = (idx.value + 1) % total.value
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12)
}

/* —— 指针管理：支持鼠标单指平移与移动端双指连续捏合 ——
   用 Map 跟踪全部活跃指针（而非单个 px/py），因为双指中任意一根抬起
   后需要立刻把剩下的那根重新锚定为单指平移，否则会瞬移。
   坐标一律用 clientX/Y（视口坐标），与 img 的 translate 同处一个
   fixed 定位父级下，无需再做容器偏移换算。 */
type Pt = { x: number; y: number }
const pointers = new Map<number, Pt>()
/** 单指平移锚点：按下时指针与当前位移的差值 */
let panX = 0
let panY = 0
/** 双指捏合起始快照：两指间距 d0（屏像素距离，作锚点换算除数）、
    中点、当时的 scale 与位移 */
let pinchDist = 0
let pinchMid: Pt = { x: 0, y: 0 }
let pinchScale = 1
let pinchTx = 0
let pinchTy = 0

function midOf(pts: Pt[]): Pt {
  return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
}
function distOf(pts: Pt[]): number {
  return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
}

function beginPan(p: Pt) {
  panX = p.x - tx.value
  panY = p.y - ty.value
}
function beginPinch(pts: Pt[]) {
  pinchDist = distOf(pts) || 1
  pinchMid = midOf(pts)
  pinchScale = scale.value
  pinchTx = tx.value
  pinchTy = ty.value
}

function onDown(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  const pts = [...pointers.values()]
  if (pointers.size === 1) {
    dragging.value = true
    beginPan(pts[0])
    return
  }
  // 第二指落下：由平移切换为捏合，随后各指移动都按捏合公式处理
  if (pointers.size === 2) {
    dragging.value = false
    pinching.value = true
    // 以「按下瞬间」的指尖坐标建基准而非等 move 帧：两指先落定、
    // 开合由后续 move 决定，避免第一帧即发生跳变
    beginPinch(pts)
  }
}

function onMove(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

  if (pointers.size >= 2) {
    const pts = [...pointers.values()]
    const d = distOf(pts) || 1
    const mid = midOf(pts)
    /* 锚定「起始两指中点 m0 覆盖的那枚图像像素」。以屏幕系推：
       img 左上角屏幕坐标 = 未变换落点 L + 位移 t（transform-origin: center，
       Q4 起；origin=center 的左上角补差 C·(k/s0 − 1) 由 pinchOriginFix 处理）。
       m0 覆盖像素在未变换坐标系下的固定偏移记 u：
         m0 − L = t0 + u·s0      （起始帧）
         m  − L = t  + u·k       （当前帧，k = s0·d/d0）
       两式相减消去 L 与 u：
         t = m − L − (m0 − L − t0)·(k / s0)
       注意 m0、m 是视口坐标而 t 是相对 L 的偏移：(m0 − L − t0) 含落点
       常数项，不可省略 L，否则锚点随 k 漂移（初版「越缩越偏」根因）。
       k 不预先钳制：锚点按真实 k 走，仅写回 scale 时经 clampScale
       收敛，触顶/触底时平移与缩放互不拉扯。 */
    const o = origin.value
    const s0 = pinchScale
    const m0x = pinchMid.x - o.x
    const m0y = pinchMid.y - o.y
    const k = s0 * (d / pinchDist)
    /* transform-origin 改 center 后的补差项 C·(k/s0 − 1)（两轴同式，
 不依赖旋转角；起始帧 ratio=1 时为 0 无跳变，纯旋转 k=s0 亦为 0） */
    const f = pinchOriginFix(k / s0)
    const nextTx = mid.x - o.x - (m0x - pinchTx) * (k / s0) + f.x
    const nextTy = mid.y - o.y - (m0y - pinchTy) * (k / s0) + f.y
    scale.value = clampScale(k)
    tx.value = nextTx
    ty.value = nextTy
    return
  }

  if (dragging.value) {
    const p = [...pointers.values()][0]
    tx.value = p.x - panX
    ty.value = p.y - panY
  }
}

function onUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  const pts = [...pointers.values()]
  if (pts.length >= 2) {
    // 三指抬起一根：以剩余两指重新起算捏合基准，避免比例跳变
    beginPinch(pts)
    return
  }
  pinching.value = false
  if (pts.length === 1) {
    // 双指抬起一根：剩余那根重新锚定为平移基准，接续拖拽不跳位
    dragging.value = true
    beginPan(pts[0])
    return
  }
  dragging.value = false
}

/** 指针在组件外被系统取消（来电、手势返回等）时：只摘除该指针，
   剩余指针继续按 1 指/2 指 状态跟踪，不清空 Map */
function onCancel(e: PointerEvent) {
  pointers.delete(e.pointerId)
  const pts = [...pointers.values()]
  pinching.value = pts.length >= 2
  dragging.value = pts.length === 1
  if (pts.length >= 2) beginPinch(pts)
  else if (pts.length === 1) beginPan(pts[0])
}

function onKey(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
  if (e.key === '+' || e.key === '=') zoom(1.2)
  if (e.key === '-') zoom(1 / 1.2)
  if (e.key === '0') reset()
  if (e.key.toLowerCase() === 'r') rotateBy(90)
}

watch(
  () => props.modelValue,
  (o) => {
    if (o) {
      idx.value = props.initial
      reset()
      document.addEventListener('keydown', onKey)
      // 打开时校准未变换落点（图片 load 完成前尺寸为 0，故 load 后再校准一次）
      nextTick(calibrateOrigin)
    } else {
      document.removeEventListener('keydown', onKey)
    }
  },
)

/** 切换/当前图片加载完成后尺寸才稳定，重新校准落点 */
function onImgLoad() {
  calibrateOrigin()
}

onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <transition name="aero-viewer">
      <div v-if="modelValue" class="aero-viewer" @click.self="close" @wheel.prevent="onWheel">
        <img
          ref="imgEl"
          class="aero-viewer__img"
          :class="{ 'is-pan': panning }"
          :src="cur"
          alt=""
          :style="imgStyle"
          draggable="false"
          @load="onImgLoad"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onCancel"
          @dblclick="reset"
        />

        <!-- 工具条：缩放 / 旋转 / 复位 -->
        <div class="aero-viewer__tools" @click.stop>
          <button type="button" :aria-label="viewerLabels.zoomOut" @click="zoom(1 / 1.2)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14" /></svg>
          </button>
          <b class="aero-viewer__pct">{{ Math.round(scale * 100) }}%</b>
          <button type="button" :aria-label="viewerLabels.zoomIn" @click="zoom(1.2)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          </button>
          <i class="aero-viewer__sep" />
          <button type="button" :aria-label="viewerLabels.rotateLeft" @click="rotateBy(-90)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
          </button>
          <button type="button" :aria-label="viewerLabels.rotateRight" @click="rotateBy(90)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
          </button>
          <i class="aero-viewer__sep" />
          <button type="button" :aria-label="viewerLabels.reset" @click="reset">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, i) in iconPaths['refresh']" :key="i" :d="d" /></svg>
          </button>
        </div>

        <button v-if="total > 1" class="aero-viewer__nav is-prev" type="button" :aria-label="viewerLabels.prev" @click="prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path v-for="(d, i) in iconPaths['chevron-left']" :key="i" :d="d" />
          </svg>
        </button>
        <button v-if="total > 1" class="aero-viewer__nav is-next" type="button" :aria-label="viewerLabels.next" @click="next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path v-for="(d, i) in iconPaths['chevron-right']" :key="i" :d="d" />
          </svg>
        </button>
        <span v-if="total > 1" class="aero-viewer__idx">{{ idx + 1 }} / {{ total }}</span>
        <button class="aero-viewer__close" type="button" :aria-label="commonLabels.close" @click="close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path v-for="(d, i) in iconPaths['x']" :key="i" :d="d" />
          </svg>
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.aero-viewer {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  z-index: calc(var(--ui-z-tip) + 10);
  background: rgba(4, 12, 20, 0.82);
  backdrop-filter: var(--ui-blur-mask);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  /* 遮罩层覆盖整个视口，必须在此声明 none：否则浏览器按祖先的可滚动性
     把手势判定为页面滚动/缩放，双指与拖拽会因为"手势被浏览器接管"而收到
     pointercancel 而非 pointerdown/move，组件侧完全收不到指针序列。
     img 自身也需保留 none，故两处都写。 */
  touch-action: none;
  overscroll-behavior: contain;

  &__img {
    max-width: 90%;
    max-height: 90%;
    /* 变换原点为 center（元素中心）：
       缩放与旋转均围绕图片中心（M·C = C，
       中心 C 为不动点）；捏合锚点公式补「左上角补差 C·(k/s0 − 1)」项
       （pinchOriginFix，起始帧与纯旋转时为 0，纯缩放/旋转单独操作行为不变）。 */
    transform-origin: center;
    border-radius: var(--ui-radius-lg);
    border: 3px solid var(--ui-card);
    box-shadow: var(--ui-shadow-xl);
    transition: transform 0.2s var(--ui-spring);
    cursor: grab;
    touch-action: none;

    /* 平移与捏合期间都去掉过渡：过渡会让每帧的微小 scale 变化被插值，
       捏合手感发飘、且与指尖不同步 */
    &.is-pan {
      cursor: grabbing;
      transition: none;
    }
  }

  &__tools {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 5px 8px;
    box-shadow: 4px 4px 0 var(--ui-bg-tint);

    button {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      border: 2px solid transparent;
      background: none;
      color: var(--ui-ink-2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.2s var(--ui-spring);

      &:hover {
        border-color: var(--ui-brand);
        color: var(--ui-brand-ink);
        transform: translateY(-2px);
      }
    }
  }

  &__pct {
    font-family: var(--ui-font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--ui-brand-ink);
    min-width: 44px;
    text-align: center;
  }

  &__sep {
    width: 2px;
    height: 20px;
    border-radius: 2px;
    background: var(--ui-line);
    margin: 0 3px;
  }

  &__nav,
  &__close {
    position: absolute;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    border: 2px solid var(--ui-line-2);
    background: var(--ui-card);
    color: var(--ui-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.25s var(--ui-spring);
    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
      transform: translateY(-2px) rotate(-6deg);
    }
  }
  &__nav.is-prev { left: 26px; }
  &__nav.is-next { right: 26px; }
  &__close {
    top: 22px;
    right: 26px;
    &:hover { transform: rotate(90deg); }
  }

  &__idx {
    position: absolute;
    bottom: 86px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--ui-font-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--ui-ink-3);
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 99px;
    padding: 4px 14px;
  }
}

.aero-viewer-enter-active,
.aero-viewer-leave-active {
  transition: opacity 0.3s;
  .aero-viewer__img {
    transition: transform 0.35s var(--ui-spring);
  }
}
.aero-viewer-enter-from,
.aero-viewer-leave-to {
  opacity: 0;
  .aero-viewer__img {
    transform: scale(0.88) rotate(-1.5deg);
  }
}
</style>
