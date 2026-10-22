<script setup lang="ts">
import { computed } from 'vue'
import { iconPaths, type AeroIconName } from './paths'

const props = withDefaults(
  defineProps<{
    /** 图标名（lucide 线性风格内置集） */
    name: AeroIconName
    /** 尺寸 px */
    size?: number | string
    /** 描边宽度 */
    stroke?: number
  }>(),
  { size: 16, stroke: 2 },
)

const d = computed(() => iconPaths[props.name] ?? [])
const s = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    class="aero-icon"
    :width="s"
    :height="s"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="props.stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(p, i) in d" :key="i" :d="p" />
  </svg>
</template>

<style scoped lang="scss">
.aero-icon {
  box-sizing: border-box;
  display: block;
  flex: none;
}
</style>
