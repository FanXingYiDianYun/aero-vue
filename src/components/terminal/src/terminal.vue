<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

export interface TermLine {
  text: string
  type?: 'cmd' | 'ok' | 'live' | 'out'
}

const props = withDefaults(
  defineProps<{
    /** 行序列（驱动打字机） */
    lines: TermLine[]
    /** 打字速度 ms/字符 */
    typeSpeed?: number
    /** 行间停顿 ms */
    lineDelay?: number
    /** 完成后保持光标闪烁 */
    title?: string
  }>(),
  { typeSpeed: 26, lineDelay: 300, title: 'aero@terminal' },
)

const emit = defineEmits<{ (e: 'done'): void }>()

let cancelled = false

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

const doneLines = ref<TermLine[]>([])
const currentLine = ref('')
const currentType = ref<TermLine['type']>('cmd')
const typing = ref(false)

async function run() {
  cancelled = false
  doneLines.value = []
  currentLine.value = ''
  typing.value = true
  for (const l of props.lines) {
    currentType.value = l.type ?? 'out'
    for (const ch of l.text) {
      if (cancelled) return
      currentLine.value += ch
      await sleep(props.typeSpeed)
    }
    if (cancelled) return
    doneLines.value = [...doneLines.value, { text: currentLine.value, type: currentType.value }]
    currentLine.value = ''
    await sleep(props.lineDelay)
  }
  typing.value = false
  emit('done')
}

watch(
  () => props.lines,
  () => run(),
  { immediate: true, deep: false },
)

onBeforeUnmount(() => (cancelled = true))

defineExpose({ replay: run })
</script>

<template>
  <div class="aero-term">
    <div class="aero-term__bar">
      <i /><i /><i />
      <span class="aero-term__tt">{{ title }}</span>
    </div>
    <div class="aero-term__body">
      <p v-for="(l, i) in doneLines" :key="i" class="aero-term__line is-show" :class="`is-${l.type ?? 'out'}`">{{ l.text }}</p>
      <p
        v-if="currentLine || typing"
        class="aero-term__line is-show"
        :class="[`is-${currentType}`, 'is-last']"
      >{{ currentLine }}<i v-if="currentType === 'cmd'" class="aero-term__cursor" /></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-term {
  box-sizing: border-box;
  background: var(--ui-term-bg);
  border: 2px solid var(--ui-term-bd);
  border-radius: var(--ui-radius-xl);
  box-shadow: var(--ui-shadow-xl);
  transform: rotate(-1.4deg);
  transition: transform 0.45s var(--ui-spring);
  overflow: hidden;
  max-width: 100%;

  &:hover {
    transform: rotate(0) translateY(-4px);
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 2px solid var(--ui-term-bd);
    background: var(--ui-term-bar);
    i {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--ui-term-dot);
      &:first-child {
        background: var(--ui-brand);
      }
    }
  }
  &__tt {
    margin-left: auto;
    font-family: var(--ui-font-mono);
    font-size: 12px;
    color: var(--ui-term-txt);
    opacity: 0.6;
    letter-spacing: 0.05em;
  }

  &__body {
    padding: 20px 22px 24px;
    font-family: var(--ui-font-mono);
    font-size: 13.2px;
    min-height: 120px;
    line-height: 2.1;
  }
  &__line {
    opacity: 1;
    color: var(--ui-term-txt);
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
    &.is-cmd {
      color: var(--ui-term-cmd);
    }
    &.is-ok {
      color: var(--ui-term-ok);
    }
    &.is-live {
      color: var(--ui-term-live);
    }
  }
  &__cursor {
    display: inline-block;
    width: 9px;
    height: 16px;
    background: var(--ui-brand);
    margin-left: 7px;
    vertical-align: -2px;
    animation: ui-blink 1s steps(1) infinite;
  }
}
</style>
