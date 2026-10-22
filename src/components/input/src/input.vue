<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../../../locale'

// i18n：清空钮 aria 走词包（ConfigProvider locale 注入）
const { input: inputLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    /** 错误态（红边） */
    error?: boolean
    /** 前缀文字（等宽字体，demo input-prefix） */
    prefix?: string
    /** 后缀文字 */
    suffix?: string
    /** 输入类型 */
    type?: string
    /** 清除按钮 */
    clearable?: boolean
    maxlength?: number
    /** 输入框宽度（px 或 CSS 值，默认 auto = 撑满父容器） */
    width?: number | string
  }>(),
  { type: 'text', disabled: false, readonly: false, error: false, clearable: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'input', ev: Event): void
  (e: 'change', ev: Event): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'clear'): void
}>()

const value = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
})

function onInput(e: Event) {
  value.value = (e.target as HTMLInputElement).value
  emit('input', e)
}
function clear() {
  value.value = ''
  emit('clear')
}
</script>

<template>
  <div
    class="aero-input"
    :class="{ 'is-disabled': disabled, 'is-error': error, 'has-prefix': !!prefix, 'has-suffix': !!suffix }"
    :style="width ? { width: typeof width === 'number' ? width + 'px' : width } : undefined"
  >
    <span v-if="prefix" class="aero-input__prefix">{{ prefix }}</span>
    <input
      class="aero-input__inner"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="onInput"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <button v-if="suffix" class="aero-input__suffix" type="button" tabindex="-1">{{ suffix }}</button>
    <button v-if="clearable && value && !disabled" class="aero-input__clear" type="button" @click="clear" :aria-label="inputLabels.clearAria">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.aero-input {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 2px solid var(--ui-line-2);
  border-radius: var(--ui-radius-md);
  background: var(--ui-card);
  transition: border-color 0.25s, box-shadow 0.25s;
  width: 100%;
  position: relative;

  &:focus-within {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-error {
    border-color: var(--ui-err);
    &:focus-within {
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-err) 22%, transparent);
    }
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &__inner {
    flex: 1;
    border: 0;
    background: none;
    outline: none;
    padding: 11px 14px;
    width: 100%;
    color: var(--ui-ink);
    font-family: inherit;
    font-size: 14.5px;
    &::placeholder {
      color: var(--ui-ink-3);
    }
  }
  &__prefix {
    padding: 0 0 0 14px;
    color: var(--ui-ink-3);
    font-family: var(--ui-font-mono);
    font-size: 13.5px;
  }
  &__suffix,
  &__clear {
    border: 0;
    background: none;
    color: var(--ui-ink-3);
    font-family: var(--ui-font-mono);
    font-size: 13.5px;
    padding-right: 14px;
    cursor: default;
    display: flex;
  }
  &__clear {
    cursor: pointer;
    margin-right: 6px;
    padding-right: 6px;
    color: var(--ui-ink-3);
    transition: color 0.2s;
    &:hover {
      color: var(--ui-err);
    }
  }
}
</style>
