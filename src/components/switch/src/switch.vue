<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 是否禁用切换（默认：false） */
    disabled?: boolean
  }>(),
  { disabled: false },
)

const checked = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 开关状态变化时触发，携带新的 boolean 值 */
  (e: 'change', v: boolean): void
  /** 内部 input 聚焦时触发 */
  (e: 'focus', ev: FocusEvent): void
  /** 内部 input 失焦时触发 */
  (e: 'blur', ev: FocusEvent): void
}>()

function toggle() {
  checked.value = !checked.value
  emit('change', checked.value)
}
</script>

<template>
  <label class="aero-switch" :class="{ 'is-disabled': disabled }">
    <input
      class="aero-switch__input"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="toggle"
      @focus="(e) => emit('focus', e)"
      @blur="(e) => emit('blur', e)"
    />
    <span class="aero-switch__track"><i class="aero-switch__knob" /></span>
    <span v-if="$slots.default" class="aero-switch__label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
.aero-switch {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  cursor: pointer;
  align-items: center;
  gap: 10px;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__input {
    position: absolute;
    opacity: 0;
    inset: 0;
    cursor: pointer;
  }
  &__track {
    box-sizing: border-box;
    width: 48px;
    height: 27px;
    border-radius: var(--ui-radius-pill);
    background: var(--ui-line-2);
    border: 2px solid var(--ui-line-2);
    position: relative;
    transition: 0.3s;
    flex: none;
  }
  &__knob {
    position: absolute;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: var(--ui-on-ink);
    top: 2.5px;
    left: 3px;
    transition: 0.35s var(--ui-spring);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }
  &__input:checked + .aero-switch__track {
    background: var(--ui-brand);
    border-color: var(--ui-brand);
    .aero-switch__knob {
      left: 23px;
    }
  }
  &__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--ui-ink);
  }
}
</style>
