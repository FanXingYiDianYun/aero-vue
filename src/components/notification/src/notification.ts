import { createApp, h, ref } from 'vue'
import NotificationHost from './notification-host.vue'

export interface NotificationOptions {
  type?: 'success' | 'error' | 'warn' | 'info'
  title: string
  message?: string
  /** 停留时长 ms；0 表示不自动关闭 */
  duration?: number
}

interface Item extends NotificationOptions {
  id: number
}

let pushFn: ((t: Item) => void) | null = null
let closeFn: ((id: number) => void) | null = null
let uid = 0

function ensureHost() {
  if (pushFn) return
  const div = document.createElement('div')
  document.body.appendChild(div)
  const list = ref<Item[]>([])
  createApp({
    setup() {
      return () =>
        h(NotificationHost, {
          list: list.value,
          onClose: (id: number) => (list.value = list.value.filter((n) => n.id !== id)),
        })
    },
  }).mount(div)
  pushFn = (t) => list.value.push(t)
}

function push(opts: NotificationOptions) {
  ensureHost()
  pushFn?.({ ...opts, id: ++uid })
}

export const AeroNotification = {
  success: (title: string, message?: string) => push({ type: 'success', title, message }),
  error: (title: string, message?: string) => push({ type: 'error', title, message }),
  warn: (title: string, message?: string) => push({ type: 'warn', title, message }),
  info: (title: string, message?: string) => push({ type: 'info', title, message }),
  show: (opts: NotificationOptions) => push(opts),
}
