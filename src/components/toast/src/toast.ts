import { createApp, h, ref, type ComponentInternalInstance } from 'vue'
import ToastHost from './toast-host.vue'

export interface ToastOptions {
  type?: 'success' | 'error' | 'warn' | 'info'
  title?: string
  message?: string
  /** 停留时长 ms（含倒计时条） */
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
}

let hostMounted = false
let pushFn: ((t: ToastItem) => void) | null = null
let uid = 0

/** 确保 host 挂载（首次调用时创建单例容器） */
function ensureHost() {
  if (hostMounted) return
  const div = document.createElement('div')
  div.id = 'aero-toasts'
  document.body.appendChild(div)
  const list = ref<ToastItem[]>([])
  createApp({
    setup() {
      return () =>
        h(ToastHost, {
          list: list.value,
          onLeave: (id: number) => {
            list.value = list.value.filter((t) => t.id !== id)
          },
        })
    },
  }).mount(div)
  pushFn = (t) => list.value.push(t)
  hostMounted = true
}

function push(opts: ToastOptions) {
  ensureHost()
  pushFn?.({ ...opts, id: ++uid })
}

/** 命令式 API：AeroToast.success('已保存') */
export const AeroToast = {
  success: (msg: string, opts?: Omit<ToastOptions, 'type' | 'message'>) => push({ ...opts, type: 'success', message: msg }),
  error: (msg: string, opts?: Omit<ToastOptions, 'type' | 'message'>) => push({ ...opts, type: 'error', message: msg }),
  warn: (msg: string, opts?: Omit<ToastOptions, 'type' | 'message'>) => push({ ...opts, type: 'warn', message: msg }),
  info: (msg: string, opts?: Omit<ToastOptions, 'type' | 'message'>) => push({ ...opts, type: 'info', message: msg }),
  show: (opts: ToastOptions) => push(opts),
}
