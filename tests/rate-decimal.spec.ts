// Rate 小数评级（allowDecimal）——置 3.7 → 第 4 星裁切宽 70% + aria-valuenow=3.7；
// 开关切回整数 → 值取整渲染恢复（is-on 整星，无 __fill 叠层）。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroRate } from 'aero-vue'

describe('Rate allowDecimal', () => {
  it('小数：modelValue 3.7 → 第 4 星 __fill 宽 70%，根 aria-valuenow=3.7', async () => {
    const w = mount(AeroRate, {
      props: { modelValue: 3.7, allowDecimal: true },
      attachTo: document.body,
    })
    await nextTick()
    const stars = w.findAll('.aero-rate__star')
    expect(stars.length).toBe(5)
    // 第 4 星（i=4）：fill = clamp(3.7 - 3, 0, 1) = 0.7 → __fill 宽 70%
    const fill4 = stars[3].find('.aero-rate__fill')
    expect(fill4.exists()).toBe(true)
    expect((fill4.element as HTMLElement).style.width).toBe('70%')
    // 第 3 星：fill = clamp(3.7 - 2, 0, 1) = 1 → 满填充 100%；第 5 星：fill = 0 → 无叠层
    expect(stars[2].find('.aero-rate__fill').exists()).toBe(true)
    expect((stars[2].find('.aero-rate__fill').element as HTMLElement).style.width).toBe('100%')
    expect(stars[4].find('.aero-rate__fill').exists()).toBe(false)
    // aria-valuenow 一位小数（根上）
    expect(w.attributes('aria-valuenow')).toBe('3.7')
    // 整数模式不渲染叠层（对照）
    const w2 = mount(AeroRate, { props: { modelValue: 3.7 } })
    expect(w2.find('.aero-rate__fill').exists()).toBe(false)
    expect(w2.attributes('aria-valuenow')).toBeUndefined()
    w.unmount()
    w2.unmount()
  })

  it('切回整数：值取整渲染恢复——is-on 整星、无 __fill、emit 整星', async () => {
    const w = mount(AeroRate, {
      props: { modelValue: 3.7, allowDecimal: true },
      attachTo: document.body,
    })
    await nextTick()
    expect(w.findAll('.aero-rate__fill').length).toBe(4) // 1–4 星（1/2/3 星 100% + 4 星 70%）
    // 开关切回整数
    await w.setProps({ allowDecimal: false, modelValue: 4 })
    await nextTick()
    expect(w.find('.aero-rate__fill').exists()).toBe(false)
    const on = w.findAll('.aero-rate__star.is-on')
    expect(on.length).toBe(4)
    expect(w.attributes('aria-valuenow')).toBeUndefined()
    // 整星点击仍 emit 整数
    const stars = w.findAll('.aero-rate__star')
    stars[1].trigger('click')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([2])
    w.unmount()
  })
})
