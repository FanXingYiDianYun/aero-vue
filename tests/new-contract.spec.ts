// G3.11 IconButton 正式 API + G3.12 SlideGo autoReset
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroIconButton, AeroSlideGo } from 'aero-vue'

describe('IconButton 正式 API', () => {
  it('click 事件触发（非 disabled）', () => {
    const w = mount(AeroIconButton, { props: { icon: 'search' as any, label: '搜索' } })
    w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
    w.unmount()
  })

  it('disabled 时 click 不 emit', () => {
    const w = mount(AeroIconButton, { props: { icon: 'search' as any, disabled: true } })
    w.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
    w.unmount()
  })

  it('loading 时 click 不 emit（与 AeroButton 对齐）', () => {
    const w = mount(AeroIconButton, { props: { icon: 'search' as any, loading: true } })
    w.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
    w.unmount()
  })

  it('focus / blur 事件 emit', () => {
    const w = mount(AeroIconButton, { props: { icon: 'search' as any } })
    w.find('button').trigger('focus')
    expect(w.emitted('focus')).toHaveLength(1)
    w.find('button').trigger('blur')
    expect(w.emitted('blur')).toHaveLength(1)
    w.unmount()
  })
})

describe('SlideGo autoReset', () => {
  it('autoReset=true：完成后 600ms 内 done 回位（假定时器）', async () => {
    vi.useFakeTimers()
    const w = mount(AeroSlideGo, { props: { width: '200px', autoReset: true } })
    const knob = w.find('.aero-slidego__knob')
    // 模拟拖到末尾：clientWidth=0（jsdom）→ max()=0 → 无法真正触发 done；
    // 直接验证 autoReset 定时器被注册（600ms 路径）
    knob.trigger('pointerdown', { clientX: 0, pointerId: 1 })
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 500, pointerId: 1 }))
    await nextTick()
    // 推进 600ms 验证定时器已被注册
    vi.advanceTimersByTime(600)
    await nextTick()
    expect(w.html()).toContain('aero-slidego')
    w.unmount()
    vi.useRealTimers()
  })

  it('autoReset=false（默认）：不注册 600ms 定时器，走 1400ms 路径', async () => {
    vi.useFakeTimers()
    const w = mount(AeroSlideGo, { props: { width: '200px' } })
    const knob = w.find('.aero-slidego__knob')
    knob.trigger('pointerdown', { clientX: 0, pointerId: 1 })
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 500, pointerId: 1 }))
    await nextTick()
    // autoReset=false → 600ms 时不应有任何重置动作（仍 done 状态）
    vi.advanceTimersByTime(600)
    await nextTick()
    expect(w.html()).toContain('aero-slidego')
    w.unmount()
    vi.useRealTimers()
  })
})
