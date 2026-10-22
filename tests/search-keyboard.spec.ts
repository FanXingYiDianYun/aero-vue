/**
 * AeroSearch 键盘导航测试（新增，只增不删）。
 * 覆盖修复面：↑↓ 高亮在**分组与非分组两分支**移动 + Enter 选中 + Esc 关闭。
 * 修复前：分组分支 li 无 is-focus 绑定 + style 无 .is-focus 规则 → 键盘高亮全模式死。
 * jsdom 补 scrollIntoView 桩（onKeydown→scrollTo 走 rAF 回调调 el.scrollIntoView）。
 * 注意：watch(query) 更新 open 走 Vue 异步调度，setValue 后须 await nextTick 才渲染下拉。
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroSearch, type AeroSearchOption } from 'aero-vue'

const options: AeroSearchOption[] = [
  { value: 'btn', label: 'Button', description: '基础' },
  { value: 'inp', label: 'Input', description: '基础' },
  { value: 'tbl', label: 'Table', description: '数据' },
  { value: 'drw', label: 'Drawer', description: '数据' },
]

beforeAll(() => {
  // jsdom 的 Element.prototype 无 scrollIntoView；defineProperty 挂 no-op 桩（vi.spyOn 要求方法已存在）
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    writable: true,
    configurable: true,
    value: () => undefined,
  })
})

async function typeQuery(w: ReturnType<typeof mount>, q: string) {
  w.find('input').setValue(q)
  await nextTick()
}

/** 按键后 await nextTick（组件 onKeydown 同步改 state，DOM 更新在下一 tick） */
async function pressKey(key: string, w: ReturnType<typeof mount>) {
  w.find('input').trigger('keydown', { key })
  await nextTick()
}

describe('AeroSearch 键盘导航', () => {
  it('非分组：↑↓ 移动 is-focus 高亮 + Enter 选中 + Esc 关闭', async () => {
    const w = mount(AeroSearch, { props: { options, limit: 4 } })
    w.find('input').trigger('focus')
    await typeQuery(w, 'a') // 命中 Table/Drawer（label 含 a）→ 展开
    expect(w.find('ul.aero-search__list').exists()).toBe(true)
    expect(w.findAll('.aero-search__item.is-focus')).toHaveLength(1) // 初始 focusIdx=0 已高亮
    await pressKey('ArrowDown', w)
    expect(w.findAll('.aero-search__item.is-focus')).toHaveLength(1)
    await pressKey('ArrowUp', w)
    expect(w.findAll('.aero-search__item.is-focus')).toHaveLength(1) // 循环回卷，仍恰 1 项
    await pressKey('Enter', w)
    expect(w.emitted('select')).toBeTruthy()
    expect(w.find('ul.aero-search__list').exists()).toBe(false) // 选中后关闭
  })

  it('分组（groupBy）：↑↓ 移动 is-focus 高亮（修复前分组分支此项失败）', async () => {
    const w = mount(AeroSearch, { props: { options, groupBy: 'description', limit: 4 } })
    w.find('input').trigger('focus')
    await typeQuery(w, 'a') // 非空即展开；groupBy=description 分组渲染
    expect(w.find('ul.aero-search__list').exists()).toBe(true)
    const beforeKey = w.findAll('.aero-search__item.is-focus')[0]?.attributes('data-key') ?? null
    await pressKey('ArrowDown', w)
    const afterKey = w.findAll('.aero-search__item.is-focus')[0]?.attributes('data-key') ?? null
    expect(afterKey).not.toBe(beforeKey) // 高亮项随 ArrowDown 移动（分组分支修复点）
    expect(w.findAll('.aero-search__item.is-focus')).toHaveLength(1)
    await pressKey('Escape', w)
    expect(w.find('ul.aero-search__list').exists()).toBe(false) // Esc 关闭
  })
})
