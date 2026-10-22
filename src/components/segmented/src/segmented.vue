<script setup lang="ts">
/**
 * Segmented 分段器 —— 实测定位滑动胶囊（修复百分比步进溢出）
 * 胶囊按当前激活按钮的真实 offsetLeft/offsetWidth 定位，
 * 容器 resize / 选项变化时通过 ResizeObserver 重算。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options: SegmentedOption[]
    disabled?: boolean
    /** 每项等宽撑满 */
    block?: boolean
  }>(),
  { disabled: false, block: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'change', v: string | number): void
}>()

function pick(o: SegmentedOption) {
  if (o.disabled || props.disabled) return
  emit('update:modelValue', o.value)
  emit('change', o.value)
}

const root = ref<HTMLElement>()
const pillStyle = ref<{ left: string; width: string }>({ left: '0px', width: '0px' })

const activeIndex = computed(() => props.options.findIndex((o) => o.value === props.modelValue))

function sync() {
  const el = root.value
  if (!el) return
  const btns = el.querySelectorAll<HTMLElement>('.aero-seg__item')
  const a = btns[activeIndex.value]
  if (a) {
    pillStyle.value = { left: a.offsetLeft + 'px', width: a.offsetWidth + 'px' }
  } else {
    pillStyle.value = { left: '0px', width: '0px' }
  }
}

let ro: ResizeObserver | null = null

watch([activeIndex, () => props.options.length], () => nextTick(sync))

onMounted(() => {
  nextTick(sync)
  ro = new ResizeObserver(() => sync())
  if (root.value) ro.observe(root.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div
    ref="root"
    class="aero-seg"
    :class="{ 'is-block': block, 'is-disabled': disabled }"
    role="radiogroup"
  >
    <span class="aero-seg__pill" :style="pillStyle" />
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="aero-seg__item"
      :class="{ 'is-on': o.value === modelValue, 'is-off': o.disabled }"
      :disabled="o.disabled || disabled"
      role="radio"
      :aria-checked="o.value === modelValue"
      @click="pick(o)"
    >
      <slot :option="o">{{ o.label }}</slot>
    </button>
  </div>
</template>

<style scoped lang="scss">
.aero-seg {
  box-sizing: border-box;
  display: inline-flex;
  border: 2px solid var(--ui-line);
  border-radius: var(--ui-radius-pill);
  padding: 4px;
  background: var(--ui-bg-soft);
  position: relative;

  &.is-block {
    display: flex;
    width: 100%;

    .aero-seg__item {
      flex: 1;
    }
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  /* 胶囊按实测坐标定位，绝不超过容器内缘 */
  &__pill {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    background: var(--ui-brand);
    border-radius: var(--ui-radius-pill);
    box-shadow: 2px 2px 0 var(--ui-ink);
    transition: transform 0.35s var(--ui-spring), width 0.35s var(--ui-spring), left 0.35s var(--ui-spring);
    z-index: 0;
    pointer-events: none;
  }

  &__item {
    border: 0;
    background: none;
    padding: 8px 22px;
    border-radius: var(--ui-radius-pill);
    font-size: 14px;
    font-weight: 700;
    color: var(--ui-ink-2);
    transition: 0.3s;
    font-family: inherit;
    position: relative;
    z-index: 1;
    cursor: pointer;
    white-space: nowrap;

    &.is-on {
      color: var(--ui-on-brand);
    }
    &.is-off {
      opacity: 0.4;
      cursor: default;
    }
  }
}
</style>
