// Tree 三层勾选夹具（owner 阶段 F1 必测 6 例，挂进门禁）
import { describe, it, expect } from 'vitest'
import { AeroTree, deriveCheckState } from 'aero-vue'
import type { AeroTreeNode } from 'aero-vue'

// 三层夹具：root → [a, b] → [a1, b1]
const data: AeroTreeNode[] = [
  { key: 'root', label: 'root', children: [
    { key: 'a', label: 'a', children: [{ key: 'a1', label: 'a1' }] },
    { key: 'b', label: 'b', children: [{ key: 'b1', label: 'b1' }] },
  ] },
]

describe('Tree 三层勾选夹具', () => {
  it('例1 全选子 → 父 checked（勾 a + b 后 root 聚合 all）', () => {
    // 用 deriveCheckState 纯函数验证：勾 a1+b1 → a、b 聚合 all → root 聚合 all
    const { states } = deriveCheckState(data, new Set(['a1', 'b1']))
    expect(states.get('a')).toBe('all')
    expect(states.get('b')).toBe('all')
    expect(states.get('root')).toBe('all')
  })

  it('例2 取消一个 → 父 indeterminate（取消 a1 后 root 聚合 half）', () => {
    const { states } = deriveCheckState(data, new Set(['b1']))
    expect(states.get('a')).toBe('none')
    expect(states.get('b')).toBe('all')
    expect(states.get('root')).toBe('half')
  })

  it('例3 全不选 → 父 unchecked（空集合下所有节点 none）', () => {
    const { states, checkedKeys } = deriveCheckState(data, new Set())
    expect(states.get('a')).toBe('none')
    expect(states.get('b')).toBe('none')
    expect(states.get('root')).toBe('none')
    expect(checkedKeys.size).toBe(0)
  })

  it('例4 中间层传播（勾 root → 子孙 a1/b1 全 all）', () => {
    const { states } = deriveCheckState(data, new Set(['root']))
    expect(states.get('root')).toBe('all')
    expect(states.get('a')).toBe('all')
    expect(states.get('b')).toBe('all')
    expect(states.get('a1')).toBe('all')
    expect(states.get('b1')).toBe('all')
  })

  it('例5 初始部分选中（checked=[a1] 时 b 为 none、root 为 half）', () => {
    const { states } = deriveCheckState(data, new Set(['a1']))
    expect(states.get('a')).toBe('all')
    expect(states.get('b')).toBe('none')
    expect(states.get('a1')).toBe('all')
    expect(states.get('b1')).toBe('none')
    expect(states.get('root')).toBe('half')
  })

  it('例6 勾父 → 子孙全选中（userChecked={root} 时显式整选，a/b/a1/b1 全 all）', () => {
    // 新语义：勾父仅 userChecked 加 root key；子孙 by 显式整选自然 all
    const { states } = deriveCheckState(data, new Set(['root']))
    expect(states.get('root')).toBe('all')
    expect(states.get('a')).toBe('all')
    expect(states.get('b')).toBe('all')
    expect(states.get('a1')).toBe('all')
    expect(states.get('b1')).toBe('all')
  })
})
