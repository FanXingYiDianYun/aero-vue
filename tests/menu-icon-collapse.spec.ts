// Menu icon 渲染 + collapsed 折叠态——icon 组件 <component :is> 渲染出 svg，
// collapsed 切换后根 class is-collapsed / inline 宽度 64px 证据。
import { it, expect, describe } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h, type Component } from 'vue'
import { AeroMenu, type MenuItem } from 'aero-vue'

function makeIcon(paths: string[]): Component {
  return {
    name: 'N3TestIcon',
    render() {
      return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, paths.map((d) => h('path', { d, key: d })))
    },
  }
}

const ITEMS: MenuItem[] = [
  { key: 'a', label: 'A', group: 'G1', icon: makeIcon(['M3 6h18']) },
  { key: 'b', label: 'B', group: 'G1', icon: makeIcon(['M3 12h18']) },
  { key: 'c', label: 'C', icon: makeIcon(['M3 18h18']) },
]

describe('Menu icon + collapsed', () => {
  it('icon 渲染存在；collapsed 切换后宽度/class 变化', async () => {
    const w = mount(AeroMenu, {
      props: { items: ITEMS, modelValue: 'a', mode: 'vertical' },
      attachTo: document.body,
    })

    // icon 渲染：vertical 每项 icon 组件渲染出 svg（3 项 3 个 svg）
    const icons = w.findAll('svg.aero-menu__icon')
    expect(icons.length).toBe(3)

    // 分组标题渲染（G1 一组 + 无 group 项无标题）
    const groups = w.findAll('.aero-menu__group')
    expect(groups.length).toBe(1)
    expect(groups[0].text()).toBe('G1')

    // 展开态：根 class 无 is-collapsed；inline 宽度 240px
    const root = w.element as HTMLElement
    expect(root.classList.contains('is-collapsed')).toBe(false)
    expect(root.style.width).toBe('240px')

    // 折叠态：切 collapsed=true → class is-collapsed + 宽度 64px + 分组标题转 is-line
    await w.setProps({ collapsed: true })
    await nextTick()
    expect(root.classList.contains('is-collapsed')).toBe(true)
    expect(root.style.width).toBe('64px')
    const line = w.find('.aero-menu__group.is-line')
    expect(line.exists()).toBe(true)

    w.unmount()
  })

  it('vertical 共享滑动指示条存在且 aria-hidden（几何/过渡由渲染级 MCP 验收）', async () => {
    const w = mount(AeroMenu, {
      props: { items: ITEMS, modelValue: 'b', mode: 'vertical' },
      attachTo: document.body,
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 50)) // 等 mounted 双 rAF 即时定位
    const ind = w.find('.aero-menu__indicator')
    expect(ind.exists()).toBe(true)
    expect(ind.attributes('aria-hidden')).toBe('true')
    // transform 已定位（非空字符串）
    const style = (ind.element as HTMLElement).style
    expect(style.transform).toMatch(/^translate\(/)
    // 每项不再挂 ::before 指示条（源码静态断言：vertical 区段无 ::before；
    // horizontal 的 pill dot 指示器保留不动）
    const src = (await import('node:fs')).readFileSync(
      (await import('node:path')).resolve(__dirname, '../src/components/menu/src/menu.vue'),
      'utf8',
    )
    const vertBlock = src.slice(src.indexOf('&.is-vertical'))
    expect(vertBlock).not.toContain('::before')
    // 指示条过渡走 MotionPresets token（不写死数值）
    expect(src).toMatch(/transition:\s*transform var\(--ui-dur-mid\) var\(--ui-spring\)/)
    w.unmount()
  })

  it('beta-1 B1：折叠态内 active 切换不再走 instant 无过渡路径（prevCollapsed 差分回归）', async () => {
    const w = mount(AeroMenu, {
      props: { items: ITEMS, modelValue: 'a', mode: 'vertical', collapsed: true },
      attachTo: document.body,
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 50)) // 等 mounted 即时定位

    // 折叠态内切 active：watch 触发帧 instant = collapsed!==prevCollapsed = false
    // → indicator 只写 transform（style.transition 不被置 'none'）
    await w.setProps({ modelValue: 'b' })
    await nextTick()
    await new Promise((r) => setTimeout(r, 50))
    const ind = w.find('.aero-menu__indicator')
    expect(ind.exists()).toBe(true)
    const style = (ind.element as HTMLElement).style
    expect(style.transition).not.toBe('none')
    expect(style.transform).toMatch(/^translate\(/)

    // 折叠⇄展开切换帧：instant = true（防追赶容器 0.25s 宽度过动画）
    await w.setProps({ collapsed: false })
    await nextTick()
    await new Promise((r) => setTimeout(r, 50))
    expect((ind.element as HTMLElement).style.transition).not.toBe('none') // 双 rAF 后已恢复

    // 源码回归断言（与 P2 用例同模式）：watch 入口不再把「当前折叠态」当 instant
    const src = (await import('node:fs')).readFileSync(
      (await import('node:path')).resolve(__dirname, '../src/components/menu/src/menu.vue'),
      'utf8',
    )
    expect(src).toContain('props.collapsed !== prevCollapsed')
    expect(src).not.toContain('syncAll(props.collapsed)')
    w.unmount()
  })
})
