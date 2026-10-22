<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 变体形状 */
    variant?: 'text' | 'circle' | 'rect'
    /** text 行高 px（默认 12px 骨架行） */
    height?: number | string
    width?: number | string
    /** 加载态 false 时直接渲染插槽 */
    loading?: boolean
    animated?: boolean
  }>(),
  { variant: 'text', loading: true, animated: true, height: 12 },
)

// 文本行骨架默认铺满容器宽度（circle 不受影响）
const textStyle = computed(() =>
  props.variant === 'text' && !props.width ? { width: '100%' } : undefined,
)
</script>

<template>
  <template v-if="!loading"><slot /></template>
  <span
    v-else
    class="aero-skeleton"
    :class="[`aero-skeleton--${variant}`, { 'is-animated': animated }]"
    :style="[
      { width: variant !== 'circle' ? (width ?? '100%') : undefined, height: height + '' },
      textStyle,
    ]"
  />
</template>

<style scoped lang="scss">
.aero-skeleton {
  box-sizing: border-box;
  border-radius: 9px;
  background: linear-gradient(90deg, var(--ui-line) 25%, var(--ui-bg-tint) 50%, var(--ui-line) 75%);
  background-size: 200% 100%;
  display: inline-block;
  vertical-align: middle;

  &.is-animated {
    animation: ui-shimmer 1.5s linear infinite;
  }
  &--circle {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    aspect-ratio: 1;
  }
  &--rect {
    border-radius: var(--ui-radius-s);
  }
  /* 文本骨架：圆角收敛到 6px 更接近字符条观感，
     行间距由外层 flex gap 承担（demo 同构），此处仅统一视觉基线 */
  &--text {
    border-radius: 6px;
  }
}
</style>
