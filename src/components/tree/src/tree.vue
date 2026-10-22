<script setup lang="ts">
/**
 * Tree 树 —— 任意深度递归 + 勾选联动（后序遍历纯函数派生三态）
 *
 * 根因治理：父子状态不再各自存储 + 事件双向同步。
 * 勾选三态（none/half/all）由 deriveCheckState 一次后序遍历纯函数派生，
 * 渲染只读派生结果，任何路径禁止直接改父状态。
 *
 * 勾选契约（v-model:checked = 全集 full set）：
 * - props.checked / emit('update:checked') = **全部视觉选中节点 key** 的集合
 *   （显式勾选 ∪ 整选父聚合出的后代），半选父不入集合。
 * - toggle 三步（见 toggleCheck）：
 *   ① minimize 把回声膨胀的全集归约为等价最小显式集 s0；
 *   ② 以 derive(data, s0).checkedKeys 判定 X 当前是否选中；
 *   ③ 选中→uncheckOp（删 X 子树 + 沿最近整选祖先到 X 的路径绽放兄弟），
 *      未选→checkOp（直接加 X）；最后 emit derive(data, sNext).checkedKeys。
 * - disabled 节点：点击早退不响应；若上游传入的全集含 disabled 节点 → 停报，
 *   不自作主张修改 derive（derive-check-state.ts 冻结）。
 *
 * includeParents 双模式（默认 false）：
 * - includeParents = true → emit = 现全集契约（含父）。
 * - includeParents = false（默认）→ emit = 全集 checkedKeys 过滤掉「有 children
 *   的节点 key」（仅叶）。半选父两种模式均不入集。
 * - 叶集过 minimize 为恒等（叶无后代可吸收，full⊆叶 即最小显式集），闭环自洽；
 *   check-ops.ts / derive-check-state.ts 内部零改动，过滤仅发生在 emit 出口。
 */
import { computed, ref, watch } from 'vue'
import TreeRow from './tree-row.vue'
import { deriveCheckState, collectKeys } from './derive-check-state'
import { minimize, checkOp, uncheckOp } from './check-ops'
import type { AeroTreeNode } from './tree.types'

const props = withDefaults(
  defineProps<{
    data: AeroTreeNode[]
    /** 展开节点（受控） */
    expanded?: string[]
    /** 选中节点 */
    activeKey?: string
    /** 可选框 */
    checkable?: boolean
    /** 勾选集合（受控）：全集 full set —— 全部视觉选中节点 key（显式 ∪ 整选父聚合后代），半选父不入集合 */
    checked?: string[]
    defaultExpandAll?: boolean
    /** emit('update:checked') 是否包含父节点 key。
 * - true = 全集契约（父 key 入集）
 * - false（默认）= 仅叶（过滤掉有 children 的节点 key），半选父两种模式均不入集 */
    includeParents?: boolean
  }>(),
  { checkable: false, expanded: undefined, checked: undefined, defaultExpandAll: false, includeParents: false },
)

const emit = defineEmits<{
  (e: 'update:expanded', v: string[]): void
  (e: 'update:checked', v: string[]): void
  (e: 'select', node: AeroTreeNode): void
}>()

const expandedSet = computed(() => {
  if (props.expanded) return new Set(props.expanded)
  return props.defaultExpandAll ? new Set(collectKeys(props.data)) : new Set<string>()
})

/** 派生三态：叶子 = userChecked.has；父 = 自身 ∈ userChecked ? all : 后序聚合 */
const derived = computed(() =>
  deriveCheckState(props.data, new Set(props.checked ?? [])),
)
const states = computed(() => derived.value.states)
const checkedKeys = computed(() => derived.value.checkedKeys)

/** 父节点 key 集合（有 children 的节点）——includeParents=false 时
 * emit 出口据此把 checkedKeys 过滤成仅叶。 */
const parentKeySet = computed(() => {
  const s = new Set<string>()
  const walk = (nodes: AeroTreeNode[]): void => {
    for (const n of nodes) {
      if (n.children?.length) s.add(n.key)
      if (n.children) walk(n.children)
    }
  }
  walk(props.data)
  return s
})

function toggleExpand(key: string) {
  if (!props.expanded) return
  const arr = [...props.expanded]
  const i = arr.indexOf(key)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(key)
  emit('update:expanded', arr)
}

/** 勾选切换（全集契约 + includeParents 双模式出口）。三步：minimize → 判态 → checkOp/uncheckOp → emit。
 *  - s0 = minimize(props.checked)：回声膨胀全集归约为等价最小显式集；
 *    includeParents=false 回灌的是叶集，叶过 minimize 为恒等，闭环自洽。
 *  - X ∈ derive(data, s0).checkedKeys ? uncheckOp : checkOp；
 *  - 出口：includeParents=true → emit derive(data, sNext).checkedKeys（全集）；
 *    false → 过滤掉 parentKeySet 中的 key（仅叶）。半选父两种模式均不入集。
 *  disabled 语义沿用现有 derive：点击 disabled 节点早退不响应。 */
function toggleCheck(node: AeroTreeNode) {
  if (!props.checked || node.disabled) return
  const data = props.data
  const s0 = minimize(new Set(props.checked), data)
  const { checkedKeys } = deriveCheckState(data, s0)
  const sNext = checkedKeys.has(node.key)
    ? uncheckOp(s0, data, node.key)
    : checkOp(s0, node.key)
  const out = [...deriveCheckState(data, sNext).checkedKeys]
  emit('update:checked', props.includeParents ? out : out.filter((k) => !parentKeySet.value.has(k)))
}

function onSelect(node: AeroTreeNode) {
  if (node.children?.length) toggleExpand(node.key)
  emit('select', node)
}

/** includeParents 切换即时生效——变化时按当前勾选态（derive 全集）立即按
 * 新模式重发 update:checked（false → 过滤父 key 出叶集；true → 原样全集）。
 * 仅此一个 watch（禁止 watch checked 防循环；消费方回灌 checked 不触发重发）。
 * check-ops / derive 零改动。 */
watch(
  () => props.includeParents,
  () => {
    if (!props.checked) return
    const { checkedKeys } = deriveCheckState(props.data, minimize(new Set(props.checked), props.data))
    const out = [...checkedKeys]
    emit('update:checked', props.includeParents ? out : out.filter((k) => !parentKeySet.value.has(k)))
  },
)
</script>

<template>
  <ul class="aero-tree" role="tree">
    <TreeRow
      v-for="node in data"
      :key="node.key"
      :node="node"
      :depth="0"
      :expanded-set="expandedSet"
      :states="states"
      :checked-keys="checkedKeys"
      :active-key="activeKey"
      :checkable="checkable"
      @toggle-expand="toggleExpand"
      @toggle-check="toggleCheck"
      @select="onSelect"
    />
  </ul>
</template>

<style scoped lang="scss">
.aero-tree {
  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
