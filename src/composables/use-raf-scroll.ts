/**
 * useRafScroll —— 统一 rAF 节流滚动采样（阶段5 去重项 2）
 *
 * 库内 3 处各写一份「滚动事件 + requestAnimationFrame 节流采样」：
 *   affix / anchor / back-top
 * 本 composable 收敛公共骨架，各组件只保留「采样到值后做什么」的业务逻辑。
 *
 * 用法：
 *   const scroller = useRafScroll(
 *     () => document.querySelector('.pg-main') ?? window,  // getTarget（可动态）
 *     onSample,                                             // 每次 rAF 合帧后的回调
 *   )
 *   onMounted(() => scroller.start())
 *   onBeforeUnmount(() => scroller.stop())
 *
 * 语义约定：
 * - getTarget() 每次采样时重新求值（支持容器动态卸载/切换，如 Affix 的 target prop）
 * - onChange 在每帧读完后调用（传 ScrollSample）
 * - start 时立即采样一次（挂载即有值，不丢首帧）
 * - passive: true 监听，不阻塞滚动主线程
 * - 目标漂移保护：listener 记录已绑定的 EventTarget；onScroll 内若发现
 *   getTarget() 求值出的 targetEl() 与已绑定者不同，先解绑旧再绑新
 *   （修复 anchor bind() 动态重绑 target 后 stop() 解绑错误对象导致旧 target 泄漏）
 */
import { onBeforeUnmount, ref } from 'vue'

export interface ScrollSample {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
}

export function useRafScroll(getTarget: () => HTMLElement | Window | null | undefined, onChange?: (s: ScrollSample) => void) {
  const latest = ref<ScrollSample>({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 })
  let tick = 0
  /** 当前已绑定 scroll 监听的 target；stop() 据此解绑正确对象，避免旧 target 泄漏 */
  let boundTarget: EventTarget | null = null

  function read() {
    const t = getTarget()
    if (t instanceof Window || t === null || t === undefined) {
      const se = document.scrollingElement
      latest.value = {
        scrollTop: window.scrollY,
        scrollHeight: se?.scrollHeight ?? document.documentElement.scrollHeight,
        clientHeight: se?.clientHeight ?? document.documentElement.clientHeight,
      }
    } else {
      latest.value = {
        scrollTop: t.scrollTop,
        scrollHeight: t.scrollHeight,
        clientHeight: t.clientHeight,
      }
    }
    onChange?.(latest.value)
  }

  function onScroll() {
    // 目标漂移：getTarget() 动态变化后，已绑定 target 可能不再是当前目标。
    // 此时先解绑旧 target 再绑新 target，保证 stop() 解绑的是实际监听者。
    const current = targetEl()
    if (boundTarget !== current) {
      if (boundTarget) boundTarget.removeEventListener('scroll', onScroll)
      current.addEventListener('scroll', onScroll, { passive: true })
      boundTarget = current
    }
    if (tick) return
    tick = requestAnimationFrame(() => {
      tick = 0
      read()
    })
  }

  function targetEl(): EventTarget {
    const t = getTarget()
    return t instanceof Window || !t ? window : t
  }

  function start() {
    const t = targetEl()
    // 若已有绑定但目标已漂移，onScroll 首次触发时会重绑；此处先解除旧绑定避免双绑
    if (boundTarget && boundTarget !== t) {
      boundTarget.removeEventListener('scroll', onScroll)
    }
    if (boundTarget !== t) {
      t.addEventListener('scroll', onScroll, { passive: true })
      boundTarget = t
    }
    read()
  }

  /** 立即读一次（resize 等场景使用；不等 rAF） */
  function sample() {
    read()
  }

  function stop() {
    // 解绑实际绑定的 target（boundTarget），而非重新求值的 targetEl()——
    // 后者在 getTarget() 动态变化后会指向新目标，导致旧目标监听器泄漏。
    if (boundTarget) {
      boundTarget.removeEventListener('scroll', onScroll)
      boundTarget = null
    }
    if (tick) {
      cancelAnimationFrame(tick)
      tick = 0
    }
  }

  onBeforeUnmount(stop)

  return { latest, start, stop, sample }
}
