// Rate allowReselect（首评锁定）——默认 false 首评后 pointer/键盘输入全忽略（无 emit、
// cursor: default、is-locked 类、aria 保持）；true = 现行为可反复改；程序化 setProps 不受锁影响。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { AeroRate } from 'aero-vue'

describe('Rate allowReselect', () => {
  it('默认（false）：首评后二击无 emit；星钮进入 is-locked + cursor default；aria 保持', async () => {
    const w = mount(AeroRate, { props: { modelValue: 0 } })
    const stars = w.findAll('.aero-rate__star')
    stars[2].trigger('click') // 首评 3
    expect(w.emitted('update:modelValue')!.length).toBe(1)
    await w.setProps({ modelValue: 3 }) // 程序化回灌（受控闭环）
    stars[3].trigger('click') // 二击——锁定，无 emit
    expect(w.emitted('update:modelValue')!.length).toBe(1)
    expect(stars[3].classes()).toContain('is-locked')
    expect(stars[3].attributes('style')).toContain('cursor: default')
    // aria 保持（label 不变）
    expect(stars[3].attributes('aria-label')).toBeTruthy()
    w.unmount()
  })

  it('allowReselect=true：可反复评（现行为），无 is-locked', async () => {
    const w = mount(AeroRate, { props: { modelValue: 0, allowReselect: true } })
    const stars = w.findAll('.aero-rate__star')
    stars[2].trigger('click')
    stars[4].trigger('click') // 再评——不锁
    expect(w.emitted('update:modelValue')!.length).toBe(2)
    expect(stars[0].classes()).not.toContain('is-locked')
    w.unmount()
  })

  it('键盘路径（小数模式）：默认 false 首评后箭头无 emit；true 可步进', async () => {
    const w = mount(AeroRate, { props: { modelValue: 0, allowDecimal: true } })
    await w.trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')!.length).toBe(1) // 首评 0.1
    await w.setProps({ modelValue: 0.1 })
    await w.trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')!.length).toBe(1) // 锁定，无二评
    w.unmount()

    const w2 = mount(AeroRate, { props: { modelValue: 0, allowDecimal: true, allowReselect: true } })
    await w2.trigger('keydown', { key: 'ArrowRight' })
    await w2.setProps({ modelValue: 0.1 })
    await w2.trigger('keydown', { key: 'ArrowRight' })
    expect(w2.emitted('update:modelValue')!.length).toBe(2)
    w2.unmount()
  })

  it('程序化设值不受锁影响：锁定后 setProps modelValue 仍生效（渲染跟值，不 emit）', async () => {
    const w = mount(AeroRate, { props: { modelValue: 0 } })
    w.findAll('.aero-rate__star')[1].trigger('click') // 首评 2 → 锁定
    await w.setProps({ modelValue: 2 }) // 受控回灌
    const stars = w.findAll('.aero-rate__star') // 重新查询（锁定后类已刷新）
    expect(stars[1].classes()).toContain('is-locked')
    await w.setProps({ modelValue: 5 }) // 程序化设值——is-on 渲染 5 星
    expect(w.findAll('.aero-rate__star.is-on').length).toBe(5)
    expect(w.emitted('update:modelValue')!.length).toBe(1) // 未新增 emit
    w.unmount()
  })
})
