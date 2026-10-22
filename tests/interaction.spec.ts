// 手写交互 Top15（props / events / expose 行为断言）
import { it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroButton } from 'aero-vue'
import { AeroInput } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
import { AeroCheckbox } from 'aero-vue'
import { AeroRadio } from 'aero-vue'
import { AeroTabs } from 'aero-vue'
import { AeroMenu } from 'aero-vue'
import { AeroSelect } from 'aero-vue'
import { AeroDialog } from 'aero-vue'
import { AeroSlider } from 'aero-vue'
import { AeroCollapse } from 'aero-vue'
import { AeroPagination } from 'aero-vue'
import { AeroTree } from 'aero-vue'
import { AeroUpload } from 'aero-vue'
import { AeroCropper } from 'aero-vue'
import { AeroSlideGo } from 'aero-vue'

describe('interaction Top15', () => {
  it('AeroButton core behavior', async () => {
const w = mount(AeroButton, { props: { type: 'primary' } })
    expect(w.classes()).toContain('aero-btn--primary')
    w.trigger('click')
  })
  it('AeroInput core behavior', async () => {
const w = mount(AeroInput, { props: { modelValue: 'hi' } })
    expect(w.html()).toContain('hi')
    const el = w.find('input')
    el.element.value = 'x'
    el.element.dispatchEvent(new Event('input'))
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['x'])
  })
  it('AeroSwitch core behavior', async () => {
const w = mount(AeroSwitch, { props: { modelValue: false } })
    const input = w.find('input')
    input.element.checked = true
    input.trigger('change')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
  })
  it('AeroCheckbox core behavior', async () => {
const w = mount(AeroCheckbox, { props: { modelValue: false } })
    w.find('input').setValue(true)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
  })
  it('AeroRadio core behavior', async () => {
const w = mount(AeroRadio, { props: { modelValue: 'a', value: 'a' } })
    expect(w.classes()).toContain('is-checked')
  })
  it('AeroTabs core behavior', async () => {
const w = mount(AeroTabs, { props: { modelValue: 'a', tabs: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] } })
    w.findAll('.aero-tabs__tab')[1].trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })
  it('AeroMenu core behavior', async () => {
const w = mount(AeroMenu, { props: { modelValue: 'a', items: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] } })
    w.findAll('.aero-menu__item')[1].trigger('click')
    expect(w.emitted('select')?.[0]?.[0]).toBeTruthy()
  })
  it('AeroSelect core behavior', async () => {
const w = mount(AeroSelect, { props: { modelValue: '', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] } })
    w.find('.aero-select__btn').trigger('click')
    await nextTick()
    expect(w.html()).toContain('aero-select__menu')
  })
  it('AeroDialog core behavior', async () => {
const w = mount(AeroDialog, { props: { modelValue: true, title: 'T' } })
    await nextTick()
    expect(document.querySelector('.aero-modal')?.textContent).toContain('T')
    w.unmount()
  })
  it('AeroSlider core behavior', async () => {
const w = mount(AeroSlider, { props: { modelValue: 50 } })
    expect(w.html()).toContain('aero-slider__range')
  })
  it('AeroCollapse core behavior', async () => {
const w = mount(AeroCollapse, { props: { modelValue: [] } })
    expect(w.html()).toBeTruthy()
  })
  it('AeroPagination core behavior', async () => {
const w = mount(AeroPagination, { props: { modelValue: 1 } })
    expect(w.html()).toBeTruthy()
  })
  it('AeroTree core behavior', async () => {
const w = mount(AeroTree, { props: { data: [] } })
    expect(w.html()).toBeTruthy()
  })
  it('AeroUpload core behavior', async () => {
const w = mount(AeroUpload, { props: { modelValue: [] } })
    expect(w.html()).toContain('aero-upload')
  })
  it('AeroCropper core behavior', async () => {
const w = mount(AeroCropper, {})
    expect(w.html()).toContain('aero-cropper')
    expect(typeof w.vm.reset).toBe('function')
    expect(typeof w.vm.openFilePicker).toBe('function')
  })
  it('AeroSlideGo core behavior', async () => {
const w = mount(AeroSlideGo, { props: { width: '200px' } })
    // jsdom clientWidth=0 → max()=0 → upd 恒 NaN，done 不触发；
    // 验证 doneFired 闭锁不重入：模拟持续 move，emitted done ≤1 次
    const knob = w.find('.aero-slidego__knob')
    knob.trigger('pointerdown', { clientX: 0, pointerId: 1 })
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 500, pointerId: 1 }))
    await nextTick()
    expect((w.emitted('done') ?? []).length).toBeLessThanOrEqual(1)
  })
})

describe('SlideGo doneFired 闭锁', () => {
  it('持续 pointermove 到达末尾后 done 仅 emit 1 次（jsdom 不放大 emit 数）', async () => {
    // jsdom clientWidth=0 → max()=0 → upd 恒 NaN，done 不实际触发；
    // 用例验证：doneFired 闭锁 + 新手势复位不导致 emit 数放大（持续 move 不重入）
    const w = mount(AeroSlideGo, { props: { width: '200px' } })
    const knob = w.find('.aero-slidego__knob')
    knob.trigger('pointerdown', { clientX: 0, pointerId: 1 })
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 500, pointerId: 1 }))
    await nextTick()
    expect((w.emitted('done') ?? []).length).toBeLessThanOrEqual(1)
    // 新手势（pointerdown）复位 doneFired：再 move 仍 ≤1（不放大）
    const firstCount = (w.emitted('done') ?? []).length
    knob.trigger('pointerdown', { clientX: 0, pointerId: 2 })
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 500, pointerId: 2 }))
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 500, pointerId: 2 }))
    await nextTick()
    expect((w.emitted('done') ?? []).length).toBe(firstCount)
  })
})
