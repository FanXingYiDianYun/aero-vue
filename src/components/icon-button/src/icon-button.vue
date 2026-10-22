<script setup lang="ts">
import { ref } from 'vue'
import { iconPaths, type AeroIconName } from '../../icon/src/paths'

const props = withDefaults(
  defineProps<{
    /** 图标名 */
    icon: AeroIconName
    /** 禁用 */
    disabled?: boolean
    /** 加载中（禁用点击 + 旋转动画；与 AeroButton 对齐） */
    loading?: boolean
    /** 通知红点（呼吸光圈，GPU 门控：仅开启时创建动画层） */
    dot?: boolean
    /** aria-label 无障碍标签 */
    label?: string
  }>(),
  { disabled: false, loading: false, dot: false },
)

/** 正式 API——click / focus / blur 全量 emits，与 AeroButton 对齐 */
const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', e)
}

function onBtnFocus(e: FocusEvent) {
  if (!props.disabled) emit('focus', e)
}

function onBtnBlur(e: FocusEvent) {
  if (!props.disabled) emit('blur', e)
}
</script>

<template>
  <button
    class="aero-icon-btn"
    :class="{ 'is-disabled': disabled, 'is-loading': loading }"
    :aria-label="label ?? icon"
    :disabled="disabled || loading"
    @click="onClick"
    @focus="onBtnFocus"
    @blur="onBtnBlur"
  >
    <svg
      :width="17"
      :height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="{ 'is-spinning': loading }"
    >
      <path v-for="(d, i) in iconPaths[props.icon] ?? []" :key="i" :d="d" />
    </svg>
    <i v-if="dot" class="aero-icon-btn__dot" />
  </button>
</template>

<style scoped lang="scss">
.aero-icon-btn {
  box-sizing: border-box;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 2px solid var(--ui-line);
  background: var(--ui-card);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-ink-2);
  transition: 0.25s;
  position: relative;
  cursor: pointer;

  &:not(.is-disabled):hover {
    border-color: var(--ui-brand);
    color: var(--ui-brand-ink);
    transform: translateY(-2px) rotate(-6deg);
  }
  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  &.is-loading {
    pointer-events: none;
    opacity: 0.85;
    svg { animation: ui-spin 0.7s linear infinite; }
  }

  &__dot {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ui-err);
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: var(--ui-err);
      animation: ui-pulse 2s infinite;
    }
  }
}
</style>
