import { ref, watch } from 'vue'

const fmt = (v: number, d = 0) =>
  v.toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d })

/**
 * 数字滚动（easeOutCubic，demo tween 同源）
 * 仅在调用期间 raf，结束即停，无常驻帧循环
 */
export function useCountUp(target: () => number, duration = 1400, decimals = 0) {
  const display = ref(0)
  let raf = 0

  function run(to: number) {
    cancelAnimationFrame(raf)
    const from = display.value
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - p, 3)
      display.value = from + (to - from) * e
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  watch(target, (v) => run(v), { immediate: true })

  return { display, text: () => fmt(display.value, decimals) }
}
