<script setup lang="ts">
import { useRipple } from '../../../composables'
import type { AeroButtonProps } from './button.types'

const props = withDefaults(defineProps<AeroButtonProps>(), {
  type: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  iconOnly: false,
  ripple: true,
  nativeType: 'button',
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

defineSlots<{
  default?: () => any
  /** 左侧图标 */
  icon?: () => any
}>()

const { attach } = useRipple()

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  if (props.ripple) attach(e)
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
    class="aero-btn"
    :class="[
      `aero-btn--${props.type}`,
      `aero-btn--${props.size}`,
      {
        'is-block': props.block,
        'is-icon-only': props.iconOnly,
        'is-disabled': props.disabled,
        'is-loading': props.loading,
      },
    ]"
    :type="props.nativeType"
    :disabled="props.disabled || props.loading"
    @click="onClick"
    @focus="onBtnFocus"
    @blur="onBtnBlur"
  >
    <span v-if="$slots.icon" class="aero-btn__icon"><slot name="icon" /></span>
    <span v-if="!props.iconOnly" class="aero-btn__label"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.aero-btn {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
  padding: 12px 24px;
  border-radius: 14px;
  border: 2px solid transparent;
  font-family: inherit;
  cursor: pointer;
  line-height: 1.3;
  transition: transform var(--ui-dur-fast) var(--ui-spring), box-shadow var(--ui-dur-fast),
    background var(--ui-dur-fast), color var(--ui-dur-fast), border-color var(--ui-dur-fast);

  &__icon,
  &__icon :deep(svg) {
    width: 17px;
    height: 17px;
    display: flex;
  }

  // —— 类型变体（demo .btn.primary 等 1:1）——
  &--primary {
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    border-color: var(--ui-ink);
    &:not(.is-disabled):hover {
      transform: translate(-2px, -2px) rotate(-0.6deg);
      box-shadow: var(--ui-shadow-sm);
    }
    &:not(.is-disabled):active {
      transform: scale(0.95);
      box-shadow: 1px 1px 0 var(--ui-ink);
    }
  }
  &--outline {
    background: var(--ui-card);
    color: var(--ui-ink);
    border-color: var(--ui-ink);
    &:not(.is-disabled):hover {
      transform: translate(-2px, -2px) rotate(0.6deg);
      box-shadow: var(--ui-shadow-sm-brand);
      border-color: var(--ui-brand-ink);
      color: var(--ui-brand-ink);
    }
    &:not(.is-disabled):active {
      transform: scale(0.95);
    }
    .aero-ripple {
      background: color-mix(in srgb, var(--ui-brand) 22%, transparent);
    }
  }
  &--ghost {
    background: transparent;
    color: var(--ui-ink-2);
    border-color: transparent;
    &:not(.is-disabled):hover {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
    .aero-ripple {
      background: color-mix(in srgb, var(--ui-brand) 22%, transparent);
    }
  }
  &--danger {
    background: var(--ui-err);
    color: #fff;
    border-color: var(--ui-err-deep);
    &:not(.is-disabled):hover {
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 var(--ui-err-deep);
    }
    &:not(.is-disabled):active {
      transform: scale(0.95);
    }
  }
  &--dark {
    background: var(--ui-ink);
    color: var(--ui-bg);
    border-color: var(--ui-brand);
    &:not(.is-disabled):hover {
      transform: translate(-2px, -2px) rotate(-0.6deg);
      box-shadow: var(--ui-shadow-sm-brand);
    }
    &:not(.is-disabled):active {
      transform: scale(0.95);
    }
  }

  // —— 尺寸 ——
  &--sm {
    padding: 7px 15px;
    font-size: 13.5px;
    border-radius: 11px;
  }
  &--lg {
    padding: 16px 32px;
    font-size: 17px;
    border-radius: 16px;
  }

  // —— 状态 ——
  &.is-block {
    width: 100%;
  }
  &.is-icon-only {
    width: 42px;
    height: 42px;
    padding: 0;
    border-radius: 13px;
  }
  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }
  &.is-loading {
    pointer-events: none;
    color: transparent !important;
    & .aero-btn__icon,
    & .aero-btn__label {
      opacity: 0;
    }
    &::after {
      box-sizing: border-box;
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2.5px solid color-mix(in srgb, var(--ui-on-brand) 25%, transparent);
      border-top-color: var(--ui-on-brand);
      animation: ui-spin 0.7s linear infinite;
    }
  }
}
</style>
