// Announce actionHref（owner 授权解除组件本体冻结）——
// 有 actionHref → action 槽外层 <a> href=target=_blank+rel；无 → 现行为 href="#"（零回归）。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { AeroAnnounce } from 'aero-vue'

const slots = {
  title: 'Title',
  default: 'Body',
  action: 'View release notes',
}

describe('Announce actionHref', () => {
  it('无 actionHref（默认）：action <a> href="#"，无 target/rel（零回归）', () => {
    const w = mount(AeroAnnounce, { slots })
    const a = w.find('.aero-announce__act')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('#')
    expect(a.attributes('target')).toBeUndefined()
    expect(a.attributes('rel')).toBeUndefined()
    w.unmount()
  })

  it('actionHref=https://github.com/FanXingYiDianYun/aero-vue：href 原样 + target=_blank + rel=noopener noreferrer', () => {
    const w = mount(AeroAnnounce, { props: { actionHref: 'https://github.com/FanXingYiDianYun/aero-vue' }, slots })
    const a = w.find('.aero-announce__act')
    expect(a.attributes('href')).toBe('https://github.com/FanXingYiDianYun/aero-vue')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
    w.unmount()
  })
})
