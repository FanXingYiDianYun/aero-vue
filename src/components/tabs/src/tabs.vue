<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    /** 标签数据：{key, label} */
    tabs: { key: string | number; label: string }[]
  }>(),
  {},
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'change', v: string | number): void
}>()

const active = computed(() => props.modelValue ?? props.tabs[0]?.key)

const inkRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()

async function moveInk() {
  await nextTick()
  const list = listRef.value
  const ink = inkRef.value
  if (!list || !ink) return
  const el = list.querySelector<HTMLElement>(`[data-key="${String(active.value)}"]`)
  if (!el) return
  ink.style.width = `${el.offsetWidth}px`
  ink.style.transform = `translateX(${el.offsetLeft}px)`
}

function pick(k: string | number) {
  if (k === active.value) return
  emit('update:modelValue', k)
  emit('change', k)
}

/** 键盘可达：左右方向键在 tabs 间切换（WAI-ARIA tabs 模式） */
function onKeyNav(e: KeyboardEvent) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  e.preventDefault()
  const i = props.tabs.findIndex((t) => t.key === active.value)
  const n = props.tabs.length
  if (!n) return
  const next = e.key === 'ArrowRight' ? (i + 1) % n : (i - 1 + n) % n
  pick(props.tabs[next].key)
}

onMounted(moveInk)
watch(active, moveInk)
watch(() => props.tabs, moveInk, { deep: true })
</script>

<template>
  <div class="aero-tabs">
    <div ref="listRef" class="aero-tabs__list" role="tablist">
      <span ref="inkRef" class="aero-tabs__ink" />
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        role="tab"
        :data-key="t.key"
        class="aero-tabs__tab"
        :class="{ 'is-active': t.key === active }"
        :tabindex="t.key === active ? 0 : -1"
        :aria-selected="t.key === active"
        @click="pick(t.key)"
        @keydown="onKeyNav"
      >
        <slot name="label" :tab="t">{{ t.label }}</slot>
      </button>
    </div>
    <div class="aero-tabs__panel" :key="active">
      <slot :active="active" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-tabs {
  box-sizing: border-box;
  &__list {
    display: inline-flex;
    gap: 2px;
    position: relative;
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 4px;
    background: var(--ui-bg-soft);
  }
  &__ink {
    position: absolute;
    bottom: 4px;
    top: 4px;
    left: 0;
    background: var(--ui-brand);
    border-radius: 10px;
    transition: transform 0.35s var(--ui-spring), width 0.35s var(--ui-spring);
    z-index: 0;
    width: 0;
  }
  &__tab {
    border: 0;
    background: none;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ui-ink-2);
    border-radius: 10px;
    transition: 0.25s;
    position: relative;
    z-index: 1;
    cursor: pointer;
    font-family: inherit;
    &.is-active {
      color: var(--ui-on-brand);
    }
  }
  &__panel {
    margin-top: 16px;
    animation: ui-fade-up 0.45s;
  }
}
</style>
