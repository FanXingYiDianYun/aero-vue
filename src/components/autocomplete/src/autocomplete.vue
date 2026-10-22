<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useClickOutside } from '../../../composables'
import { useLocale } from '../../../locale'

// 占位文案缺省走词包（autocomplete 组；显式 placeholder prop 仍覆盖）
const { autocomplete } = useLocale()

export interface AutoSuggestion {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    /** 输入框当前值（v-model） */
    modelValue?: string
    /** 候选建议列表 */
    suggestions: AutoSuggestion[]
    /** 输入框占位文案（缺省走词包 autocomplete.placeholder） */
    placeholder?: string
    /** 是否禁用输入（默认：false） */
    disabled?: boolean
  }>(),
  { placeholder: undefined, disabled: false },
)

const placeholderText = computed(() => props.placeholder ?? autocomplete.value.placeholder)

const emit = defineEmits<{
  /** 输入值变化时触发 */
  (e: 'update:modelValue', v: string): void
  /** 选中候选项时触发 */
  (e: 'select', s: AutoSuggestion): void
}>()

const root = ref<HTMLElement>()
const open = ref(false)
const kb = ref(-1)
useClickOutside(
  () => root.value,
  () => (open.value = false),
)

const filtered = computed(() => {
  const q = (props.modelValue ?? '').trim().toLowerCase()
  if (!q) return props.suggestions.slice(0, 8)
  return props.suggestions.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 8)
})

watch(filtered, (f) => {
  open.value = f.length > 0 && document.activeElement === root.value?.querySelector('input')
  kb.value = -1
})

function pick(s: AutoSuggestion) {
  emit('update:modelValue', s.label)
  emit('select', s)
  open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') return (open.value = false)
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    kb.value = (kb.value + dir + filtered.value.length) % filtered.value.length
  }
  if (e.key === 'Enter' && kb.value >= 0) {
    const s = filtered.value[kb.value]
    if (s) pick(s)
  }
}

function hl(label: string) {
  const q = (props.modelValue ?? '').trim()
  if (!q) return label
  const i = label.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return label
  return `${label.slice(0, i)}[H]${label.slice(i, i + q.length)}[/H]${label.slice(i + q.length)}`
}

function renderParts(label: string) {
  return hl(label).split(/(\[H\].*?\[\/H\])/).map((p) => {
    const m = /^\[H\](.*?)\[\/H\]$/.exec(p)
    return m ? { text: m[1], hit: true } : { text: p, hit: false }
  })
}
</script>

<template>
  <div ref="root" class="aero-ac" @keydown="onKeydown">
    <input
      class="aero-ac__input"
      :value="modelValue"
      :placeholder="placeholderText"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="open = filtered.length > 0"
    />
    <transition name="aero-ac-drop">
      <ul v-if="open && filtered.length" class="aero-ac__menu">
        <li
          v-for="(s, i) in filtered"
          :key="s.value"
          class="aero-ac__opt"
          :class="{ 'is-kb': i === kb }"
          @click="pick(s)"
          @mousemove="kb = i"
        >
          <template v-for="(part, k) in renderParts(s.label)" :key="k">
            <b v-if="part.hit" class="aero-ac__hit">{{ part.text }}</b>
            <template v-else>{{ part.text }}</template>
          </template>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-ac {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__input {
    width: 100%;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 11px 14px;
    font-size: 14.5px;
    font-family: inherit;
    color: var(--ui-ink);
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    &:focus {
      border-color: var(--ui-brand);
      box-shadow: var(--ui-focus-ring);
    }
    &::placeholder {
      color: var(--ui-ink-3);
    }
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
    z-index: calc(var(--ui-z-pop) - 90);
    box-shadow: var(--ui-shadow-md);
    list-style: none;
    margin: 0;
    max-height: 220px;
    overflow-y: auto;
  }
  &__opt {
    padding: 9.5px 12px;
    border-radius: 9px;
    font-size: 14px;
    cursor: pointer;
    color: var(--ui-ink);
    transition: 0.15s;
    &.is-kb,
    &:hover {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
  }
  &__hit {
    color: var(--ui-brand);
    font-weight: 700;
  }
}

.aero-ac-drop-enter-active,
.aero-ac-drop-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-ac-drop-enter-from,
.aero-ac-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
