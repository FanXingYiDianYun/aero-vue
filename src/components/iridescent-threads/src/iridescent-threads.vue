<script setup lang="ts">
/**
 * IridescentThreads 虹彩丝线 —— 环境氛围背景装饰（非迪斯科灯球）
 *
 * 定位（环境氛围背景装饰，非迪斯科灯球）：
 * - 6–8 条曲线（默认 7）；stroke 1–2px；alpha 0.12–0.3
 * - 大面积低透明 + 留白（曲线分布均匀，不聚焦单点）
 * - 颜色从 var(--ui-brand) 派生（brand + 两邻近 hue ±20°），明暗主题各自成立
 * - 两层：清晰层 + blur(6px) 光晕层（alpha 减半）
 * - 动画 24–40s 缓慢循环（默认 32s）
 * - prefers-reduced-motion 时静止（不漂移）
 *
 * 实现：双 canvas（清晰层 + 光晕层，光晕层 CSS blur(6px) 滤镜），
 * IntersectionObserver 离屏暂停；颜色每帧从 --ui-brand 实时解析
 * （主题切换/预设变更自动跟随，无需监听 data-theme）。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 丝线数量（默认 7，规格 6–8 条） */
    count?: number
    /** 漂移周期秒数（默认 32s，规格 24–40s 缓慢循环） */
    cycle?: number
    /** 色相偏移（叠加到品牌色相，默认 0 = 品牌色） */
    hueShift?: number
    /** 整体不透明度倍率（默认 1，曲线 alpha 按规格 0.12–0.3） */
    opacity?: number
  }>(),
  { count: 7, cycle: 32, hueShift: 0, opacity: 1 },
)

const stageRef = ref<HTMLDivElement>()
const clearRef = ref<HTMLCanvasElement>()
const glowRef = ref<HTMLCanvasElement>()

let raf = 0
let t = 0
let inView = false
let reducedMotion = false

/** 解析 --ui-brand 为 HSL 色相（hex #RRGGBB → HSL H） */
function brandHue(): number {
  const el = stageRef.value
  const raw = getComputedStyle(el?.parentElement ?? document.body).getPropertyValue('--ui-brand').trim()
  if (raw.startsWith('#') && raw.length === 7) {
    const r = parseInt(raw.slice(1, 3), 16) / 255
    const g = parseInt(raw.slice(3, 5), 16) / 255
    const b = parseInt(raw.slice(5, 7), 16) / 255
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
    const d = mx - mn
    let h = 0
    if (d !== 0) {
      if (mx === r) h = 60 * (((g - b) / d) % 6)
      else if (mx === g) h = 60 * ((b - r) / d + 2)
      else h = 60 * ((r - g) / d + 4)
      if (h < 0) h += 360
    }
    return h
  }
  return 190
}

interface Thread {
  y0: number
  amp: number
  freq: number
  phase: number
  width: number
  /** 曲线 alpha（规格 0.12–0.3） */
  alpha: number
  /** 色相偏移：brand 派生（0 / +20° / -20° 三档） */
  hueOff: number
}

function genThreads(n: number): Thread[] {
  const arr: Thread[] = []
  for (let i = 0; i < n; i++) {
    const u = n > 1 ? i / (n - 1) : 0.5
    arr.push({
      // 均匀分布 + 微偏移（留白感：曲线不挤在一起）
      y0: 0.1 + u * 0.8 + (i % 2 ? 0.02 : -0.02),
      amp: 0.06 + (i % 3) * 0.02,
      freq: 0.8 + ((i * 2) % 3) * 0.3,
      phase: (i * 1.7) % (Math.PI * 2),
      // stroke 1–2px（规格）
      width: 1 + (i % 3) * 0.5,
      // alpha 0.12–0.3（规格：大面积低透明 + 留白）
      alpha: 0.12 + (i % 4) * 0.06,
      // brand + 两邻近 hue（±20° 三档派生）
      hueOff: i % 3 === 0 ? 0 : i % 3 === 1 ? 20 : -20,
    })
  }
  return arr
}

const threads = ref<Thread[]>([])

function drawLayer(cvs: HTMLCanvasElement, glowScale: number) {
  const parent = cvs.parentElement
  if (!parent) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = parent.clientWidth
  const h = parent.clientHeight
  if (!w || !h) return
  if (cvs.width !== w * dpr || cvs.height !== h * dpr) {
    cvs.width = w * dpr
    cvs.height = h * dpr
  }
  const ctx = cvs.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const baseHue = brandHue()
  const sat = 70
  const lit = 58

  for (const th of threads.value) {
    const steps = 72
    ctx.lineWidth = th.width * glowScale
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const hue = (baseHue + props.hueShift + th.hueOff + 360) % 360
    // 光晕层 alpha 减半（规格）
    const alpha = th.alpha * props.opacity * (glowScale > 1 ? 0.5 : 1)

    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${alpha})`
    ctx.beginPath()
    for (let i = 0; i <= steps; i++) {
      const u = i / steps
      const x = u * w
      const y =
        (th.y0 + Math.sin(u * Math.PI * th.freq * 2 + th.phase + t) * th.amp) * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function draw() {
  // 清晰层
  drawLayer(clearRef.value!, 1)
  // 光晕层（alpha 减半，CSS blur(6px) 滤镜）
  drawLayer(glowRef.value!, 2.2)
}

function loop() {
  if (!inView || reducedMotion) return
  t += 0.016 / (props.cycle / 32)
  draw()
  raf = requestAnimationFrame(loop)
}

function onMotionChange() {
  reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  if (reducedMotion) {
    cancelAnimationFrame(raf)
    t = 0
    draw() // 静止帧
  } else if (inView) {
    loop()
  }
}

onMounted(() => {
  threads.value = genThreads(props.count)
  onMotionChange()
  if (!reducedMotion) {
    draw()
  }
  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting
    if (inView && !reducedMotion) loop()
    else cancelAnimationFrame(raf)
  })
  io.observe(stageRef.value!)
  window.addEventListener('resize', () => { if (inView || reducedMotion) draw() })
  window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', onMotionChange)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', () => draw())
  window.matchMedia?.('(prefers-reduced-motion: reduce)').removeEventListener?.('change', onMotionChange)
})

watch(() => props.count, (n) => {
  threads.value = genThreads(n)
  if (inView || reducedMotion) draw()
})
watch(() => props.cycle, () => { /* t 速率在 loop 内按 cycle 计算 */ })
watch(() => props.hueShift, () => { if (inView || reducedMotion) draw() })
watch(() => props.opacity, () => { if (inView || reducedMotion) draw() })
</script>

<template>
  <div ref="stageRef" class="aero-threads" aria-hidden="true">
    <!-- 光晕层（底层）：blur(6px) 滤镜 + alpha 减半（规格两层结构） -->
    <canvas ref="glowRef" class="aero-threads__glow" />
    <!-- 清晰层（顶层） -->
    <canvas ref="clearRef" class="aero-threads__clear" />
  </div>
</template>

<style scoped lang="scss">
.aero-threads {
  box-sizing: border-box;
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  canvas {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
  }

  /* 光晕层：blur(6px) + alpha 减半（规格：两层 清晰层 + blur(6px) 光晕层） */
  &__glow {
    filter: blur(6px);
    z-index: 0;
  }

  &__clear {
    z-index: 1;
  }
}
</style>
