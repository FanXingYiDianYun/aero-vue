<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 区块内边距模式 */
    padding?: 'normal' | 'compact' | 'none'
    /** 备用浅底（demo .sec.alt） */
    alt?: boolean
    /** 内容最大宽 px */
    maxWidth?: number | string
    /** 容器圆角（px 或 CSS 值） */
    radius?: number | string
  }>(),
  { padding: 'normal', alt: false, maxWidth: 1180 },
)

const style = computed(() => ({
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  borderRadius: props.radius !== undefined ? (typeof props.radius === 'number' ? `${props.radius}px` : props.radius) : undefined,
}))
</script>

<template>
  <section class="aero-section" :class="[`is-${padding}`, { 'is-alt': alt }]">
    <div class="aero-section__container" :style="style"><slot /></div>
  </section>
</template>

<style scoped lang="scss">
.aero-section {
  box-sizing: border-box;
  padding: 96px 0;
  &.is-compact {
    padding: 56px 0;
  }
  &.is-none {
    padding: 0;
  }
  &.is-alt {
    background: var(--ui-bg-soft);
  }

  &__container {
    margin: 0 auto;
    padding: 0 24px;
  }
}
</style>
