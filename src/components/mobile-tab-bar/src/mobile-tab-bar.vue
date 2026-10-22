<script setup lang="ts">
/**
 * MobileTabBar 移动端底部标签栏 —— 复刻 demo .p-nav
 * 滑动胶囊指示条 + popIn 图标弹跳
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface AeroMobileTabItem {
  /** 图标名（AeroIconName） */
  icon: string
  /** 文案 */
  label: string
}

const props = withDefaults(
  defineProps<{
    items: AeroMobileTabItem[]
    modelValue?: number
  }>(),
  { modelValue: 0 },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const root = ref<HTMLElement>()
const pill = ref<HTMLElement>()
const inner = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => { inner.value = v },
)

function sync() {
  const nav = root.value
  const p = pill.value
  if (!nav || !p) return
  const a = nav.querySelectorAll<HTMLElement>('.aero-mtab')[inner.value]
  if (!a) return
  p.style.width = a.offsetWidth + 'px'
  p.style.transform = `translateX(${a.offsetLeft}px)`
}

function pick(n: number) {
  inner.value = n
  emit('update:modelValue', n)
  emit('change', n)
  nextTick(sync)
}

const onResize = () => sync()

onMounted(() => {
  nextTick(sync)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <nav ref="root" class="aero-mtabbar">
    <span ref="pill" class="aero-mtabbar__pill" />
    <button
      v-for="(t, n) in items"
      :key="n"
      class="aero-mtab"
      :class="{ on: n === inner }"
      type="button"
      @click="pick(n)"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path v-for="(d, i) in tabPaths[t.icon] ?? []" :key="i" :d="d" />
      </svg>
      {{ t.label }}
    </button>
  </nav>
</template>

<script lang="ts">
// 内置 tab 图标路径（不依赖 Icon 组件，减小耦合）
const tabPaths: Record<string, string[]> = {
  home: ['M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3h-2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'],
  rocket: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z', 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'],
  activity: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  user: ['M19 21a7 7 0 0 0-14 0', 'M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
}
export default { tabPaths }
</script>

<style scoped lang="scss">
.aero-mtabbar {
  box-sizing: border-box;
  display: flex;
  border-top: 2px solid var(--ui-line);
  background: var(--ui-card);
  padding: 7px 8px 4px;
  position: relative;
  margin-top: auto;

  &__pill {
    position: absolute;
    top: 5px;
    bottom: 3px;
    left: 0;
    background: var(--ui-bg-tint);
    border-radius: 13px;
    transition: transform 0.35s var(--ui-spring), width 0.35s var(--ui-spring);
    width: 0;
  }
}

.aero-mtab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ui-ink-3);
  border: 0;
  background: none;
  padding: 6px 0 4px;
  position: relative;
  z-index: 1;
  font-family: inherit;
  transition: color 0.25s;
  cursor: pointer;

  &.on {
    color: var(--ui-brand-ink);

    svg {
      animation: aero-mtab-pop 0.4s var(--ui-spring);
    }
  }
}

@keyframes aero-mtab-pop {
  from { transform: scale(0.6); }
  to { transform: scale(1); }
}
</style>
