<script setup lang="ts">
import { computed, ref, TransitionGroup } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：placeholder 缺省与移除标签 aria 走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { inputTag: tagLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    placeholder?: string
    /** 最多标签数 */
    max?: number
    disabled?: boolean
  }>(),
  { placeholder: undefined, disabled: false },
)

const placeholderText = computed(() => props.placeholder ?? tagLabels.value.placeholder)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
  (e: 'change', v: string[]): void
}>()

const input = ref('')
const inputRef = ref<HTMLInputElement>()

function commit() {
  const v = input.value.trim().replace(/[,，]$/, '')
  if (!v || props.disabled) return
  if (props.max && props.modelValue.length >= props.max) return
  if (props.modelValue.includes(v)) {
    input.value = ''
    return
  }
  const arr = [...props.modelValue, v]
  emit('update:modelValue', arr)
  emit('change', arr)
  input.value = ''
}

function remove(i: number) {
  if (props.disabled) return
  const arr = props.modelValue.filter((_, k) => k !== i)
  emit('update:modelValue', arr)
  emit('change', arr)
}

function backspaceEmpty() {
  if (!input.value && props.modelValue.length && !props.disabled) {
    remove(props.modelValue.length - 1)
  }
}
</script>

<template>
  <div
    class="aero-input-tag"
    :class="{ 'is-disabled': disabled }"
    @mousedown.prevent="inputRef?.focus()"
  >
    <TransitionGroup tag="span" class="aero-input-tag__chips" name="itag-flip">
      <span v-for="(t, i) in modelValue" :key="t" class="aero-input-tag__chip">
        {{ t }}
        <button class="aero-input-tag__x" type="button" :disabled="disabled" @click="remove(i)" :aria-label="tagLabels.removeAria(t)">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <path v-for="(d, k) in iconPaths['x']" :key="k" :d="d" />
          </svg>
        </button>
      </span>
    </TransitionGroup>
    <input
      ref="inputRef"
      v-model="input"
      class="aero-input-tag__inner"
      :placeholder="modelValue.length ? '' : placeholderText"
      :disabled="disabled"
      @keydown.enter.prevent="commit"
      @keydown.,.prevent="commit"
      @keydown.delete="backspaceEmpty"
      @blur="commit"
    />
  </div>
</template>

<style scoped lang="scss">
.aero-input-tag {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  position: relative; /* 删除淡出（leave absolute）的定位基准 */
  border: 2px solid var(--ui-line-2);
  border-radius: var(--ui-radius-md);
  background: var(--ui-card);
  padding: 7px 10px;
  min-height: 44px;
  width: 100%;
  transition: border-color 0.25s, box-shadow 0.25s;
  cursor: text;

  &:focus-within {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 6px 3px 12px;
    background: var(--ui-bg-soft);
    border: 2px solid var(--ui-line);
    border-radius: var(--ui-radius-pill);
    font-size: 13px;
    font-weight: 600;
    color: var(--ui-ink);
  }

  // FLIP 补位——TransitionGroup(itag-flip) move 类平移，时长/缓动读 MotionPresets
  // token（--ui-dur-mid/--ui-spring）；新增弹入沿用 ui-pop-in，删除淡出
  &__chips {
    display: contents;
  }
  .itag-flip-move {
    transition: transform var(--ui-dur-mid) var(--ui-spring);
  }
  .itag-flip-enter-active {
    transition: opacity var(--ui-dur-mid) var(--ui-ease);
  }
  .itag-flip-enter-from {
    opacity: 0;
    animation: ui-pop-in 0.3s var(--ui-spring);
  }
  .itag-flip-leave-active {
    transition: opacity var(--ui-dur-fast) var(--ui-ease);
    position: absolute;
  }
  .itag-flip-leave-to {
    opacity: 0;
  }
  &__x {
    display: flex;
    border: 0;
    background: var(--ui-line);
    color: var(--ui-ink-2);
    border-radius: 50%;
    width: 17px;
    height: 17px;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    cursor: pointer;
    padding: 0;
    &:hover {
      background: var(--ui-err);
      color: var(--ui-on-ink);
      transform: rotate(90deg);
    }
  }
  &__inner {
    flex: 1;
    min-width: 80px;
    border: 0;
    background: none;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    color: var(--ui-ink);
    padding: 4px 2px;
    &::placeholder {
      color: var(--ui-ink-3);
    }
  }
}
</style>
