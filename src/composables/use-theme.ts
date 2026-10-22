import { reactive, watchEffect } from 'vue'

export type AeroTheme = 'light' | 'dark'
export type AeroPreset = 'aero' | 'violet' | 'mint' | 'sunset' | 'rose'

/* 主题色（preset）与自定义品牌色（brand）同 light/dark 一样持久化到
   localStorage：此前仅 theme 落盘，preset 只存于模块级 reactive，
   路由切换虽不丢、但刷新即回默认；且 theme-provider demo 卸载时回滚，
   导致「切页即恢复默认」。现统一落盘 + 初始化恢复。 */
const PRESET_KEY = 'aero-ui-preset'
const BRAND_KEY = 'aero-ui-brand'
const storedPreset = localStorage.getItem(PRESET_KEY) as AeroPreset | null
const storedBrand = localStorage.getItem(BRAND_KEY)

const state = reactive({
  theme: (localStorage.getItem('aero-ui-theme') as AeroTheme) || 'light',
  preset: (storedPreset || 'aero') as AeroPreset,
  /** 自定义品牌色 hex（setBrand 写入；resetBrand 清空） */
  brand: storedBrand || '',
})

function hexToHsl(hex: string) {
  hex = (hex || '#0EBFFF').replace('#', '').trim()
  if (hex.length === 3)
    hex = [...hex].map((c) => c + c).join('')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  let h = 0, s = 0, l = (mx + mn) / 2
  if (d) {
    s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn)
    switch (mx) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h *= 60
  }
  return { h, s: s * 100, l: l * 100 }
}

/** 依据亮度推导 on-brand（亮色配墨、暗色配白）—— demo shadeFor 同源规则 */
function shadeFor(hex: string) {
  const { l } = hexToHsl(hex)
  return l > 52 ? `color-mix(in srgb, ${hex} 30%, #000)` : '#FFFFFF'
}

function applyToDom() {
  const root = document.documentElement
  root.dataset.theme = state.theme
  localStorage.setItem('aero-ui-theme', state.theme)
  if (state.brand) {
    // 自定义品牌色优先于预设：inline 变量覆盖 token
    root.dataset.preset = 'custom'
    root.style.setProperty('--ui-brand', state.brand)
    root.style.setProperty('--ui-on-brand', shadeFor(state.brand))
    localStorage.setItem(BRAND_KEY, state.brand)
  } else {
    root.style.removeProperty('--ui-brand')
    root.style.removeProperty('--ui-on-brand')
    localStorage.removeItem(BRAND_KEY)
    if (state.preset !== 'aero') root.dataset.preset = state.preset
    else delete root.dataset.preset
  }
  localStorage.setItem(PRESET_KEY, state.preset)
}

watchEffect(applyToDom)

export function useTheme() {
  return {
    state,
    isDark: () => state.theme === 'dark',
    setTheme(t: AeroTheme) {
      state.theme = t
    },
    toggleTheme() {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setPreset(p: AeroPreset) {
      state.preset = p
    },
    setBrand(hex: string) {
      // 写入 state 后由 watchEffect(applyToDom) 统一落 DOM + 持久化
      state.brand = hex
    },
    resetBrand() {
      state.brand = ''
      state.preset = 'aero'
    },
    shadeFor,
  }
}
