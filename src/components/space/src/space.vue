<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 间距 px */
    gap?: number
    /** 排列方向 */
    direction?: 'horizontal' | 'vertical'
    /** 主轴对齐 */
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
    /** 交叉轴对齐 */
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
    wrap?: boolean
  }>(),
  { gap: 14, direction: 'horizontal', wrap: true },
)

const slots = useSlots()

const style = computed<Record<string, string>>(() => ({
  gap: `${props.gap}px`,
  flexDirection: props.direction === 'vertical' ? 'column' : 'row',
  justifyContent: props.justify
    ? props.justify === 'between'
      ? 'space-between'
      : props.justify === 'around'
        ? 'space-around'
        : `flex-${props.justify}`
    : '',
  alignItems: props.align ? (props.align === 'start' || props.align === 'end' ? `flex-${props.align}` : props.align) : '',
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
}))

// 逐项包裹以支持 v-for 碎片
const children = computed(() => (slots.default?.() ?? []).filter((n) => n.type !== Comment))
</script>

<template>
  <div class="aero-space" :style="style">
    <component :is="n" v-for="(n, i) in children" :key="i" class="aero-space__item" />
  </div>
</template>

<style scoped lang="scss">
.aero-space {
  box-sizing: border-box;
  display: flex;
  &__item {
    display: inline-flex;
  }
}
</style>
