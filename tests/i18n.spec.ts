/**
 * J5A.2 i18n 固化门禁（owner 验收标准）：
 * 1. 无 Provider 时组件回落 zh-cn 默认词包（pagination 跳转器渲染「前往」）
 * 2. AeroConfigProvider locale="en-us" 包裹后同一组件渲染「Go to」
 * 词包注入靠 provide/inject，jsdom 下无需真实浏览器。
 */
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { AeroPagination, AeroConfigProvider, enUs, zhCn } from 'aero-vue'

const pgProps = { modelValue: 3, total: 270, pageSize: 10 }

describe('i18n 固化（useLocale × AeroConfigProvider）', () => {
  it('无 Provider 默认 zh-cn：pagination 跳转器渲染「前往/确定/N 页」', () => {
    const w = mount(AeroPagination, { props: pgProps })
    const jump = w.find('.aero-pg__jump')
    expect(jump.exists()).toBe(true)
    expect(jump.text()).toContain('前往')
    expect(jump.text()).toContain('确定')
    expect(jump.text()).toContain('27 页')
  })

  it('AeroConfigProvider locale=en-us：同一组件渲染 Go to / Go / pages', () => {
    const w = mount(AeroConfigProvider, {
      props: { locale: 'en-us' },
      slots: { default: () => h(AeroPagination, { ...pgProps }) },
    })
    const jump = w.find('.aero-pg__jump')
    expect(jump.exists()).toBe(true)
    expect(jump.text()).toContain('Go to')
    expect(jump.text()).toContain('Go')
    expect(jump.text()).toContain('pages')
  })

  it('词包常量可独立导入（固化证明：en-us/zh-cn 导出，pack 后子路径可达）', () => {
    expect(zhCn.pagination.go).toBe('前往')
    expect(enUs.pagination.go).toBe('Go to')
    expect(enUs.code.copy).toBe('Copy')
  })
})
