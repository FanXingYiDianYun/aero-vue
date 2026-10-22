// P4①：K2 库 guard 偏脆重设计（sort-list + swipe-deck）——
// locale 同步守卫由「键序全等」改「按键合并」：改序 + 换文案后，
// 文案更新且顺序保持 inner（用户序）；键集合不一致才整体重置。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroSortList, AeroSwipeDeck } from 'aero-vue'

describe('K2 sort-list guard（按键合并）', () => {
  it('拖动改序后换文案 → 顺序保持 inner、文案刷新；键集合变化才重置', async () => {
    const w = mount(AeroSortList, {
      props: {
        items: [
          { key: 'a', name: '甲' },
          { key: 'b', name: '乙' },
          { key: 'c', name: '丙' },
        ],
      },
      attachTo: document.body,
    })
    const list = () => (w.vm as { order: { key: string; name: string }[] }).order
    // 模拟用户拖动改序（inner 键序 b,a,c 与 props 键序 a,b,c 不再全等）
    // （defineExpose 暴露的 ref 经 proxy 解包：w.vm.order = X 走 ref setter）
    w.vm.order = [
      { key: 'b', name: '乙' },
      { key: 'a', name: '甲' },
      { key: 'c', name: '丙' },
    ]
    await nextTick()
    // 旧守卫断言失败点：键序全等检查不过 → 文案不同步（偏脆）。
    // 模拟 locale 切换：items 换文案、键集合不变、props 仍按 a,b,c 序
    await w.setProps({
      items: [
        { key: 'a', name: 'A' },
        { key: 'b', name: 'B' },
        { key: 'c', name: 'C' },
      ],
    })
    await nextTick()
    // 顺序保持 inner（b,a,c），文案逐键刷新
    expect(list().map((i) => i.key)).toEqual(['b', 'a', 'c'])
    expect(list().map((i) => i.name)).toEqual(['B', 'A', 'C'])
    // 键集合不一致（删 b）→ 整体重置为 props 序
    await w.setProps({
      items: [
        { key: 'a', name: 'A' },
        { key: 'c', name: 'C' },
      ],
    })
    await nextTick()
    expect(list().map((i) => i.key)).toEqual(['a', 'c'])
    w.unmount()
  })
})

describe('K2 swipe-deck guard（按键合并）', () => {
  it('飞出改序后换文案 → 牌序保持、字段全量刷新；键集合变化交给增删 watch', async () => {
    const w = mount(AeroSwipeDeck, {
      props: {
        cards: [
          { name: 'a', statusText: '甲态', foot: '脚注甲' },
          { name: 'b', statusText: '乙态', foot: '脚注乙' },
        ],
        loop: false,
      },
      attachTo: document.body,
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 60))
    // 模拟飞出销毁 + 新卡（键集合变化走 keep/added 逻辑，order 变 a-only + 新 c）
    await w.setProps({
      cards: [
        { name: 'a', statusText: '甲态', foot: '脚注甲' },
        { name: 'c', statusText: '丙态', foot: '脚注丙' },
      ],
    })
    await nextTick()
    const root = w.element as HTMLElement
    const names = [...root.querySelectorAll('.aero-sdeck__card')].map((el) => el.dataset.name)
    expect(names).toEqual(['a', 'c'])
    // locale 切换：同键集合换文案（含 statusText/foot 全字段）
    await w.setProps({
      cards: [
        { name: 'a', statusText: 'Alpha', foot: 'foot-a' },
        { name: 'c', statusText: 'Gamma', foot: 'foot-c' },
      ],
    })
    await nextTick()
    const cardA = root.querySelector<HTMLElement>('.aero-sdeck__card[data-name="a"]')!
    const cardC = root.querySelector<HTMLElement>('.aero-sdeck__card[data-name="c"]')!
    expect(cardA.textContent).toContain('Alpha')
    expect(cardA.textContent).toContain('foot-a')
    expect(cardC.textContent).toContain('Gamma')
    // 顺序保持 inner（a 先于 c）
    const names2 = [...root.querySelectorAll('.aero-sdeck__card')].map((el) => el.dataset.name)
    expect(names2).toEqual(['a', 'c'])
    w.unmount()
  })
})
