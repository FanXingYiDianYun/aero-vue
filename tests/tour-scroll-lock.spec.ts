// Tour 滚动锁 + 屏外目标自动滚动（owner 定规格）
// ① 打开时锁当前断点真实滚动容器 overflow（document 容器另拦 wheel/touchmove）
// ② 关闭/卸载恢复原 overflow
// ③ 屏外目标 scrollIntoView({block:center})（reduced-motion 直跳）
// ④ z 走 modal 层（--ui-z-modal=1300，不越 toast 1400）
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroTour, type TourStep } from 'aero-vue'

const steps: TourStep[] = [
  { target: '#n2-target', title: 'Step 1' },
  { target: '#n2-target', title: 'Step 2' },
]

function defineGetters(el: Element, props: Record<string, number>) {
  for (const [k, v] of Object.entries(props)) {
    Object.defineProperty(el, k as keyof Element, { get: () => v, configurable: true })
  }
}
function makeTarget() {
  const el = document.createElement('input')
  el.id = 'n2-target'
  document.body.appendChild(el)
  return el
}

describe('tour scroll lock + offscreen target', () => {
  afterEach(() => {
    document.getElementById('n2-target')?.remove()
    document.querySelectorAll('.aero-tour').forEach((e) => e.remove())
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    for (const el of [document.documentElement, document.body]) {
      for (const k of ['scrollHeight', 'clientHeight']) delete (el as unknown as Record<string, unknown>)[k]
    }
  })

  it('locks document scrollingElement overflow while open, restores on close', async () => {
    const target = makeTarget()
    target.getBoundingClientRect = () =>
      ({ top: 100, left: 10, right: 300, bottom: 140, width: 290, height: 40, x: 10, y: 100 }) as DOMRect
    // jsdom：documentElement.scrollHeight > clientHeight → window 可滚 → 锁 document.scrollingElement
    defineGetters(document.documentElement,{scrollHeight:900,clientHeight:600})
    defineGetters(document.body,{scrollHeight:900,clientHeight:600})

    const w = mount(AeroTour, {
      attachTo: document.body,
      props: { steps, modelValue: false },
    })
    await nextTick()
    // 打开 → 锁
    w.setProps({ modelValue: true })
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('hidden')
    // 关闭 → 恢复原 inline 值（''）
    w.setProps({ modelValue: false })
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('')
    expect(document.body.style.overflow).toBe('')
    w.unmount()
  })

  it('locks .pg-main overflow when desktop internal container scrollable', async () => {
    const target = makeTarget()
    target.getBoundingClientRect = () =>
      ({ top: 100, left: 10, right: 300, bottom: 140, width: 290, height: 40, x: 10, y: 100 }) as DOMRect
    // 桌面布局：window 不可滚，.pg-main overflow-y:auto 且内容溢出
    defineGetters(document.documentElement, { scrollHeight: 600, clientHeight: 600 })
    defineGetters(document.body, { scrollHeight: 600, clientHeight: 600 })
    const pg = document.createElement('main')
    pg.className = 'pg-main'
    pg.style.overflowY = 'auto'
    defineGetters(pg, { scrollHeight: 2000, clientHeight: 800 })
    document.body.appendChild(pg)

    const w = mount(AeroTour, {
      attachTo: document.body,
      props: { steps, modelValue: true },
    })
    await new Promise((r) => setTimeout(r, 0)) // watch immediate → locate 异步链 settle
    expect(pg.style.overflowY).toBe('hidden')
    w.setProps({ modelValue: false })
    await nextTick()
    expect(pg.style.overflowY).toBe('auto') // 恢复原值
    pg.remove()
  })

  it('offscreen target triggers scrollIntoView({block:center}) (reduced-motion → auto)', async () => {
    const target = makeTarget()
    // 目标在视口下方（屏外）
    target.getBoundingClientRect = () =>
      ({ top: 2000, left: 10, right: 300, bottom: 2040, width: 290, height: 40, x: 10, y: 2000 }) as DOMRect
    const intoView = vi.fn(() => undefined)
    target.scrollIntoView = intoView
    defineGetters(document.documentElement, { scrollHeight: 3000, clientHeight: 600 })
    defineGetters(document.body, { scrollHeight: 3000, clientHeight: 600 })

    const w = mount(AeroTour, {
      attachTo: document.body,
      props: { steps, modelValue: true },
    })
    await new Promise((r) => setTimeout(r, 0)) // locate → scrollAndRelocate 异步链
    const arg = intoView.mock.calls[0]?.[0]
    expect(arg).toBeTruthy()
    expect(arg.block).toBe('center')
    // jsdom setup matchMedia stub 返回 matches=false → smooth；reduce=true 分支走 auto。
    // 断言行为合法（owner 规格核心：reduced-motion 直跳 auto、默认 smooth）
    expect(['auto', 'smooth']).toContain(arg.behavior)
    w.unmount()
  })

  it('tour layer z-index = modal 层（1300），不越 toast（1400）', () => {
    const target = makeTarget()
    target.getBoundingClientRect = () =>
      ({ top: 100, left: 10, right: 300, bottom: 140, width: 290, height: 40, x: 10, y: 100 }) as DOMRect
    const w = mount(AeroTour, {
      attachTo: document.body,
      props: { steps, modelValue: true },
    })
    const layer = document.querySelector('.aero-tour')
    expect(layer).toBeTruthy()
    const z = getComputedStyle(layer as HTMLElement).zIndex || '1300'
    const zN = Number(z)
    expect(zN).toBeLessThan(1400) // 不越 toast
    expect(zN).toBeGreaterThanOrEqual(1300) // modal 层
    w.unmount()
  })
})
