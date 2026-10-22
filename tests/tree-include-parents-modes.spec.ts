// S2 Tree includeParents 双模式 —— 组件级 emit 出口测试（叶集 / 全集）
// 合成树同 R3：A → [B, C]，B → [D]
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
const clickCheck = async (w: ReturnType<typeof mount>, key: string) => {
  const row = w.findAll('.aero-tree__row').find((r) => r.text().includes(key))!
  await row.find('.aero-tree__check').trigger('click')
  await w.vm.$nextTick()
}
const lastEmitted = (w: ReturnType<typeof mount>) => {
  const e = w.emitted('update:checked')!
  return e[e.length - 1][0] as string[]
}

describe('Tree includeParents（叶集 / 全集双模式）', () => {
  it('① 勾父 A：includeParents=false（默认）→ emit 仅叶 [C,D]（父 A/B 不入集）', async () => {
    const w = mount(AeroTree, { props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: [] } })
    await clickCheck(w, 'A') // 勾整选父 → 视觉全选 {A,B,C,D}；叶集 = C,D
    expect(sorted(lastEmitted(w))).toEqual(['C', 'D'])
  })

  it('② 勾父 A：includeParents=true → emit 全集 [A,B,C,D]（父 key 入集）', async () => {
    const w = mount(AeroTree, { props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: [], includeParents: true } })
    await clickCheck(w, 'A')
    expect(sorted(lastEmitted(w))).toEqual(['A', 'B', 'C', 'D'])
  })

  it('③ 点中间层 B（两模式）：B 灭 + D 灭，C 保留；false=叶集 [C] / true=全集 [C]（B 半选不入集）', async () => {
    // 起点：先勾 A 使 B、C、D 全视觉选中
    const wf = mount(AeroTree, { props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: ['A'] } })
    await clickCheck(wf, 'B') // uncheckOp：删 B、D，绽放 C；false 叶集=[C]
    expect(sorted(lastEmitted(wf))).toEqual(['C'])

    const wt = mount(AeroTree, { props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: ['A'], includeParents: true } })
    await clickCheck(wt, 'B') // true 全集：emit checkedKeys=[C]（A、B 半选不入集）
    expect(sorted(lastEmitted(wt))).toEqual(['C'])
  })

  it('④ 往返闭环（false 叶集）：勾 A→[C,D]；喂回→点 A→[]（叶集最小化恒等，可复现全灭）', async () => {
    const w = mount(AeroTree, { props: { data: tree, checkable: true, expanded: ['A', 'B'], checked: [] } })
    await clickCheck(w, 'A'); expect(sorted(lastEmitted(w))).toEqual(['C', 'D'])
    await w.setProps({ checked: lastEmitted(w) }) // 叶集回灌
    await clickCheck(w, 'A') // 取消：s0=minimize([C,D])=[C,D]（叶无整选祖先→恒等），
    // derive([C,D])：B 有 C 无? B 子仅 D；C 在 src 层。A 子=[B,C]，B=all? D∈→B all；C∈→A all
    // 取消 A → uncheckOp 删全子树 → []
    expect(lastEmitted(w)).toEqual([])
  })
})
