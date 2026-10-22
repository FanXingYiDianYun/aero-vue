<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 点阵形状 */
    shape?: 'dot' | 'x' | 'diamond' | 'ring'
    /** 点间距 px */
    density?: number
    /** 流光（品牌色对角线余弦波带缓慢漂移，默认关闭；
        参考 aliyun 首页美学：克制、单色渐变、低饱和度，避免花哨虹彩） */
    flow?: boolean
    /** 流光速度倍率 */
    speed?: number
    /** 点色（默认 token --ui-dot，灰蓝色；流光态自动派生品牌色） */
    color?: string
  }>(),
  { shape: 'dot', density: 26, flow: false, speed: 1, color: undefined },
)

const canvasRef = ref<HTMLCanvasElement>()
let raf = 0
let running = false
let t = 0

/** 品牌色（流光态用）：从 --ui-brand 解析成 hsl 分量，保证与主题一致 */
function brandHsl(): { h: number; s: number; l: number } {
  const raw = getComputedStyle(canvasRef.value?.parentElement ?? document.body).getPropertyValue('--ui-brand').trim()
  // 直接给 hex #RRGGBB 转换
  if (raw.startsWith('#') && raw.length === 7) {
    const r = parseInt(raw.slice(1, 3), 16) / 255
    const g = parseInt(raw.slice(3, 5), 16) / 255
    const b = parseInt(raw.slice(5, 7), 16) / 255
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
    const l = (mx + mn) / 2
    const d = mx - mn
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
    let h = 0
    if (d !== 0) {
      if (mx === r) h = 60 * (((g - b) / d) % 6)
      else if (mx === g) h = 60 * ((b - r) / d + 2)
      else h = 60 * ((r - g) / d + 4)
      if (h < 0) h += 360
    }
    return { h, s: s * 100, l: l * 100 }
  }
  return { h: 190, s: 80, l: 55 } // 默认品牌青蓝
}

