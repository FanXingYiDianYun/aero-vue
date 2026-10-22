<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useClickOutside } from '../../../composables'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'
import type { CascaderOption } from './cascader.types'

// 占位文案 + 「全部」面包屑走词包（cascader 组；显式 placeholder prop 仍覆盖）
const { cascader } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 已选中的逐级 value 路径（v-model，如 ['province', 'city', 'district']） */
    modelValue?: string[]
    /** 级联选项树 */
    options: CascaderOption[]
    /** 未选中时的占位文案（缺省走词包 cascader.placeholder） */
    placeholder?: string
    /** 是否禁用（默认：false） */
    disabled?: boolean
  }>(),
  { placeholder: undefined, disabled: false },
)

const placeholderText = computed(() => props.placeholder ?? cascader.value.placeholder)

const emit = defineEmits<{
  /** 选中完整路径时同步 v-model */
  (e: 'update:modelValue', v: string[]): void
  /** 选中完整路径时触发（附带各级 label） */
  (e: 'change', v: string[], labels: string[]): void
}>()

const root = ref<HTMLElement>()
const open = ref(false)
useClickOutside(
  () => root.value,
  () => (open.value = false),
)

const breadcrumb = ref<string[]>([]) // 逐级已选 value

const panel = computed(() => {
  let list = props.options
  for (const v of breadcrumb.value) {
    const hit = list.find((o) => o.value === v)
    list = hit?.children ?? []
  }
  return list
})

function findLabels(path: string[]): string[] {
  const labels: string[] = []
  let list = props.options
  for (const v of path) {
    const hit = list.find((o) => o.value === v)
    if (!hit) break
    labels.push(hit.label)
    list = hit.children ?? []
  }
  return labels
}

const selectedLabels = computed(() => (props.modelValue?.length ? findLabels(props.modelValue).join(' / ') : ''))

function pickLevel(o: CascaderOption, level: number) {
  breadcrumb.value = [...breadcrumb.value.slice(0, level), o.value]
  if (!o.children?.length) {
    const path = [...breadcrumb.value]
    emit('update:modelValue', path)
    emit('change', path, findLabels(path))
    open.value = false
    breadcrumb.value = path.slice(0, -1) // 保留上级便于下次
  }
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) breadcrumb.value = props.modelValue?.slice(0, -1) ?? []
}

const labelsOf = (o: CascaderOption) => o.label
</script>

<template>
  <div ref="root" class="aero-cascader" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button class="aero-cascader__btn" type="button" @click="toggle">
      <span :class="{ 'is-ph': !selectedLabels }">{{ selectedLabels || placeholderText }}</span>
      <svg class="aero-cascader__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['chevron-down']" :key="i" :d="d" />
      </svg>
    </button>
    <transition name="aero-cascader">
      <div v-if="open" class="aero-cascader__panels">
        <ul v-if="breadcrumb.length" class="aero-cascader__crumb">
          <li><button type="button" @click="breadcrumb = []">{{ cascader.all }}</button></li>
          <li v-for="(v, i) in breadcrumb" :key="v">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6" /></svg>
            <button type="button" @click="breadcrumb = breadcrumb.slice(0, i + 1)">{{ findLabels(breadcrumb.slice(0, i + 1)).pop() }}</button>
          </li>
        </ul>
        <ul class="aero-cascader__menu">
          <li
            v-for="o in panel"
            :key="o.value"
            :class="{ 'is-sel': modelValue?.[breadcrumb.length] === o.value && !o.children }"
            @click="pickLevel(o, breadcrumb.length)"
          >
            <span>{{ labelsOf(o) }}</span>
            <svg v-if="o.children" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths['chevron-right']" :key="i" :d="d" />
            </svg>
            <svg v-else-if="modelValue?.includes(o.value)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths['check']" :key="i" :d="d" />
            </svg>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-cascader {
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

  &__panels {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    /* 去掉 right:0 使浮窗宽度随内容自适应；min-width 保底与触发钮一致 */
    min-width: 100%;
    max-width: 420px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 8px;
    z-index: calc(var(--ui-z-pop) - 80);
    box-shadow: var(--ui-shadow-md);
    transform-origin: top left;
    /* 层级切换时宽度变化（min-width 100% → 内容宽度）加过渡，避免突变 */
    transition: min-width 0.28s var(--ui-spring);
  }
  &__crumb {
    display: flex;
    align-items: center;
    gap: 6px;
    list-style: none;
    margin: 0 0 7px;
    padding: 0 4px;
    font-size: 12.5px;
    white-space: nowrap;
    overflow-x: auto;
    button {
      border: 0;
      background: none;
      color: var(--ui-brand-ink);
      font-weight: 700;
      font-size: 12.5px;
      cursor: pointer;
      padding: 2px 4px;
      font-family: inherit;
      white-space: nowrap;
      &:hover {
        text-decoration: underline;
      }
    }
    svg {
      color: var(--ui-ink-3);
    }
  }
  &__menu {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 210px;
    overflow-y: auto;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 11px;
      border-radius: 9px;
      font-size: 13.5px;
      color: var(--ui-ink);
      cursor: pointer;
      transition: 0.15s;
      svg {
        color: var(--ui-brand-ink);
      }
      &:hover {
        background: var(--ui-bg-tint);
        color: var(--ui-brand-ink);
      }
      &.is-sel {
        font-weight: 700;
        color: var(--ui-brand-ink);
      }
    }
  }
}

.aero-cascader-enter-active,
.aero-cascader-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-cascader-enter-from,
.aero-cascader-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
