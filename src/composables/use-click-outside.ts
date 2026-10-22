import { onBeforeUnmount, onMounted } from 'vue'

/**
 * 点击外部触发（用于下拉/浮层自动收起）
 *
 * 事件模型说明：
 * - 触发按钮自身的 click 会冒泡到 document。若在冒泡阶段监听 click，
 *   与 toggle 的执行顺序取决于注册时机，容易出现「同一次点击既打开
 *   又立即关闭」的竞争（浮层挂载时机晚于 document 监听器时尤其明显）。
 * - 因此改为监听 capture 阶段的 pointerdown：它在任何组件 click 处理
 *   之前执行，且对同一按压只判定一次，按“起点是否在浮层内”决定收起。
 */
export function useClickOutside(el: () => HTMLElement | undefined, cb: () => void) {
  const handler = (e: PointerEvent) => {
    const root = el()
    if (root && !root.contains(e.target as Node)) cb()
  }
  const opts: AddEventListenerOptions = { capture: true }
  onMounted(() => document.addEventListener('pointerdown', handler, opts))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', handler, opts))
  return { handler }
}
