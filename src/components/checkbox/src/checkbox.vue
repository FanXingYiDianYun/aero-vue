<script setup lang="ts">
import { computed, inject } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    /** 组内取值（配合 AeroCheckboxGroup） */
    value?: string | number
  }>(),
  { disabled: false },
)

const checked = defineModel<boolean | string[] | number[]>({ default: false })

const emit = defineEmits<{ (e: 'change', v: boolean): void; (e: 'focus', ev: FocusEvent): void; (e: 'blur', ev: FocusEvent): void }>()

interface GroupCtx {
  values: { value: (string | number)[] }
  disabled: { value: boolean }
  toggle: (v: string | number) => void
}
const group = inject<GroupCtx | null>('AeroCheckboxGroup', null)

const inGroup = computed(() => !!group && props.value !== undefined)
const isChecked = computed(() =>
  inGroup.value ? group!.values.value.includes(props.value!) : !!checked.value,
)
const isDisabled = computed(() => props.disabled || group?.disabled.value)

function toggle() {
  if (isDisabled.value) return
  if (inGroup.value) {
    group!.toggle(props.value!)
  } else {
    checked.value = !checked.value
    emit('change', !!checked.value)
  }
}
</script>

<template>
  <label class="aero-check" :class="{ 'is-disabled': isDisabled }">
    <input type="checkbox" class="aero-check__input" :checked="isChecked" :disabled="isDisabled" @change="toggle"
      @focus="(e) => emit('focus', e)"
      @blur="(e) => emit('blur', e)" />
    <span class="aero-check__box"><i class="aero-check__mark" /></span>
    <span class="aero-check__label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
.aero-check {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-size: 14px;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__input {
    position: absolute;
    opacity: 0;
  }
  &__box {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border-radius: 7px;
    border: 2px solid var(--ui-line-2);
    background: var(--ui-card);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    flex: none;
  }
  &__mark {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: var(--ui-on-brand);
    transform: scale(0);
    transition: 0.25s var(--ui-spring);
  }
  &__input:checked + .aero-check__box {
    background: var(--ui-brand);
    border-color: var(--ui-brand);
    .aero-check__mark {
      transform: scale(1);
    }
  }
  &__label {
    color: var(--ui-ink);
  }
}
</style>
