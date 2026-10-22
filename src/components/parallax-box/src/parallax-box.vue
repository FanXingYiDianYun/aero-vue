<script setup lang="ts">
/**
 * 视差漂浮几何（ParallaxBox）—— 复刻 demo 演示区
 * pointermove 反向位移（data-depth 决定幅度）、点击图形 spin、pointerleave 复位
 * GPU 门控：位移仅 transform（transition 过渡），无 raf 常驻；reduced-motion 下禁用
 * 移动端：touch-action:none + user-select:none 防止文本选择；
 *         devicemotion 陀螺仪驱动视差（加速度映射为位移，lerp 平滑）
 */
import { computed, onBeforeUnmount, onMounted, ref, type VNode } from 'vue'
import { useLocale } from '../../../locale'

// i18n：提示文案缺省走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { parallaxBox: parallaxLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 区高 px */
    height?: number
    /** 提示文案（缺省取词包 parallaxBox.hint） */
    hint?: string
  }>(),
  { height: 250, hint: undefined },
)

const hintText = computed(() => props.hint ?? parallaxLabels.value.hint)

const slots = defineSlots<{ default?: () => VNode[] }>()

const boxRef = ref<HTMLElement>()
const shapesRef = ref<HTMLElement[]>([])
const setShape = (el: unknown) => {
  if (el instanceof HTMLElement && !shapesRef.value.includes(el)) shapesRef.value.push(el)
}

// 陀螺仪平滑位移（lerp 目标值）
const target = { x: 0, y: 0 }
let rafId = 0

function applyParallax(x: number, y: number) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  shapesRef.value.forEach((s) => {
    const d = Number(s.dataset.depth) || 10
    s.style.transform = `translate(${x * d}px, ${y * d}px)`
  })
}

function onMove(e: PointerEvent) {
  const box = boxRef.value
  if (!box) return
  e.preventDefault()
  const r = box.getBoundingClientRect()
  target.x = (e.clientX - r.left) / r.width - 0.5
  target.y = (e.clientY - r.top) / r.height - 0.5
  applyParallax(target.x, target.y)
}

function onLeave() {
  target.x = 0
  target.y = 0
  applyParallax(0, 0)
}

function onShapeClick(s: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  s.classList.remove('is-spin')
  void s.offsetWidth
  s.classList.add('is-spin')
}

/* — 陀螺仪（devicemotion）驱动视差 — */
let hasMotion = false

function onDeviceMotion(e: DeviceMotionEvent) {
  if (!hasMotion) {
    // 首次收到有效数据再启用，避免 iOS 弹权限请求
    if (e.accelerationIncludingGravity) hasMotion = true
  }
  const g = e.accelerationIncludingGravity
  if (!g || !g.x || !g.y) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // 重力向量映射为归一化偏移（±1 对应 0.5 视差范围）
  // x 倾角 → 水平，y 倾角 → 垂直
  const nx = Math.max(-1, Math.min(1, g.x / 9.81))
  const ny = Math.max(-1, Math.min(1, g.y / 9.81))
  target.x = nx * 0.5
  target.y = ny * 0.5
  applyParallax(target.x, target.y)
}

onMounted(() => {
  if ('ontouchstart' in window) {
    window.addEventListener('devicemotion', onDeviceMotion, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('devicemotion', onDeviceMotion)
})
</script>

<template>
  <div
    ref="boxRef"
    class="aero-parallax"
    :style="{ height: height + 'px' }"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <div
      v-for="(n, i) in slots.default?.() ?? []"
      :key="i"
      :ref="(el) => setShape(el)"
      class="aero-parallax__shape"
      :data-depth="[26, 14, 20, 10, 18, 30][i % 6]"
      :style="{
        top: ['12%', '68%', '16%', '72%', '40%', '8%'][i % 6],
        left: ['44%', '20%', '80%', '56%', '8%', '88%'][i % 6],
        animationDelay: ['0s', '1.2s', '0.6s', '1.8s', '0.3s', '2.2s'][i % 6],
      }"
      @click="onShapeClick($event.currentTarget as HTMLElement)"
    >
      <span class="aero-parallax__in"><component :is="n" /></span>
    </div>
    <span class="aero-parallax__hint">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M4 4l7 16 2.5-7.5L21 10z" />
      </svg>
      {{ hintText }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.aero-parallax {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  border: 2px dashed var(--ui-line-2);
  border-radius: var(--ui-radius-xl);
  overflow: hidden;
  cursor: crosshair;
  background: var(--ui-bg);
  /* 移动端：禁用文本选择 + 阻止浏览器触摸滚动 */
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  &__shape {
    position: absolute;
    transition: transform 0.25s ease-out;
    cursor: pointer;
    z-index: 2;
    &:active > span {
      transform: scale(0.82);
    }
  }

  &__in {
    display: block;
    animation: ui-floaty 6s ease-in-out infinite;
  }

  &__shape.is-spin &__in :deep(svg) {
    animation: ui-spin 0.65s var(--ui-spring);
  }

  &__hint {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    gap: 7px;
    align-items: center;
    font-size: 12px;
    color: var(--ui-ink-3);
    background: color-mix(in srgb, var(--ui-bg) 75%, transparent);
    backdrop-filter: blur(6px);
    border: 2px dashed var(--ui-line-2);
    border-radius: var(--ui-radius-pill);
    padding: 5px 15px;
    pointer-events: none;
    white-space: nowrap;
    z-index: 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .aero-parallax__in {
    animation: none;
  }
}
</style>
