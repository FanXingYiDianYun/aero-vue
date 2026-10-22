// T5 Tree includeParents 即时生效 —— 程序化翻转 includeParents → update:checked 立即按新模式重发
// （不 watch checked 防循环；check-ops/derive 零改动）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { AeroTree } from 'aero-vue'
import type { AeroTreeNode } from 'aero-vue'

const tree: AeroTreeNode[] = [
  { key: 'A', label: 'A', children: [
    { key: 'B', label: 'B', children: [{ key: 'D', label: 'D' }] },
    { key: 'C', label: 'C' },
  ] },
]

const sorted = (a: string[]) => [...a].sort()

describe('Tree includeParents 即时生效', () => {
  it('程序化 false→true：当前勾选态立即按全集重发（父 key 补入，无需再点树）', async () => {
    // 叶集模式勾 A → emit [C,D]（消费方回灌叶集）
    const w = mount(AeroTree, {
      props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: [], includeParents: false },
    })
    const rows = w.findAll('.aero-tree__row')
    const rowA = rows.find((r) => r.text().includes('A'))!
    await rowA.find('.aero-tree__check').trigger('click')
    const afterClick = w.emitted('update:checked')!.at(-1)![0] as string[]
    expect(sorted(afterClick)).toEqual(['C', 'D']) // 叶集
    await w.setProps({ checked: afterClick }) // 消费方回灌
    const before = w.emitted('update:checked')!.length
    // 翻转 includeParents=true → watch 立即按当前 derive 全集重发 [A,B,C,D]
    await w.setProps({ includeParents: true })
    await w.vm.$nextTick()
    const evs = w.emitted('update:checked')!
    expect(evs.length).toBe(before + 1) // 恰好多一次重发
    expect(sorted(evs.at(-1)![0] as string[])).toEqual(['A', 'B', 'C', 'D']) // 全集含父
    w.unmount()
  })

  it('程序化 true→false：全集回灌叶集（父 key 过滤出），且回灌 checked 不触发重发（无循环）', async () => {
    const w = mount(AeroTree, {
      props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: ['A', 'B', 'C', 'D'], includeParents: true },
    })
    const before = (w.emitted('update:checked') ?? []).length
    await w.setProps({ includeParents: false })
    await w.vm.$nextTick()
    const evs = w.emitted('update:checked')!
    expect(evs.length).toBe(before + 1)
    expect(sorted(evs.at(-1)![0] as string[])).toEqual(['C', 'D']) // 叶集
    // 消费方回灌叶集 → 不应触发任何新 emit（watch 只盯 includeParents）
    await w.setProps({ checked: ['C', 'D'], includeParents: false })
    await w.vm.$nextTick()
    expect(w.emitted('update:checked')!.length).toBe(before + 1) // 未再重发
    w.unmount()
  })
})
