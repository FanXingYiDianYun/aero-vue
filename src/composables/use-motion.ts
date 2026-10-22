import { reactive } from 'vue'

/**
 * 全局动效门控（GPU 隔离方案核心）。
 * 模块级响应式状态：enabled 关闭时向 html 注入 data-motion="off"，
 * 由 tokens.scss 的 html[data-motion='off'] 断路规则统一停用
 * 全库循环动画与过渡；开启则移除属性恢复默认行为。
 * 持久化 localStorage（aero-ui-motion），刷新不丢。
 */
const state = reactive({
  enabled: (localStorage.getItem('aero-ui-motion') ?? 'on') !== 'off',
})

function applyToDom() {
  const root = document.documentElement
  if (state.enabled) delete root.dataset.motion
  else root.dataset.motion = 'off'
  localStorage.setItem('aero-ui-motion', state.enabled ? 'on' : 'off')
}

if (typeof document !== 'undefined') applyToDom()

export function useMotion() {
  return {
    state,
    /** 全局开关：false = 全库循环动画/过渡断路 */
    setEnabled(v: boolean) {
      state.enabled = v
      applyToDom()
    },
    toggle() {
      state.enabled = !state.enabled
      applyToDom()
    },
  }
}
