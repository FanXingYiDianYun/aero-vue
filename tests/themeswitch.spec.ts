// ThemeSwitch API 扩充 —— 受控翻转 emit+渲染跟值 / disabled 拦截 / size 类与几何 /
// change 与 update:modelValue 双发。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { AeroThemeSwitch } from 'aero-vue'

const base = { props: {} }

describe('ThemeSwitch API', () => {
  it('受控：modelValue 渲染跟值 + 点击只 emit（update:modelValue 与 change 双发，值=翻转后目标）', async () => {
    const w = mount(AeroThemeSwitch, { props: { modelValue: 'light' } })
    const root = w.find('.aero-theme-switch')
    // 渲染跟 prop（暗 = aria-checked true）
    expect(root.classes()).not.toContain('is-dark')
    expect(root.attributes('aria-checked')).toBe('false')
    await root.trigger('click')
    // 两种模式都双发，且更新值 = 目标（light → dark）
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['dark'])
    expect(w.emitted('change')!.at(-1)).toEqual(['dark'])
    // 渲染跟新 prop（v-model 闭环）
    await w.setProps({ modelValue: 'dark' })
    expect(root.classes()).toContain('is-dark')
    expect(root.attributes('aria-checked')).toBe('true')
    w.unmount()
  })

  it('非受控（零回归）：点击不 emit 前仍走内部主题服务，事件双发且值 = 服务切换后值', async () => {
    const w = mount(AeroThemeSwitch, base)
    await w.find('.aero-theme-switch').trigger('click')
    // 双发：两事件都存在、值一致（服务切 dark 或 light 之一，取决于初始服务态）
    const upd = w.emitted('update:modelValue')!.at(-1)![0] as string
    const chg = w.emitted('change')!.at(-1)![0] as string
    expect(['light', 'dark']).toContain(upd)
    expect(upd).toBe(chg)
    w.unmount()
  })

  it('disabled：拦截点击（无 emit）+ aria-disabled + disabled 属性', async () => {
    const w = mount(AeroThemeSwitch, { props: { modelValue: 'light', disabled: true } })
    const root = w.find('.aero-theme-switch')
    expect(root.attributes('disabled')).toBeDefined()
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.classes()).toContain('is-disabled')
    await root.trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    w.unmount()
  })

  it('size：类名 aero-theme-switch--{sm,md,lg}（几何由 Playwright 量测兜底，jsdom 无布局引擎；V1 几何值 sm 36×20/knob14、md 72.2×38/knob26、lg 88×44/knob30——MCP 实测报告 V1 证据）', async () => {
    for (const s of ['sm', 'md', 'lg'] as const) {
      const w = mount(AeroThemeSwitch, { props: { size: s, modelValue: 'light' } })
      const root = w.find('.aero-theme-switch')
      expect(root.classes()).toContain(`aero-theme-switch--${s}`)
      w.unmount()
    }
  })
})
