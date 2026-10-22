<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    content: string
    /** 旋转角度 */
    rotate?: number
    /** 间隔 px */
    gap?: number
    /** 字号 */
    fontSize?: number
    opacity?: number
    /** 最大宽度（px 或 CSS 值） */
    maxWidth?: number | string
    /** 圆角（px 或 CSS 值） */
    radius?: number | string
  }>(),
  { rotate: -22, gap: 140, fontSize: 18, opacity: 0.22 },
)

const url = ref('')

const wmStyle = computed(() => ({
  '--wm-image': toUrl(url.value),
  '--wm-opacity': props.opacity,
  maxWidth: props.maxWidth !== undefined ? (typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth) : undefined,
  borderRadius: props.radius !== undefined ? (typeof props.radius === 'number' ? `${props.radius}px` : props.radius) : undefined,
}))

/** hex 混合：把 ink 向 brand 混入 pct%（自算，避免 canvas 对 color-mix() 语法不解析）
 *  G2.8 修复：
 *  1. off-by-one：旧 [1,3,5] slice → 应为 [0,2,4]（'#EDF3F9' 取 'ED','F3','F9' 而非 'DF','3F','F9'）
 *  2. 深色 ink 若为非 hex（oklch/rgb）则走 canvas 采样路径，保证实际计算色正确
 */
function mixHexSafe(ink: string, brand: string, pct = 22): string | null {
  const parse = (x: string): [number, number, number] | null => {
    const m = /^#?([0-9a-f]{6})$/i.exec(x.trim())
    if (!m) return null
    return [
      parseInt(m[1].slice(0, 2), 16),
      parseInt(m[1].slice(2, 4), 16),
      parseInt(m[1].slice(4, 6), 16),
    ]
  }
  const t = pct / 100
  const f = (v: number, o: number) => Math.round(v + (o - v) * t)

  // hex 快速路径
  const a = parse(ink)
  const b = parse(brand)
  if (a && b) {
    const r = f(a[0], b[0]), g = f(a[1], b[1]), bl = f(a[2], b[2])
    return `rgb(${r}, ${g}, ${bl})`
  }

  // 非 hex（oklch / rgb / color-mix 展开值）：canvas 采样实际计算色
  if (ink && ink !== 'transparent') {
    try {
      const c = document.createElement('canvas'); c.width = 1; c.height = 1
      const ctx = c.getContext('2d')!
      ctx.fillStyle = ink
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      if (b) {
        return `rgb(${f(d[0], b[0])}, ${f(d[1], b[1])}, ${f(d[2], b[2])})`
      }
      return `rgb(${d[0]}, ${d[1]}, ${d[2]})`
    } catch {
      /* ignore */
    }
  }
  return null
}

/** url(...) 字符串必须整体加引号，否则 dataURL 的逗号/分号会破坏 CSS 语法 */
function toUrl(v: string): string {
  return v ? `url("${v}")` : 'none'
}

function render() {
  const c = document.createElement('canvas')
  const w = props.gap
  const h = props.gap
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  ctx.translate(w / 2, h / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  // I2 根因修复：strokeStyle 原在 fillStyle 赋值之前取（canvas 默认黑），
  // strokeText 永远画 2px 黑描边——亮主题白底容忍黑描边，暗主题黑描边吞没在
  // 深底里，整图不可辨识（此前两轮"已修"实际 URL 已变、主导像素色未变的根因）。
  // 加粗 + 放大字形：0.22 透明度下小字号文字在亮/暗底上均清晰可辨
  ctx.lineWidth = 2
  // 字体必须写真实字族名——canvas 不解析 CSS 变量；--ui-font-mono 为 Space Grotesk
  // 颜色取 --ui-ink 实值并向品牌色混入 30%（JS 自算混合，不依赖 canvas 对
  // color-mix() 语法的解析），保证 0.22 透明度下深浅底均清晰可辨
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--ui-ink').trim()
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--ui-brand').trim()
  ctx.fillStyle = mixHexSafe(ink, brand, 30) || 'rgba(12, 27, 42, 1)'
  ctx.strokeStyle = ctx.fillStyle
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.content, 0, 0)
  ctx.strokeText(props.content, 0, 0)
  url.value = c.toDataURL()
}

let themeObs: MutationObserver | null = null
onMounted(() => {
  render()
  // 主题切换（data-theme 属性变化，非 Vue 响应式数据）时按新 ink 色重生成水印
  themeObs = new MutationObserver(render)
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-preset'] })
})
onBeforeUnmount(() => themeObs?.disconnect())
watch(() => [props.content, props.rotate, props.gap, props.fontSize], render)
</script>

<template>
  <div class="aero-watermark" :style="wmStyle">
    <div class="aero-watermark__wm" aria-hidden="true" />
    <div class="aero-watermark__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-watermark {
  box-sizing: border-box;
  position: relative;
  display: block;

  /* 水印层：独立 DOM 元素而非 ::before——
     旧实现用伪元素 + 子级 z-index:1，但子组件（如 AeroCard）自带
     不透明实底 background，水印永远被内容卡片盖住不可见。
     现在水印层放在内容层之上、pointer-events:none 不挡交互，
     文字水印浮在卡片表面，深浅底均可辨认。 */
  &__wm {
    position: absolute;
    inset: 0;
    background-image: var(--wm-image);
    background-repeat: repeat;
    opacity: var(--wm-opacity, 0.22);
    pointer-events: none;
    z-index: 2;
    border-radius: inherit;
  }

  &__content {
    position: relative;
    z-index: 1;
  }
}
</style>
