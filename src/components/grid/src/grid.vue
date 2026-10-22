<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 列数 1-12 */
    cols?: number
    /** 列间距 px */
    gap?: number
  }>(),
  { cols: 3, gap: 20 },
)

const style = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))`,
  gap: `${props.gap}px`,
}))
</script>

<template>
  <div class="aero-grid" :style="style"><slot /></div>
</template>

<style scoped lang="scss">
.aero-grid {
  box-sizing: border-box;
  width: 100%;
}
</style>
