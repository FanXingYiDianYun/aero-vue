<script setup lang="ts">
import { ref, watchEffect, watch, provide } from 'vue'
import { useTheme } from '../../../composables'
import type { AeroPreset, AeroTheme } from '../../../composables'

const props = withDefaults(
  defineProps<{
    theme?: AeroTheme
    preset?: AeroPreset
    /** 自定义品牌色 */
    brand?: string
    /**
 * 作用域模式——theme/preset/brand 只写容器自身 CSS 变量（不动 :root、不写 localStorage），
 * 全局主题零 mutation；默认 false 保持原全局语义
 */
    scoped?: boolean
  }>(),
  { scoped: false },
)

const { state, setTheme, setPreset, setBrand, resetBrand } = useTheme()

provide('AeroThemeCtx', { state })

const root = ref<HTMLElement>()

// K7 scoped：预设色板（与 tokens.scss [data-preset] 同源值；on-brand 与 html 规则一致）
const PRESET_VARS: Record<AeroPreset, { brand: string; onBrand?: string }> = {
  aero: { brand: '#0EBFFF' },
  violet: { brand: '#7C6CFF', onBrand: '#fff' },
  mint: { brand: '#10C999' },
  sunset: { brand: '#FF8A3D', onBrand: '#fff' },
  rose: { brand: '#FF5C8A', onBrand: '#fff' },
}
/** 依据亮度推导 on-brand（亮色配墨、暗色配白）—— 与 use-theme shadeFor 同源规则 */
function shadeFor(hex: string) {
  const h = hex.replace('#', '').trim()
  if (!h) return '#fff'
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
  const l = (mx + mn) / 2
  return l * 100 > 52 ? `color-mix(in srgb, ${hex} 30%, #000)` : '#FFFFFF'
}
const SCOPED_VARS = ['--ui-brand', '--ui-on-brand', '--ui-brand-deep', '--ui-brand-ink']

// 全局路径（默认）：原语义不变
watchEffect(() => {
  if (props.scoped) return
  if (props.theme) setTheme(props.theme)
  if (props.preset) setPreset(props.preset)
  if (props.brand) setBrand(props.brand)
  else if (props.brand === undefined && props.preset) {
    // brand 未给则清理自定义色
    resetBrand()
    setPreset(props.preset)
  }
})

// K7 作用域路径：容器 inline 变量 + aero-dark class；仅清理 SCOPED_VARS（零全局副作用），
// 组件卸载随元素销毁自动清掉 inline 样式
watch(
  () => [props.scoped, props.theme, props.preset, props.brand, !!root.value] as const,
  ([scoped, theme, preset, brand]) => {
    if (!scoped || !root.value) return
    const el = root.value
    el.classList.toggle('aero-dark', theme === 'dark')
    const set: Record<string, string> = {}
    if (brand) {
      set['--ui-brand'] = brand
      set['--ui-on-brand'] = shadeFor(brand)
      set['--ui-brand-deep'] = `color-mix(in srgb, ${brand} 86%, #03202E)`
      set['--ui-brand-ink'] = `color-mix(in srgb, ${brand} 52%, #062940)`
    } else if (preset) {
      const p = PRESET_VARS[preset]
      set['--ui-brand'] = p.brand
      if (p.onBrand) set['--ui-on-brand'] = p.onBrand
      set['--ui-brand-deep'] = `color-mix(in srgb, ${p.brand} 86%, #03202E)`
      set['--ui-brand-ink'] = `color-mix(in srgb, ${p.brand} 52%, #062940)`
    }
    for (const [k, v] of Object.entries(set)) el.style.setProperty(k, v)
    SCOPED_VARS.filter((k) => !(k in set)).forEach((k) => el.style.removeProperty(k))
  },
  { immediate: true },
)

defineExpose({ root })
</script>

<template>
  <div ref="root" class="aero-tp">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.aero-tp {
  box-sizing: border-box;
  /* scoped 模式的变量挂容器自身（display:contents 元素不参与盒子，
 inline 变量不生效）；全局模式容器无样式差异，纯包裹 */
  display: block;
}
</style>
