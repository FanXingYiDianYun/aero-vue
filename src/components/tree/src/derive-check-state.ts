import type { AeroTreeNode } from './tree.types'

/** 勾选态三值：
 *  - none：未选中（无后代被勾）
 *  - half：半选（部分后代被勾）
 *  - all：全选（自身及全部后代被勾） */
export type TreeCheckState = 'none' | 'half' | 'all'

/**
 * deriveCheckState —— 后序遍历一次，纯函数输出各节点勾选态。
 *
 * 语义：
 * - 唯一可变状态 = userChecked（仅用户直接勾选的节点 key）
 * - 叶子节点：userChecked.has(key) ? 'all' : 'none'
 * - 父节点：
 *   - 自身 key ∈ userChecked → 'all'（显式整选，后代随同进同出）
 *   - 否则：全部后代 'all' → 'all'；部分后代 'all'/'half' → 'half'；全 'none' → 'none'
 *
 * 输出：
 * - states: 节点 key → 三值态 的 Map
 * - checkedKeys: 全部处于 'all' 态的节点 key（叶子 ∪ 被显式整选/聚合整选的父）
 *
 * 调用方约定：
 * - 渲染只读 states，禁止直接改父状态
 * - toggle 只写 userChecked（勾父 → 父 key 入集合；取消父 → 父 key 出集合 + 全部后代出集合）
 */
export function deriveCheckState(
  data: AeroTreeNode[],
  userChecked: Set<string>,
): { states: Map<string, TreeCheckState>; checkedKeys: Set<string> } {
  const states = new Map<string, TreeCheckState>()
  const checkedKeys = new Set<string>()

  function visit(node: AeroTreeNode): TreeCheckState {
    // 显式整选优先：自身 key ∈ userChecked → 整子树 all
    if (userChecked.has(node.key)) {
      states.set(node.key, 'all')
      checkedKeys.add(node.key)
      if (node.children) {
        node.children.forEach((c) => {
          states.set(c.key, 'all')
          checkedKeys.add(c.key)
          collectKeys([c]).forEach((k) => {
            if (k !== c.key) {
              states.set(k, 'all')
              checkedKeys.add(k)
            }
          })
        })
      }
      return 'all'
    }
    if (!node.children?.length) {
      states.set(node.key, 'none')
      return 'none'
    }
    const childStates = node.children.map(visit)
    const allChecked = childStates.every((s) => s === 'all')
    const anyChecked = childStates.some((s) => s !== 'none')
    const state: TreeCheckState = allChecked ? 'all' : anyChecked ? 'half' : 'none'
    states.set(node.key, state)
    if (state === 'all') checkedKeys.add(node.key)
    return state
  }

  data.forEach(visit)
  return { states, checkedKeys }
}

/** 收集子树全部 key（含自身） */
export function collectKeys(nodes: AeroTreeNode[]): string[] {
  return nodes.flatMap((n) => [n.key, ...collectKeys(n.children ?? [])])
}
