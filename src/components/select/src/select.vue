<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useClickOutside } from '../../../composables'
import { useLocale } from '../../../locale'
import type { AeroSelectOption } from './select.types'

// i18n：placeholder 缺省文案走词包（ConfigProvider locale 注入；prop 显式传入仍覆盖）
const { select: selLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options: AeroSelectOption[]
    placeholder?: string
    disabled?: boolean
    /** 空值清除 */
    clearable?: boolean
  }>(),
  { placeholder: undefined, disabled: false, clearable: false },
)

const placeholderText = computed(() => props.placeholder ?? selLabels.value.placeholder)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | undefined): void
  (e: 'change', v: string | number | undefined): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

const root = ref<HTMLElement>()
const visible = ref(false)
const hide = () => (visible.value = false)
const toggle = () => (visible.value = !visible.value)

useClickOutside(
  () => root.value,
  () => hide(),
)

const kbIndex = ref(-1)
const selected = computed(() => props.options.find((o) => o.value === props.modelValue))

function pick(o: AeroSelectOption) {
  if (o.disabled) return
  emit('update:modelValue', o.value)
  emit('change', o.value)
  hide()
}

function clear(e: Event) {
  e.stopPropagation()
  emit('update:modelValue', undefined)
  emit('change', undefined)
  hide()
}

async function onToggle() {
  if (props.disabled) return
  toggle()
  kbIndex.value = -1
  if (visible.value) await nextTick()
}

/** 键盘导航（demo cselect 同源：上下选择+回车确认+Esc关闭） */
function onKeydown(e: KeyboardEvent) {
  if (!visible.value) {
    if (e.key === 'Enter' || e.key === 'ArrowDown') onToggle()
    return
  }
  if (e.key === 'Escape') return hide()
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    let i = kbIndex.value
    do {
      i = (i + dir + props.options.length) % props.options.length
    } while (props.options[i]?.disabled && i !== kbIndex.value)
    kbIndex.value = i
  }
  if (e.key === 'Enter' && kbIndex.value >= 0) {
    const o = props.options[kbIndex.value]
    if (o) pick(o)
  }
}
</script>

<template>
  <div ref="root" class="aero-select" :class="{ 'is-open': visible, 'is-disabled': disabled }" @keydown="onKeydown">
    <button class="aero-select__btn" type="button" :disabled="disabled" @click="onToggle" @focus="(e) => emit('focus', e)" @blur="(e) => emit('blur', e)">
      <span class="aero-select__label" :class="{ 'is-placeholder': !selected }">
        {{ selected?.label ?? placeholderText }}
      </span>
      <span v-if="clearable && selected" class="aero-select__clear" @click="clear">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </span>
      <svg class="aero-select__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <transition name="aero-select">
      <ul v-if="visible" class="aero-select__menu" role="listbox" :aria-label="placeholder">
        <li
          v-for="(o, i) in options"
          :key="o.value"
          class="aero-select__opt"
          role="option"
          :aria-selected="o.value === modelValue"
          :class="{ 'is-sel': o.value === modelValue, 'is-kb': i === kbIndex, 'is-disabled': o.disabled }"
          @click="pick(o)"
          @mousemove="kbIndex = i"
        >
          <span>{{ o.label }}</span>
          <svg v-if="o.value === modelValue" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 12l-5 5" />
          </svg>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-select {
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
    transition: border-color 0.25s, box-shadow 0.25s;
    text-align: left;
    cursor: pointer;
    &:hover {
      border-color: var(--ui-brand);
    }
  }
  .is-open &__btn,
  &.is-open &__btn {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-open &__chev {
    transform: rotate(180deg);
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &__label {
    &.is-placeholder {
      color: var(--ui-ink-3);
      font-weight: 400;
    }
  }
  &__clear {
    display: flex;
    color: var(--ui-ink-3);
    &:hover {
      color: var(--ui-err);
    }
  }
  &__chev {
    color: var(--ui-brand-ink);
    transition: transform 0.3s;
    flex: none;
  }

  &__menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 7px;
    z-index: calc(var(--ui-z-pop) - 100);
    box-shadow: var(--ui-shadow-md);
    max-height: 224px;
    overflow-y: auto;
    margin: 0;
    list-style: none;
    transform-origin: top;
  }
  &__opt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 9.5px 12px;
    border-radius: 9px;
    font-size: 14px;
    cursor: pointer;
    color: var(--ui-ink);
    transition: 0.15s;
    &.is-sel {
      font-weight: 700;
      color: var(--ui-brand-ink);
    }
    &.is-kb,
    &:hover {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
    &.is-disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
}

// 弹入动画（demo .26s spring）
.aero-select-enter-active,
.aero-select-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-select-enter-from,
.aero-select-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
