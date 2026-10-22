<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClickOutside } from '../../../composables'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'
import AeroTree from '../../tree/src/tree.vue'
import type { AeroTreeNode } from '../../tree/src/tree.types'

// 占位文案缺省走词包（treeSelect 组；显式 placeholder prop 仍覆盖）
const { treeSelect } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 树形数据（节点含 key/label/children） */
    data: AeroTreeNode[]
    /** 当前选中节点的 key（v-model，未选时为 undefined） */
    modelValue?: string
    /** 未选中时的占位文案（缺省走词包 treeSelect.placeholder） */
    placeholder?: string
    /** 是否禁用（默认：false） */
    disabled?: boolean
    /** 面板打开时是否默认展开所有节点（默认：true） */
    defaultExpandAll?: boolean
  }>(),
  { placeholder: undefined, disabled: false, defaultExpandAll: true },
)

const placeholderText = computed(() => props.placeholder ?? treeSelect.value.placeholder)

const emit = defineEmits<{
  /** 选中叶子节点时同步 v-model */
  (e: 'update:modelValue', v: string): void
  /** 选中叶子节点时触发 */
  (e: 'change', v: string): void
}>()

const root = ref<HTMLElement>()
const open = ref(false)
useClickOutside(
  () => root.value,
  () => (open.value = false),
)

function findLabel(nodes: AeroTreeNode[], key?: string): string {
  if (!key) return ''
  for (const n of nodes) {
    if (n.key === key) return n.label
    const hit = findLabel(n.children ?? [], key)
    if (hit) return hit
  }
  return ''
}

const label = () => findLabel(props.data, props.modelValue)

function onSelect(node: AeroTreeNode) {
  if (node.children?.length) return
  emit('update:modelValue', node.key)
  emit('change', node.key)
  open.value = false
}
</script>

<template>
  <div ref="root" class="aero-tsel" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button class="aero-tsel__btn" type="button" @click="open = !open">
      <span :class="{ 'is-ph': !modelValue }">{{ label() || placeholderText }}</span>
      <svg class="aero-tsel__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['chevron-down']" :key="i" :d="d" />
      </svg>
    </button>
    <transition name="aero-tsel">
      <div v-if="open" class="aero-tsel__panel">
        <AeroTree :data="data" :active-key="modelValue" :default-expand-all="defaultExpandAll" @select="onSelect" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-tsel {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 11px 14px;
    font-size: 14.5px;
    font-family: inherit;
    font-weight: 500;
    color: var(--ui-ink);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.25s, box-shadow 0.25s;
    .is-ph {
      color: var(--ui-ink-3);
      font-weight: 400;
    }
    &:hover {
      border-color: var(--ui-brand);
    }
  }
  &.is-open &__btn {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-open &__chev {
    transform: rotate(180deg);
  }
  &__chev {
    color: var(--ui-brand-ink);
    transition: transform 0.3s;
    flex: none;
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &__panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    // 脱离触发器宽度约束：面板按内容撑开，窄容器下树选项不再换行挤压
    min-width: 100%;
    width: max-content;
    max-width: 360px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 8px;
    z-index: calc(var(--ui-z-pop) - 50);
    box-shadow: var(--ui-shadow-md);
    max-height: 320px;
    overflow-y: auto;
    transform-origin: top left;
  }
}

.aero-tsel-enter-active,
.aero-tsel-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-tsel-enter-from,
.aero-tsel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
