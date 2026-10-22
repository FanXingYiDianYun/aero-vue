<script setup lang="ts">
import { computed, ref } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：步进钮 aria 走词包（ConfigProvider locale 注入）
const { inputNumber: numLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    /** 仅允许 step 的整数倍 */
    stepStrictly?: boolean
    disabled?: boolean
    placeholder?: string
  }>(),
  { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, step: 1, disabled: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const inner = ref<HTMLInputElement>()
const pop = ref(false)

function clamp(v: number) {
  return Math.min(props.max, Math.max(props.min, v))
}

function commit(v: number) {
  const c = clamp(v)
  pop.value = true
  setTimeout(() => (pop.value = false), 400)
  emit('update:modelValue', c)
  emit('change', c)
}

function stepBy(dir: 1 | -1) {
  if (props.disabled) return
  const base = props.modelValue ?? props.min
  let v = base + dir * props.step
  if (props.stepStrictly) v = Math.round(v / props.step) * props.step
  if (v > props.max) v = props.min // 循环回绕（demo knob 同感）
  commit(v)
}

function onBlur() {
  const raw = inner.value?.valueAsNumber
  if (Number.isNaN(raw)) {
    inner.value!.value = String(props.modelValue ?? '')
    return
  }
  let v = clamp(raw as number)
  if (props.stepStrictly && props.step) v = Math.round(v / props.step) * props.step
  if (v !== props.modelValue) commit(v)
}

const minusDisabled = computed(() => !props.disabled && props.modelValue !== undefined && props.modelValue <= props.min)
const plusDisabled = computed(() => !props.disabled && props.modelValue !== undefined && props.modelValue >= props.max)
</script>

<template>
  <div class="aero-num" :class="{ 'is-disabled': disabled }">
    <button class="aero-num__btn" type="button" :disabled="minusDisabled || disabled" :aria-label="numLabels.minusAria" @click="stepBy(-1)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path v-for="(d, i) in iconPaths['minus']" :key="i" :d="d" />
      </svg>
    </button>
    <input
      ref="inner"
      class="aero-num__input"
      :class="{ 'is-pop': pop }"
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :placeholder="placeholder"
      @blur="onBlur"
      @keydown.up.prevent="stepBy(1)"
      @keydown.down.prevent="stepBy(-1)"
    />
    <button class="aero-num__btn" type="button" :disabled="plusDisabled || disabled" :aria-label="numLabels.plusAria" @click="stepBy(1)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path v-for="(d, i) in iconPaths['plus']" :key="i" :d="d" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.aero-num {
  box-sizing: border-box;
  display: inline-flex;
  align-items: stretch;
  border: 2px solid var(--ui-line-2);
  border-radius: var(--ui-radius-md);
  background: var(--ui-card);
  transition: border-color 0.25s, box-shadow 0.25s;
  overflow: hidden;

  &:focus-within {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__btn {
    width: 32px;
    border: 0;
    background: var(--ui-bg-soft);
    color: var(--ui-ink-2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    font-family: inherit;
    &:hover:not(:disabled) {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }

  &__input {
    width: 84px;
    border: 0;
    background: none;
    outline: none;
    text-align: center;
    font-size: 14.5px;
    font-family: var(--ui-font-mono);
    font-weight: 600;
    color: var(--ui-ink);
    padding: 9px 4px;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &::placeholder {
      color: var(--ui-ink-3);
      font-weight: 400;
    }
    &.is-pop {
      animation: ui-pop-in 0.4s var(--ui-spring);
    }
  }
}
</style>
