import { onBeforeUnmount, onMounted, ref } from 'vue'

export interface PopupAlign {
  /** 12/8 方位，如 'bottom-start' | 'bottom' | 'top' 等 */
  placement?: 'top' | 'bottom' | 'top-start' | 'bottom-start' | 'bottom-end' | 'top-end' | 'right' | 'left'
  offset?: number
}

/**
 * 轻量弹层定位（无第三方依赖）：跟随触发元素 + 滚动/resize 重算
 * 演示级覆盖 top/bottom 两轴 + start/end 变体，满足库内浮层组件需要
 */
export function usePopup(align: PopupAlign = {}) {
  const { placement = 'bottom-start', offset = 8 } = align
  const popRef = ref<HTMLElement>()
  const triggerRef = ref<HTMLElement>()
  const visible = ref(false)
  const pos = ref({ left: '0px', top: '0px' })

  function update() {
    const pop = popRef.value, trg = triggerRef.value
    if (!pop || !trg) return
    const r = trg.getBoundingClientRect()
    const pw = pop.offsetWidth, ph = pop.offsetHeight
    let left = r.left, top = r.bottom + offset
    const vertical = placement.split('-')[0]
    const horizontal = placement.split('-')[1]
    if (vertical === 'top') top = r.top - ph - offset
    if (horizontal === 'start') left = r.left
    else if (horizontal === 'end') left = r.right - pw
    else left = r.left + r.width / 2 - pw / 2
    // 边界钳制
    left = Math.max(8, Math.min(window.innerWidth - pw - 8, left))
    if (top + ph > window.innerHeight - 8 && vertical === 'bottom') top = r.top - ph - offset
    pos.value = { left: left + 'px', top: top + 'px' }
  }

  function show() { visible.value = true; requestAnimationFrame(update) }
  function hide() { visible.value = false }
  function toggle() { visible.value ? hide() : show() }

  const onMove = () => visible.value && update()
  onMounted(() => {
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onMove)
    window.removeEventListener('resize', onMove)
  })

  return { popRef, triggerRef, visible, pos, show, hide, toggle, update }
}
