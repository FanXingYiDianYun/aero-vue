import type { AeroTreeNode } from './tree.types'
import { collectKeys } from './derive-check-state'

/**
 * check-ops —— Tree 勾选语义点修：全集（full set）契约下的增删纯操作。
 *
 * 契约（与 deriveCheckState 配套，但 userChecked 输入改为「全集」）：
 * - props.checked / emit('update:checked') = 全部视觉选中节点 key 的集合
 *   （显式勾选 ∪ 整选父聚合出的后代），半选父不入集合。
 * - deriveCheckState(data, full) 天然支持该输入：full 含 X → X 及后代 all；
 *   full = 某父 P 的全部后代 → P 由后序聚合 all。故本文件只负责把 full
 *   在用户点击后重新整理成「最小显式集 + 精确删除」，再交回 derive 派生输出。
 *
 * 三函数均纯：不改动入参 Set/树，返回新 Set。
 */

/**
 * minimize(full, tree)：把膨胀的全集压回等价的最小显式集。
 * 规则：若 K ∈ full 且 K 存在严格祖先 A ∈ full，则剔除 K
 * （A 的整选吸收其全部后代，语义不变）。
 * 用途：v-model 回声可能收到膨胀全集（如 [A,B,C,D] 而非 [A]），
 *       先归约到最小显式集，后续 bloom/uncheck 才能正确判定路径锚点 T。
 */
export function minimize(full: Set<string>, tree: AeroTreeNode[]): Set<string> {
  const drop = new Set<string>()
  // forced = 当前节点的某严格祖先 ∈ full（已被整选父吸收）。
  // 判据只看 forced（祖先整选），不看自身 inFull——被吸收的后代即使自身也在
  // full（膨胀回声把聚合 all 的后代也塞了回来），仍应剔除，由父统一代表。
  const walk = (nodes: AeroTreeNode[], forced: boolean): void => {
    for (const n of nodes) {
      if (forced && full.has(n.key)) drop.add(n.key)
      if (n.children) walk(n.children, forced || full.has(n.key))
    }
  }
  walk(tree, false)
  const out = new Set<string>()
  for (const k of full) if (!drop.has(k)) out.add(k)
  return out
}

/**
 * uncheckOp(userChecked, tree, X)：在全集 s 上取消节点 X 的勾选，其余保持。
 * a) s = copy(userChecked)；删除 X 及其全部后代（X 子树整体熄灭）。
 * b) path = X→根 的祖先链；取链中**最接近根**且 ∈ s 的节点为 T（整选父锚点）。
 *    无 T → 直接返回 s（X 本就孤立，删完即净）。
 *    有 T → 沿 T→X 路径逐层「绽放」（bloom）：当前层节点从 s 移除，
 *    其所有**不在路径上**的孩子加入 s；下一个路径节点 == X 时停止（X 不再加回）。
 *    效果：T 的整选被拆解为「除 X 分支外的兄弟子树各归其位」，
 *          X 分支保持全灭，路径中间节点转为派生态（不进集合，除非自身显式）。
 */
export function uncheckOp(
  userChecked: Set<string>,
  tree: AeroTreeNode[],
  X: string,
): Set<string> {
  const s = new Set(userChecked)
  // a) 删除 X 及全部后代
  const xSubtree = findNode(tree, X)
  if (xSubtree) for (const k of collectKeys([xSubtree])) s.delete(k)

  // b) 祖先链 root..X（parentOf 自 X 回溯再反转）
  const parentOf = buildParentMap(tree)
  const chain: string[] = []
  let cur: string | undefined = X
  while (cur !== undefined) {
    chain.unshift(cur)
    cur = parentOf.get(cur)
  }
  // 最接近根且 ∈ s 的节点 = T（chain[0]=X 已被删，故从祖先段找）
  let tIdx = -1
  for (let i = 0; i < chain.length; i++) {
    if (s.has(chain[i])) { tIdx = i; break }
  }
  if (tIdx < 0) return s // 无 T

  // 沿 T→X 逐层绽放；next==X 时停（X 不加回）
  const childrenOf = buildChildrenMap(tree)
  for (let i = tIdx; i < chain.length - 1; i++) {
    const node = chain[i]
    const next = chain[i + 1]
    s.delete(node)
    for (const c of childrenOf.get(node) ?? []) {
      if (c !== next) s.add(c)
    }
    if (next === X) break
  }
  return s
}

/**
 * checkOp(userChecked, X)：勾选 X。
 * 前提：X ∉ checkedKeys 蕴含不存在 X 的显式整选祖先（否则 X 早被聚合为 all），
 * 故直接加入 X 即可，无需处理祖先冲突。
 */
export function checkOp(userChecked: Set<string>, X: string): Set<string> {
  const s = new Set(userChecked)
  s.add(X)
  return s
}

/* ── 内部工具：树索引 ─────────────────────────────────────── */

function findNode(nodes: AeroTreeNode[], key: string): AeroTreeNode | null {
  for (const n of nodes) {
    if (n.key === key) return n
    if (n.children) {
      const hit = findNode(n.children, key)
      if (hit) return hit
    }
  }
  return null
}

function buildParentMap(tree: AeroTreeNode[]): Map<string, string> {
  const m = new Map<string, string>()
  const walk = (nodes: AeroTreeNode[], parent?: string): void => {
    for (const n of nodes) {
      if (parent !== undefined) m.set(n.key, parent)
      if (n.children) walk(n.children, n.key)
    }
  }
  walk(tree)
  return m
}

function buildChildrenMap(tree: AeroTreeNode[]): Map<string, string[]> {
  const m = new Map<string, string[]>()
  const walk = (nodes: AeroTreeNode[]): void => {
    for (const n of nodes) {
      if (n.children?.length) {
        m.set(n.key, n.children.map((c) => c.key))
        walk(n.children)
      }
    }
  }
  walk(tree)
  return m
}
