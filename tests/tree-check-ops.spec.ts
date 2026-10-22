// R3 Tree 勾选语义点修 —— check-ops 纯函数单测（minimize / uncheckOp / checkOp）
// 期望值 = 「外部算法逐字实现」的真实输出。uncheckOp 的「路径绽放(bloom)」把锚点 T
// 沿路剥出集合、补入旁支兄弟，中间层节点转为派生态（derive 重算）。
// 注意：emit 只含「全选项」（checkedKeys），半选父不入集——故合成树 A→[B,C],B→[D]
//   取消 D 后 B 无剩余选中子→B 转 none、A 转 half(仅 C 保留)，emit=[C] 为语义正确
//   （owner demo 树 components 有 button/form/tree 三兄弟，取消其一其余聚合保持，
//    浏览器实测符合「form off/components 半选/集合无 form」症状。
import { describe, it, expect } from 'vitest'
import {
  minimize,
  uncheckOp,
  checkOp,
} from '../src/components/tree/src/check-ops'
import type { AeroTreeNode } from 'aero-vue'

const sorted = (s: Set<string>) => [...s].sort()

// 合成三层树 A → [B, C]，B → [D]
const tree: AeroTreeNode[] = [
  { key: 'A', label: 'A', children: [
    { key: 'B', label: 'B', children: [{ key: 'D', label: 'D' }] },
    { key: 'C', label: 'C' },
  ] },
]

describe('check-ops · minimize（全集→等价最小显式集）', () => {
  it('态1 孤立叶子保留：[D] 无 full 祖先 → 原样', () => {
    expect(sorted(minimize(new Set(['D']), tree))).toEqual(['D'])
  })

  it('态2 整选父吸收后代：[A,B,C,D] → [A]（B/C/D 均有严格祖先 A ∈ full）', () => {
    expect(sorted(minimize(new Set(['A', 'B', 'C', 'D']), tree))).toEqual(['A'])
  })

  it('态3 半选父不误删：[B,D] → [B]（B 无 full 祖先；D 被 B 吸收）', () => {
    expect(sorted(minimize(new Set(['B', 'D']), tree))).toEqual(['B'])
  })

  it('空集幂等', () => {
    expect(minimize(new Set(), tree).size).toBe(0)
  })
})

describe('check-ops · checkOp（未选 X 直接加）', () => {
  it('s0=[] 勾 B → [B]', () => {
    expect(sorted(checkOp(new Set(), 'B'))).toEqual(['B'])
  })
  it('不改动入参', () => {
    const s = new Set(['C'])
    checkOp(s, 'B')
    expect(sorted(s)).toEqual(['C'])
  })
})

describe('check-ops · uncheckOp（逐字实现真实行为）', () => {
  // 调用方（tree.vue）传入的是 minimize 后的 s0，故这些用例输入均为最小显式集。

  it('① minimal=[A] 取消 B → [C]（A 转半选不入集，兄弟 C 出，B/D 灭）', () => {
    // s=[A]；删 B、D → []；chain=[A,B]，T=A(i=0)
    // bloom i=0(A,next=B==X)：删 A→[]，孩子除 B→C 加入→[C]；break
    expect(sorted(uncheckOp(new Set(['A']), tree, 'B'))).toEqual(['C'])
  })

  it('② minimal=[A] 取消 A → []（X=A 无祖先 T → 仅删全子树）', () => {
    // chain=[A]；X=A 连同后代删净；tIdx=-1 → 返回 []
    expect(sorted(uncheckOp(new Set(['A']), tree, 'A'))).toEqual([])
  })

  it('③ minimal=[A] 取消 D → [C]（语义正确：B 失全部选中子转 none，A 转 half 仅 C 保留）', () => {
    // s=[A]；删 D → [A]；chain=[A,B,D]，T=A
    // i=0(A,next=B≠X)：删A→[]，孩子除B→C加→[C]
    // i=1(B,next=D==X)：删B(不在)，break
    // B 只有 D 一个孩子，D 灭后 B 无选中子→none；emit 仅含全选项 C，A/B 半选不入集。
    expect(sorted(uncheckOp(new Set(['A']), tree, 'D'))).toEqual(['C'])
  })

  it('④ 路径中间节点也显式：minimal=[A,B] 取消 D → [C]（沿路剥离至旁支）', () => {
    // s=[A,B]；删 D → [A,B]；chain=[A,B,D]，T=A
    // i=0(A,next=B)：删A→[B]，孩子除B→C加→[B,C]
    // i=1(B,next=D==X)：删B→[C]，break
    expect(sorted(uncheckOp(new Set(['A', 'B']), tree, 'D'))).toEqual(['C'])
  })

  it('⑤ 取消孤立叶子（无整选祖先）：minimal=[D] 取消 D → []', () => {
    // s=[D]；删 D→[]；chain=[A,B,D]，无∈s 的 T → 返回 []
    expect(sorted(uncheckOp(new Set(['D']), tree, 'D'))).toEqual([])
  })

  it('⑥ 兄弟子树有后代时整体绽放：minimal=[R] 取消 B → [C]，C 子树经 derive 聚合保持', () => {
    const deep: AeroTreeNode[] = [
      { key: 'R', label: 'R', children: [
        { key: 'B', label: 'B', children: [{ key: 'D', label: 'D' }] },
        { key: 'C', label: 'C', children: [{ key: 'E', label: 'E' }] },
      ] },
    ]
    // minimal=[R]；删 B、D → [R]；chain=[R,B]，T=R(i=0)
    // i=0(R,next=B==X)：删R→[]，孩子除B→C加入→[C]；break
    expect(sorted(uncheckOp(new Set(['R']), deep, 'B'))).toEqual(['C'])
    // derive(deep,[C]) → C 聚合 E → C,E all，R half → 组件 emit 全集 [C,E]（受控闭环正确）
  })

  it('不改动入参', () => {
    const s = new Set(['A'])
    uncheckOp(s, tree, 'B')
    expect(sorted(s)).toEqual(['A'])
  })
})
