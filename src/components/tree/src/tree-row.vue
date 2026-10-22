<script setup lang="ts">
/**
 * TreeRow 递归行 —— 任意深度子树渲染 + 三态勾选（none/half/all）
 * 三态由父层 deriveCheckState 后序遍历派生，本行只读，禁止改父状态。
 */
import { computed } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'
import type { AeroTreeNode } from './tree.types'
import type { TreeCheckState } from './derive-check-state'

// 展开/勾选 aria 走词包（tree 组，带参函数键；node.label 为数据值原样传入）
const { tree } = useLocale()

const props = defineProps<{
  node: AeroTreeNode
  depth: number
  expandedSet: Set<string>
  /** 节点 key → 三态 的派生结果（由父层 compute 后传下） */
  states: Map<string, TreeCheckState>
  /** 处于 'all' 态的节点 key 集合（用于受控 checked 回传） */
  checkedKeys: Set<string>
  activeKey?: string
  checkable: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-expand', key: string): void
  (e: 'toggle-check', node: AeroTreeNode): void
  (e: 'select', node: AeroTreeNode): void
}>()

/** 本节点勾选态：直接读派生 Map（叶子/父节点均由后序遍历得出） */
const state = computed<TreeCheckState>(() => props.states.get(props.node.key) ?? 'none')

const open = computed(() => props.expandedSet.has(props.node.key))
</script>

<template>
  <li role="treeitem" :aria-expanded="node.children?.length ? open : undefined">
    <div
      class="aero-tree__row"
      :class="{ 'is-active': node.key === activeKey, 'is-disabled': node.disabled }"
      :style="{ paddingLeft: depth * 20 + 6 + 'px' }"
      @click="node.children?.length ? emit('toggle-expand', node.key) : emit('select', node)"
    >
      <button
        v-if="node.children?.length"
        class="aero-tree__chev"
        :class="{ 'is-open': open }"
        type="button"
        :aria-label="tree.expandAria(node.label)"
        @click.stop="emit('toggle-expand', node.key)"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['chevron-right']" :key="i" :d="d" />
        </svg>
      </button>
      <span v-else class="aero-tree__chev is-leaf" />

      <button
        v-if="checkable"
        class="aero-tree__check"
        :class="`is-${state}`"
        type="button"
        role="checkbox"
        :aria-checked="state === 'all' ? true : state === 'half' ? 'mixed' : false"
        :disabled="node.disabled"
        :aria-label="tree.checkAria(node.label)"
        @click.stop="emit('toggle-check', node)"
      >
        <svg v-if="state === 'all'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['check']" :key="i" :d="d" />
        </svg>
        <i v-else-if="state === 'half'" class="aero-tree__dash" />
      </button>

      <span class="aero-tree__label" @click.stop="emit('select', node)">{{ node.label }}</span>
    </div>

    <transition name="aero-tree">
      <ul v-if="node.children?.length && open" class="aero-tree__group" role="group">
        <TreeRow
          v-for="c in node.children"
          :key="c.key"
          :node="c"
          :depth="depth + 1"
          :expanded-set="expandedSet"
          :states="states"
          :checked-keys="checkedKeys"
          :active-key="activeKey"
          :checkable="checkable"
          @toggle-expand="(k: string) => emit('toggle-expand', k)"
          @toggle-check="(n: AeroTreeNode) => emit('toggle-check', n)"
          @select="(n: AeroTreeNode) => emit('select', n)"
        />
      </ul>
    </transition>
  </li>
</template>

<style scoped lang="scss">
.aero-tree__group {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 13px;
    top: -2px;
    bottom: 10px;
    width: 2px;
    background: var(--ui-line-2);
  }
}

.aero-tree__row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 9px;
  font-size: 13.8px;
  color: var(--ui-ink-2);
  cursor: pointer;
  transition: background 0.18s, color 0.18s;

  &:hover {
    background: var(--ui-bg-soft);
    color: var(--ui-brand-ink);
  }
  &.is-active {
    background: var(--ui-bg-tint);
    color: var(--ui-brand-ink);
    font-weight: 700;
  }
  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}

.aero-tree__chev {
  border: 0;
  background: none;
  padding: 2px;
  display: flex;
  color: var(--ui-ink-3);
  cursor: pointer;
  transition: transform 0.3s var(--ui-spring), color 0.2s;
  flex: none;

  &.is-open {
    transform: rotate(90deg);
    color: var(--ui-brand-ink);
  }
  &.is-leaf {
    width: 13px;
    pointer-events: none;
  }
}

.aero-tree__check {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 2px solid var(--ui-line-2);
  border-radius: 7px;
  background: var(--ui-card);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  flex: none;
  color: var(--ui-on-brand);
  transition: 0.2s;

  &:hover {
    border-color: var(--ui-brand);
  }

  &.is-all {
    background: var(--ui-brand);
    border-color: var(--ui-brand);
  }

  .aero-tree__dash {
    width: 10px;
    height: 3px;
    border-radius: 2px;
    background: var(--ui-brand);
  }
}

.aero-tree__label {
  flex: 1;
}

.aero-tree-enter-active,
.aero-tree-leave-active {
  transition: opacity 0.3s var(--ui-spring), transform 0.3s var(--ui-spring);
  transform-origin: top left;
}
.aero-tree-enter-from,
.aero-tree-leave-to {
  opacity: 0;
  transform: translateY(-4px) scaleY(0.96);
}
</style>
