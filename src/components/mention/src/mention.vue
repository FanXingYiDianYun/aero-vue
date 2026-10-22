<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useLocale } from '../../../locale'

// i18n：placeholder 缺省走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { mention: mentionLabels } = useLocale()

export interface MentionOption {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options: MentionOption[]
    placeholder?: string
    /** 触发符号 */
    trigger?: string
  }>(),
  { placeholder: undefined, trigger: '@' },
)

const placeholderText = computed(() => props.placeholder ?? mentionLabels.value.placeholder)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', o: MentionOption): void
}>()

const ta = ref<HTMLTextAreaElement>()
const caret = ref(0)
const showPanel = ref(false)
const keyword = ref('')
const panelPos = ref({ left: '0px', top: '0px' })
const kb = ref(-1)

const filtered = computed(() =>
  props.options.filter((o) => o.label.toLowerCase().includes(keyword.value.toLowerCase())),
)

function sync(e: Event) {
  const el = e.target as HTMLTextAreaElement
  emit('update:modelValue', el.value)
  caret.value = el.selectionStart ?? 0
  detectTrigger(el)
}

function detectTrigger(el: HTMLTextAreaElement) {
  const before = (props.modelValue ?? el.value).slice(0, caret.value)
  const m = new RegExp(`${escape(props.trigger)}([^\\s${escape(props.trigger)}]*)$`).exec(before)
  if (m) {
    keyword.value = m[1]
    showPanel.value = true
    kb.value = -1
    // 光标坐标（简化：以行近似）
    const lines = before.split('\n')
    const last = lines[lines.length - 1]
    panelPos.value = {
      left: Math.min(12 + last.length * 8, 360) + 'px',
      top: (lines.length - 1) * 24 + 30 + 'px',
    }
  } else {
    showPanel.value = false
  }
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function pick(o: MentionOption) {
  const el = ta.value
  if (!el) return
  const val = el.value
  const before = val.slice(0, caret.value)
  const after = val.slice(caret.value)
  const m = new RegExp(`${escape(props.trigger)}[^\\s${escape(props.trigger)}]*$`).exec(before)
  const inject = `${props.trigger}${o.value} `
  const nextVal = m ? before.replace(m[0], inject) + after : val
  emit('update:modelValue', nextVal)
  emit('select', o)
  showPanel.value = false
  await nextTick()
  const pos = (m ? before.replace(m[0], inject).length : val.length)
  el.focus()
  el.setSelectionRange(pos, pos)
}

function onKey(e: KeyboardEvent) {
  if (!showPanel.value || !filtered.value.length) return
  if (e.key === 'Escape') return (showPanel.value = false)
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    kb.value = (kb.value + dir + filtered.value.length) % filtered.value.length
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    const o = filtered.value[kb.value >= 0 ? kb.value : 0]
    if (o) pick(o)
  }
}
</script>

<template>
  <div class="aero-mention">
    <textarea
      ref="ta"
      class="aero-mention__ta"
      :value="modelValue"
      :placeholder="placeholderText"
      rows="3"
      @input="sync"
      @keyup="caret = ($event.target as HTMLTextAreaElement).selectionStart ?? 0"
      @click="caret = ($event.target as HTMLTextAreaElement).selectionStart ?? 0"
      @keydown="onKey"
    />
    <transition name="aero-mention">
      <ul v-if="showPanel && filtered.length" class="aero-mention__panel" :style="panelPos">
        <li
          v-for="(o, i) in filtered"
          :key="o.value"
          :class="{ 'is-kb': i === kb }"
          @mousedown.prevent="pick(o)"
          @mousemove="kb = i"
        >{{ o.label }}</li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-mention {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__ta {
    width: 100%;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 11px 14px;
    font-size: 14.5px;
    font-family: inherit;
    color: var(--ui-ink);
    outline: none;
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.25s, box-shadow 0.25s;
    &::placeholder {
      color: var(--ui-ink-3);
    }
    &:focus {
      border-color: var(--ui-brand);
      box-shadow: var(--ui-focus-ring);
    }
  }

  &__panel {
    position: absolute;
    z-index: calc(var(--ui-z-pop) - 40);
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 12px;
    padding: 6px;
    margin: 0;
    list-style: none;
    box-shadow: var(--ui-shadow-md);
    min-width: 170px;
    max-height: 180px;
    overflow-y: auto;
    li {
      padding: 8px 11px;
      border-radius: 8px;
      font-size: 13.5px;
      color: var(--ui-ink);
      cursor: pointer;
      transition: 0.15s;
      &.is-kb,
      &:hover {
        background: var(--ui-bg-tint);
        color: var(--ui-brand-ink);
      }
    }
  }
}

.aero-mention-enter-active,
.aero-mention-leave-active {
  transition: opacity 0.22s var(--ui-spring), transform 0.22s var(--ui-spring);
}
.aero-mention-enter-from,
.aero-mention-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}
</style>
