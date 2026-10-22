/**
 * 按钮涟漪：按下注入 span.aero-ripple，680ms 后移除（demo 同源逻辑）
 * 仅在交互瞬间创建元素，无常驻动画层，符合 GPU 隔离方案
 */
export function useRipple() {
  /** 由点击事件宿主直接调用（组件内 @click） */
  function attach(e: MouseEvent | PointerEvent) {
    const host = e.currentTarget as HTMLElement | null
    if (!host) return
    const r = host.getBoundingClientRect()
    const d = Math.max(r.width, r.height)
    const s = document.createElement('span')
    s.className = 'aero-ripple'
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`
    host.appendChild(s)
    setTimeout(() => s.remove(), 680)
  }

  /** 绑定到指定元素的 pointerdown（指令/组合式通用） */
  function bind(el: HTMLElement, enabled?: () => boolean) {
    const handler = (e: PointerEvent) => {
      if (enabled && !enabled()) return
      attach(e)
    }
    el.addEventListener('pointerdown', handler)
    return () => el.removeEventListener('pointerdown', handler)
  }

  return { attach, bind }
}
