<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: boolean
    /** 最大长度（显示计数） */
    maxlength?: number
    showCount?: boolean
    rows?: number
  }>(),
  { disabled: false, readonly: false, error: false, showCount: false, rows: 3 },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

const value = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
})
</script>

<template>
  <div class="aero-textarea" :class="{ 'is-disabled': disabled, 'is-error': error }">
    <textarea
      class="aero-textarea__inner"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      @input="value = ($event.target as HTMLTextAreaElement).value"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <span v-if="showCount && maxlength" class="aero-textarea__count">{{ value.length }}/{{ maxlength }}</span>
  </div>
</template>

<style scoped lang="scss">
.aero-textarea {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__inner {
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 11px 14px;
    font-size: 14.5px;
    font-family: inherit;
    color: var(--ui-ink);
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    width: 100%;
    resize: vertical;
    min-height: 96px;
    &::placeholder {
      color: var(--ui-ink-3);
    }
    &:focus {
      border-color: var(--ui-brand);
      box-shadow: var(--ui-focus-ring);
    }
  }
  &.is-error .aero-textarea__inner {
    border-color: var(--ui-err);
    &:focus {
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-err) 22%, transparent);
    }
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }
  &__count {
    position: absolute;
    right: 12px;
    bottom: 10px;
    font-size: 12px;
    font-family: var(--ui-font-mono);
    color: var(--ui-ink-3);
    pointer-events: none;
  }
}
</style>
