<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClickOutside } from '../../../composables'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：placeholder 缺省与「现在」按钮走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { timePicker: timeLabels, common: commonLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 'HH:mm' */
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    /** 分钟步进 */
    minuteStep?: number
  }>(),
  { placeholder: undefined, disabled: false, minuteStep: 5 },
)

const placeholderText = computed(() => props.placeholder ?? timeLabels.value.placeholder)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}>()

const root = ref<HTMLElement>()
const open = ref(false)
useClickOutside(
  () => root.value,
  () => (open.value = false),
)

const hh = computed(() => props.modelValue?.split(':')[0] ?? '')
const mm = computed(() => props.modelValue?.split(':')[1] ?? '')

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = computed(() =>
  Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, i) => String(i * props.minuteStep).padStart(2, '0')),
)

function pick(h: string, m: string) {
  const v = `${h}:${m}`
  emit('update:modelValue', v)
  emit('change', v)
  open.value = false
}

/** 快捷键：回到此刻 */
function pickNow() {
  const now = new Date()
  pick(String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'))
}

function toggle() {
  if (!props.disabled) open.value = !open.value
}
</script>

<template>
  <div ref="root" class="aero-time" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button class="aero-time__btn" type="button" @click="toggle">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['clock']" :key="i" :d="d" />
      </svg>
      <span :class="{ 'is-ph': !modelValue }">{{ modelValue || placeholderText }}</span>
    </button>
    <transition name="aero-time">
      <div v-if="open" class="aero-time__panel">
        <div class="aero-time__cols">
          <div class="aero-time__col">
            <button
              v-for="h in hours"
              :key="h"
              :class="{ 'is-sel': h === hh }"
              type="button"
              @click="pick(h, mm || '00')"
            >{{ h }}</button>
          </div>
          <div class="aero-time__col">
            <button
              v-for="m in minutes"
              :key="m"
              :class="{ 'is-sel': m === mm }"
              type="button"
              @click="pick(hh || '00', m)"
            >{{ m }}</button>
          </div>
        </div>
        <footer class="aero-time__foot">
          <button class="aero-time__now" type="button" @click="pickNow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths['clock']" :key="i" :d="d" />
            </svg>
            {{ commonLabels.now }}
          </button>
        </footer>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-time {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 11px 14px;
    font-size: 14.5px;
    font-family: var(--ui-font-mono);
    font-weight: 600;
    color: var(--ui-ink);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.25s, box-shadow 0.25s;
    .is-ph {
      color: var(--ui-ink-3);
      font-weight: 400;
      font-family: inherit;
    }
    svg {
      color: var(--ui-ink-3);
      flex: none;
    }
    &:hover {
      border-color: var(--ui-brand);
    }
  }
  &.is-open &__btn {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &__panel {
    box-sizing: border-box;
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: calc(var(--ui-z-pop) - 60);
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    box-shadow: var(--ui-shadow-md);
    display: flex;
    flex-direction: column;
    transform-origin: top left;
    width: 172px;
  }

  &__cols {
    display: flex;
  }

  &__foot {
    padding: 6px;
    border-top: 2px solid var(--ui-line);
    display: flex;
    justify-content: flex-end;
  }

  &__now {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 2px solid var(--ui-line-2);
    border-radius: 99px;
    background: var(--ui-bg-soft);
    color: var(--ui-ink-2);
    font-size: 12.5px;
    font-weight: 700;
    font-family: inherit;
    padding: 4px 13px;
    cursor: pointer;
    transition: 0.2s var(--ui-spring);

    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
      transform: translateY(-1px);
      box-shadow: 2px 2px 0 var(--ui-bg-tint);
    }
  }
  &__col {
    flex: 1;
    max-height: 210px;
    overflow-y: auto;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    & + & {
      border-left: 2px dashed var(--ui-line);
    }
    button {
      border: 0;
      background: none;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 13px;
      font-family: var(--ui-font-mono);
      font-weight: 600;
      color: var(--ui-ink);
      cursor: pointer;
      text-align: center;
      transition: 0.15s;
      &:hover {
        background: var(--ui-bg-soft);
      }
      &.is-sel {
        background: var(--ui-brand);
        color: var(--ui-on-brand);
      }
    }
  }
}

.aero-time-enter-active,
.aero-time-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-time-enter-from,
.aero-time-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
