import { createApp, h, ref } from 'vue'
import { zhCn } from '../../../locale/zh-cn'
import MessageBoxHost from './message-box-host.vue'

// 命令式 API 决策：AeroMessageBox 脱离组件上下文（无 provide/inject 可走 useLocale），
// 故 confirm/cancel 缺省文案按库默认中文词包 zhCn.messageBox 取值（EP 同惯例）。

export interface MessageBoxOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  /** 危险确认（确认钮变红） */
  danger?: boolean
}

interface State {
  open: boolean
  opts: MessageBoxOptions
  resolve: ((v: boolean) => void) | null
}

function createInstance() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const state = ref<State>({ open: false, opts: { message: '' }, resolve: null })
  const app = createApp({
    setup() {
      return () =>
        h(MessageBoxHost, {
          open: state.value.open,
          opts: state.value.opts,
          'onUpdate:open': (v: boolean) => (state.value.open = v),
          onConfirm: () => {
            state.value.resolve?.(true)
            state.value.resolve = null
          },
          onCancel: () => {
            state.value.resolve?.(false)
            state.value.resolve = null
          },
        })
    },
  })
  app.mount(div)
  return state
}

let state: ReturnType<typeof createInstance> | null = null

function ensure() {
  if (!state) state = createInstance()
  return state
}

/** 命令式确认框：await AeroMessageBox.confirm({...}) */
export const AeroMessageBox = {
  confirm(opts: MessageBoxOptions): Promise<boolean> {
    const s = ensure()
    return new Promise((resolve) => {
      s.value.opts = { confirmText: zhCn.messageBox.confirm, cancelText: zhCn.messageBox.cancel, ...opts }
      s.value.resolve = resolve
      s.value.open = true
    })
  },
}