function draw() {
  const cvs = canvasRef.value
  const parent = cvs?.parentElement
  if (!cvs || !parent) return
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

  const step = props.density
  const staticColor = props.color ?? (getComputedStyle(parent).getPropertyValue('--ui-dot').trim() || 'rgba(14,191,255,.3)')
  const { h: bh, s: bs } = brandHsl()

  /* 流光：品牌色相为主 + 邻近色相带（±35° 正弦摆动），
     饱和度 80%，明度随光带能量 42→68%；
     光带只调制点本体（半径放大 + 提亮），光晕收窄至 3px 内、alpha ≤0.25，
     保持点阵清晰锐利（上轮 4-7px 光晕叠加 1.6px 小点形成模糊光斑，观感劣质） */
  const WAVE_LEN = 720
  const base = (t * 1) % WAVE_LEN

  function energyAt(travel: number): number {
    let d = Math.abs(((travel - base) % WAVE_LEN + WAVE_LEN) % WAVE_LEN)
    if (d > WAVE_LEN / 2) d = WAVE_LEN - d
    if (d > 100) return 0
    return Math.cos((d / 100) * (Math.PI / 2)) ** 2
  }

  ctx.lineWidth = 1.4

  for (let x = step / 2; x < w; x += step) {
    for (let y = step / 2; y < h; y += step) {
      const travel = x + y
      const e = props.flow ? energyAt(travel) : 0

      let useColor: string
      let alpha: number
      if (props.flow) {
        // 色相 = 品牌色相 + 沿对角线位置的 ±35° 正弦摆动（随位置+时间推移）
        const hue = (bh + Math.sin((travel * 0.012 + t * 0.08)) * 35 + 360) % 360
        const sat = Math.min(bs, 80)
        const l = 40 + e * 28
        useColor = `hsl(${hue}, ${sat}%, ${l}%)`
        alpha = 0.3 + e * 0.6
      } else {
        useColor = staticColor
        alpha = 0.22
      }

      // 光晕：flow 且 e>0.3 时画，半径 ≤3px（3+0），alpha ≤0.25，
      // 仅作轻微提亮 halo，不形成模糊光斑，点阵本体保持锐利
      if (props.flow && e > 0.3) {
        ctx.globalCompositeOperation = 'source-over'
        const hue = (bh + Math.sin((travel * 0.012 + t * 0.08)) * 35 + 360) % 360
        const gr = 3
        const l2 = 52 + e * 16
        const grad = ctx.createRadialGradient(x, y, 0, x, y, gr)
        grad.addColorStop(0, `hsla(${hue}, ${Math.min(bs, 70)}%, ${l2}%, 0.25)`)
        grad.addColorStop(1, `hsla(${hue}, ${Math.min(bs, 70)}%, ${l2}%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, gr, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = alpha
      ctx.strokeStyle = useColor
      ctx.fillStyle = useColor

      /* 点本体：flow 态光带核心点放大（1.6 + e*1.4 → 最大 3px）并提亮，
         静态态保持 1.6px 小点清晰；x/diamond/ring 形状同样按 e 放大 */
      const sBase = 2
      const s = props.flow ? sBase * (0.8 + e * 0.9) : sBase
      switch (props.shape) {
        case 'x':
          ctx.beginPath()
          ctx.moveTo(x - s, y - s)
          ctx.lineTo(x + s, y + s)
          ctx.moveTo(x + s, y - s)
          ctx.lineTo(x - s, y + s)
          ctx.stroke()
          break
        case 'diamond':
          ctx.beginPath()
          ctx.moveTo(x, y - s)
          ctx.lineTo(x + s, y)
          ctx.lineTo(x, y + s)
          ctx.lineTo(x - s, y)
          ctx.closePath()
          ctx.stroke()
          break
        case 'ring':
          ctx.beginPath()
          ctx.arc(x, y, s * 0.9, 0, Math.PI * 2)
          ctx.stroke()
          break
        default:
          ctx.beginPath()
          ctx.arc(x, y, 1.6 + (props.flow ? e * 1.4 : 0), 0, Math.PI * 2)
          ctx.fill()
      }
    }
  }
  ctx.globalAlpha = 1
}

function loop() {
  if (!running) return
  // 流光漂移速度：0.8 帧/px，60fps 下光带横穿 620px 约 13s，
  // 观感为缓慢流动的光带，每次抬眼位置明显不同。
  t += 0.8 * props.speed
  draw()
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running || !props.flow) return
  running = true
  loop()
}
function stop() {
  running = false
  cancelAnimationFrame(raf)
}

let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let inView = false
onMounted(() => {
  draw()
  // 离屏暂停（GPU 隔离方案核心）
  io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting
    if (inView) {
      start()
    } else {
      stop()
    }
  })
  io.observe(canvasRef.value!.parentElement!)
  // ResizeObserver 兜底「非 window-resize」的父容器尺寸变化——
  // demo 舞台 .df-stage{aspect-ratio} 宽度随侧栏折叠/代码面板展开等布局位移改变，
  // window resize 不触发 → canvas 缓冲与 CSS 盒脱节（固定宽度 + overflow:hidden 时点阵被裁右侧）。
  // RO 观察直接父级，任何宽高变化即时重绘；draw() 内部已做尺寸 diff + dpr 缩放。
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => draw())
    ro.observe(canvasRef.value!.parentElement!)
  }
  window.addEventListener('resize', draw)
})
onBeforeUnmount(() => {
  stop()
  io?.disconnect()
  ro?.disconnect()
  window.removeEventListener('resize', draw)
})

/**
 * flow 开关由外部 v-model 驱动（如 demo 的 AeroSwitch），
 * IntersectionObserver 只在挂载时 observe 一次、不会因 prop 变化重触发，
 * 故此处显式联动：开启即启动 raf（若离屏则等 IO 回交再启），关闭即停。
 */
watch(
  () => props.flow,
  (on) => {
    if (on) {
      // 开启流光：立即启动（若已在可视区内）或等 IO 回来
      start()
    } else {
      stop()
      // 关闭后画一帧静态点阵（在可视区内才有意义）
      if (inView) draw()
    }
  },
)
</script>

<template>
  <div class="aero-dotfield" aria-hidden="true">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.aero-dotfield {
  box-sizing: border-box;
  // 填充父级盒（父需 relative + 有高度）；absolute + inset:0
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  width: 100%;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}

// 静态形状在 flow 关闭时只需绘制一次，无需 raf —— draw() 由 resize 触发
</style>
