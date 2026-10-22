/**
 * usePointerDrag —— 统一指针拖拽骨架（阶段5 去重项 1）
 *
 * 按下-捕获-移动-释放 四段式骨架在库内 12 处各写一份
 * （bottom-sheet / carousel / color-picker / image-viewer / knob / mobile-carousel
 *   pull-to-refresh / slide-go / slider / sort-list / swipe-deck / use-click-outside），
 * 本 composable 收敛公共部分，各组件只保留「移动时做什么」的业务逻辑。
 *
 * 用法：
 *   const { startDrag, active } = usePointerDrag(
 *     onMove,                 // (e: PointerEvent) => void
 *     { onEnd: () => {} },   // 可选：松手回调
 *   )
 *   // 模板：@pointerdown="startDrag(el, $event)"
 *
 * 语义约定：
 * - startDrag 内部 stopPropagation，捕获指针 + document 级监听（按下-捕获-移动-释放 四段式）
 * - 位移阈值门控：pointerdown 不立即 setPointerCapture——首次位移 >5px 才确认拖拽
 *   并挂捕获（DRAG_THRESHOLD 内不捕获）。鼠标：立即捕获会把后续 pointerup/click 重定向到
 *   捕获元素（实测 click@容器、按钮 @click 永远收不到，PC 单击失效根因）；未挂捕获的小位移
 *   手势 = 点击，click 正常落到原目标。触摸：隐式捕获由浏览器自动完成，延迟显式捕获无副作用。
 * - preventDefault 门控：鼠标事件不 preventDefault；触摸/笔沿用原逻辑（默认阻止页面滚动）
 * - 捕获成功后 document pointermove/pointerup/pointercancel 自动接管，onMove 每次接收最新 PointerEvent
 * - onEnd 仅在「指针正常释放（pointerup/pointercancel）」时触发一次（幂等保护：仅首次）
 * - 组件卸载路径走 cleanup()，只解绑 document 监听 + 复位状态，绝不触发 onEnd
 *   （onEnd 是业务回调，若在卸载时以 undefined 实参空跑会触发 carousel 回弹判定、
 *     swipe-deck 释放等副作用——卸载不得产生副作用）
 */
import { onBeforeUnmount, ref } from 'vue'

export interface UsePointerDragOptions {
  /** 松手/取消回调（pointerup + pointercancel 各一次） */
  onEnd?: (e: PointerEvent) => void
  /** 是否阻止默认（触摸 scroll 等）；默认 true */
  preventDefault?: boolean
}

export function usePointerDrag(onMove: (e: PointerEvent) => void, options: UsePointerDragOptions = {}) {
  const active = ref(false)
  let el: HTMLElement | null = null
  let ended = false
  /** 捕获时存真实 pointerId，cleanup 释放时对号释放（不可写死 0——靠 try/catch 掩盖、
   *  靠浏览器隐式释放兜底，属语义错误） */
  let capturedId = -1
  /** K5 延迟捕获：pointerId + 起点点位，首帧位移 >5px 才确认拖拽并 setPointerCapture */
  let pendingPointerId = -1
  let startClientX = 0
  let startClientY = 0
  const DRAG_THRESHOLD = 5

  /** 未确认拖拽前不挂捕获——立即捕获会把后续 pointerup/click 重定向到捕获元素
 * （实测 PC click 落在容器上、按钮 @click 收不到，「单击+1 失效」根因）；
 * 小位移手势保持未捕获 → click 正常落回原目标（=放行）；
 * 大位移确认后捕获 → 后续 up/click 重定向到拖拽元素（=抑制误触 click）。 */
  function confirmCapture(e: PointerEvent) {
    if (capturedId >= 0 || !el || pendingPointerId < 0) return
    if (Math.hypot(e.clientX - startClientX, e.clientY - startClientY) <= DRAG_THRESHOLD) return
    try {
      el.setPointerCapture(pendingPointerId)
      capturedId = pendingPointerId
    } catch { /* 捕获失败仍继续拖拽 */ }
  }

  function handleMove(e: PointerEvent) {
    if (!active.value) return
    confirmCapture(e)
    onMove(e)
  }

  /** 仅清理监听与状态，不触发 onEnd。
   *  组件卸载路径走此函数，避免 onEnd 在卸载时以 undefined 实参空跑
   *  （9 个迁移组件的 onEnd：carousel 回弹判定、swipe-deck 释放等，
   *  都不能在卸载瞬间被触发）。 */
  function cleanup() {
    if (ended) return
    ended = true
    active.value = false
    document.removeEventListener('pointermove', handleMove)
    document.removeEventListener('pointerup', handleEnd)
    document.removeEventListener('pointercancel', handleEnd)
    if (el) {
      if (capturedId >= 0) {
        try { el.releasePointerCapture(capturedId) } catch { /* noop */ }
      }
      el = null
      capturedId = -1
    }
  }

  /** 指针正常释放（up/cancel）：清理监听 + 业务回调 onEnd */
  function handleEnd(e: PointerEvent) {
    cleanup()
    options.onEnd?.(e)
  }

  /** 在任意元素上按下时调用；开启 document 级监听（捕获延迟到位移确认，见 K5） */
  function startDrag(target: HTMLElement | null | undefined, e: PointerEvent) {
    if (active.value) return
    e.stopPropagation()
    // 鼠标 pointerdown 不 preventDefault（否则 click 合成被抑制，PC 单击失效）；
    //     触摸/笔保持原语义（阻止页面滚动）。stopPropagation 保留——防止冒泡进
    //     chrome 外的 onDown 监听重复启动手势（bottom-sheet bar→sheet 双层 onDown）。
    if (e.pointerType !== 'mouse' && options.preventDefault !== false) e.preventDefault?.()
    el = target ?? null
    ended = false
    active.value = true
    capturedId = -1
    pendingPointerId = e.pointerId
    startClientX = e.clientX
    startClientY = e.clientY
    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleEnd)
    document.addEventListener('pointercancel', handleEnd)
  }

  // 卸载时只清理监听与状态，不触发 onEnd（onEnd 永不在卸载路径触发）
  onBeforeUnmount(cleanup)

  return { startDrag, active }
}
