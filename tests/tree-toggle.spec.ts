// R3 Tree 勾选语义点修 —— 组件级 toggleCheck 集成测试（全集契约 = includeParents:true）
// includeParents 默认 false（叶集），本用例锁定全集模式故显式 includeParents:true。
// 期望值 = 「外部算法逐字实现」经 tree.vue toggleCheck 三步后的真实 emit（全集=全选项）。
// owner demo 树（components 三兄弟 button/form/tree）浏览器实测符合症状：
//   勾父→集合含全部后代；点 form→form off/components 半选/集合无 form；再点→复活。
//   合成树 A→[B,C],B→[D] 取消 D 得 [C]（B 失独子转 none、A 转 half），同为语义正确。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { AeroTree } from 'aero-vue'
import type { AeroTreeNode } from 'aero-vue'

// 合成三层树 A → [B, C]，B → [D]
const tree: AeroTreeNode[] = [
  { key: 'A', label: 'A', children: [
    { key: 'B', label: 'B', children: [{ key: 'D', label: 'D' }] },
    { key: 'C', label: 'C' },
  ] },
]

const sorted = (arr: string[]) => [...arr].sort()

// 点击指定 key 行的 checkbox
async function clickCheck(w: ReturnType<typeof mount>, key: string) {
  const rows = w.findAll('.aero-tree__row')
  const row = rows.find((r) => r.text().includes(key))
  if (!row) throw new Error(`row ${key} not found`)
  await row.find('.aero-tree__check').trigger('click')
  await w.vm.$nextTick()
}

function lastEmitted(w: ReturnType<typeof mount>): string[] {
  const evs = w.emitted('update:checked')!
  return evs[evs.length - 1][0] as string[]
}

// 全集契约 = includeParents:true；本测试全程锁定该模式（默认叶集已另测）。
const mountTree = (checked: string[]) =>
  mount(AeroTree, { props: { data: tree, checkable: true, expanded: ['A', 'B'], checked, includeParents: true } })

// 受控回灌：把上一次 emit 的全集写回 props.checked，模拟 owner 侧 v-model 闭环。
// 关键：emit 输出是「全集」（含聚合展开的后代），故下一步 props.checked 也是全集——
// 这正是 R3 契约的核心（旧语义此处只会得到最小集 [A]）。
async function feedBack(w: ReturnType<typeof mount>) {
  await w.setProps({ checked: lastEmitted(w) })
}

describe('Tree 组件级 toggleCheck（owner 症状逐字复现）', () => {
  it('勾父 → emit 全集含全部后代（半选父不入集，全选项入集）', async () => {
    const w = mountTree([])
    await clickCheck(w, 'A') // s0=minimize([])=[]，A 未选→checkOp[A]→derive→全集
    expect(sorted(lastEmitted(w))).toEqual(['A', 'B', 'C', 'D'])
  })

  it('① checked=[A] 点 B → emit=[C]（A 转半选不入集，兄弟 C 出，B/D 灭）', async () => {
    const w = mountTree(['A'])
    await clickCheck(w, 'B')
    expect(sorted(lastEmitted(w))).toEqual(['C'])
  })

  it('② 回灌 [C] 再点 B → emit=[A,B,C,D]（B 复活整选，与 C 聚合使 A all）', async () => {
    const w = mountTree(['A'])
    await clickCheck(w, 'B'); await feedBack(w) // props.checked=[C]
    await clickCheck(w, 'B')
    expect(sorted(lastEmitted(w))).toEqual(['A', 'B', 'C', 'D'])
  })

  it('③ 膨胀回声 [A,B,C,D] 点 D → emit=[C]（退化树：B 独子灭→none、A 半选不入集，仅旁支 C 保持）', async () => {
    const w = mountTree(['A', 'B', 'C', 'D'])
    await clickCheck(w, 'D')
    // s0=minimize=[A]；uncheckOp([A],tree,D)=bloom→[C]；emit derive([C])=[C]
    // 注：此合成树 B 仅一子 D，与 owner demo(components 三兄弟)结构不同——
    expect(sorted(lastEmitted(w))).toEqual(['C'])
  })

  it('④ checked=[A,B,C,D] 点 A → emit=[]（取消整选父，全树熄灭）', async () => {
    const w = mountTree(['A', 'B', 'C', 'D'])
    await clickCheck(w, 'A')
    expect(lastEmitted(w)).toEqual([])
  })

  it('⑤ 往返组合（受控回灌）：[A] 点 B→[C]；点 B→[A,B,C,D]；点 D→[C]；点 C→[]', async () => {
    const w = mountTree(['A'])
    await clickCheck(w, 'B'); expect(sorted(lastEmitted(w))).toEqual(['C']); await feedBack(w)
    await clickCheck(w, 'B'); expect(sorted(lastEmitted(w))).toEqual(['A', 'B', 'C', 'D']); await feedBack(w)
    await clickCheck(w, 'D'); expect(sorted(lastEmitted(w))).toEqual(['C']); await feedBack(w)
    await clickCheck(w, 'C'); expect(lastEmitted(w)).toEqual([])
  })

  it('disabled 节点点击早退，不 emit', async () => {
    const disTree: AeroTreeNode[] = [
      { key: 'A', label: 'A', children: [{ key: 'X', label: 'X', disabled: true }] },
    ]
    const w = mount(AeroTree, { props: { data: disTree, checkable: true, expanded: ['A'], checked: [] } })
    await clickCheck(w, 'X')
    expect(w.emitted('update:checked')).toBeUndefined()
  })
})
