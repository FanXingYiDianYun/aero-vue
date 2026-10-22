<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    /** 刻度行 */
    showScale?: boolean
    /** 两端文案 */
    startLabel?: string
    endLabel?: string
    /** 单位（气泡后缀） */
    unit?: string
  }>(),
  { modelValue: 0, min: 0, max: 100, step: 1, disabled: false, showScale: true, unit: '' },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

const dragging = ref(false)

const fill = computed(() => {
  const p = ((props.modelValue - props.min) / (props.max - props.min)) * 100
  return Math.min(100, Math.max(0, p))
})

const fillStyle = computed<Record<string, string>>(() => ({ '--fill': `${fill.value}%` }))

function onInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', v)
}
function onChange(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  emit('change', v)
}
</script>

<template>
  <div class="aero-slider" :class="{ 'is-disabled': disabled, 'is-drag': dragging }">
    <div class="aero-slider__wrap" :style="fillStyle">
      <output class="aero-slider__bubble">{{ modelValue }}{{ unit }}</output>
      <input
        class="aero-slider__range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :disabled="disabled"
        @input="onInput"
        @change="onChange"
        @focus="(e) => emit('focus', e)"
        @blur="(e) => emit('blur', e)"
        @pointerdown="dragging = true"
        @pointerup="dragging = false"
      />
      <div v-if="showScale" class="aero-slider__scale">
        <i v-for="n in 21" :key="n" />
      </div>
    </div>
    <div v-if="startLabel || endLabel" class="aero-slider__cap">
      <span>{{ startLabel }}</span>
      <span class="aero-slider__val">{{ modelValue }}{{ unit }}</span>
      <span>{{ endLabel }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-slider {
  box-sizing: border-box;
  width: min(360px, 100%);
  padding: 4px 2px;
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__wrap {
    position: relative;
    padding: 30px 4px 4px;
    --fill: 50%;
  }

  &__range {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    height: 26px;
    background: transparent;
    cursor: pointer;
    outline: none;
    margin: 0;
    display: block;

    &::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--ui-brand) var(--fill), var(--ui-line) var(--fill));
    }
    &::-webkit-slider-thumb {
      box-sizing: border-box;
      -webkit-appearance: none;
      width: 24px;
      height: 24px;
      margin-top: -8px;
      border-radius: 9px;
      background: var(--ui-card);
      border: 2.5px solid var(--ui-brand);
      box-shadow: 2px 2px 0 var(--ui-ink);
      transition: transform 0.18s var(--ui-spring);
      cursor: grab;
    }
    &:hover::-webkit-slider-thumb {
      transform: scale(1.12) rotate(-6deg);
    }
    &:active::-webkit-slider-thumb {
      transform: scale(0.94);
      cursor: grabbing;
    }
    &::-moz-range-track {
      height: 8px;
      border-radius: 99px;
      background: var(--ui-line);
    }
    &::-moz-range-progress {
      height: 8px;
      border-radius: 99px;
      background: var(--ui-brand);
    }
    &::-moz-range-thumb {
      box-sizing: border-box;
      width: 19px;
      height: 19px;
      border-radius: 8px;
      background: var(--ui-card);
      border: 2.5px solid var(--ui-brand);
      box-shadow: 2px 2px 0 var(--ui-ink);
      cursor: grab;
    }
    &:focus-visible::-webkit-slider-thumb {
      outline: 3px solid color-mix(in srgb, var(--ui-brand) 40%, transparent);
      outline-offset: 2px;
    }
  }

  &__bubble {
    position: absolute;
    top: 0;
    left: var(--fill);
    transform: translateX(-50%);
    background: var(--ui-ink);
    color: var(--ui-bg);
    font-family: var(--ui-font-mono);
    font-size: 12px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    white-space: nowrap;
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -4px;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: var(--ui-ink);
      border-bottom: 0;
    }
  }
  .aero-slider__wrap:hover &__bubble,
  .is-drag &__bubble {
    opacity: 1;
  }

  &__scale {
    display: flex;
    justify-content: space-between;
    margin-top: 3px;
    padding: 0 8px;
    i {
      width: 2px;
      height: 5px;
      border-radius: 2px;
      background: var(--ui-line-2);
      &:nth-child(5n + 1) {
        height: 9px;
        background: var(--ui-brand);
      }
    }
  }

  &__cap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ui-ink-3);
    font-family: var(--ui-font-mono);
    margin-top: 4px;
    padding: 0 2px;
  }
  &__val {
    font-weight: 700;
    color: var(--ui-brand-ink);
  }
}
</style>
