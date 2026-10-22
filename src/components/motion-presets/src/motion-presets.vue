<script setup lang="ts">
import { computed } from 'vue'

export type MotionName = 'pulse' | 'bounce' | 'shake' | 'wiggle' | 'float' | 'spin'

const props = withDefaults(
  defineProps<{
    name: MotionName
    /** 动画门控（GPU 隔离方案：循环动画默认关闭） */
    animated?: boolean
    /** 时长覆盖 */
    duration?: string
  }>(),
  { animated: false, duration: undefined },
)

const animMap: Record<MotionName, { kf: string; base: string }> = {
  pulse: { kf: 'ui-mpulse 1.6s infinite', base: '' },
  bounce: { kf: 'ui-bounce-y 1.5s infinite', base: '' },
  shake: { kf: 'ui-shake-x 1.4s infinite', base: '' },
  wiggle: { kf: 'ui-wiggle 1.2s ease-in-out infinite', base: '' },
  float: { kf: 'ui-floaty 3.4s ease-in-out infinite', base: '' },
  spin: { kf: 'ui-spin 2.4s linear infinite', base: 'border-radius:50%;border:3px solid var(--ui-line-2);border-top-color:var(--ui-brand)' },
}

const style = computed(() => {
  if (!props.animated) return {}
  const a = animMap[props.name]
  return {
    animation: props.duration ? a.kf.replace(/[\d.]+s/, props.duration) : a.kf,
  }
})
</script>

<template>
  <span class="aero-motion" :class="`is-${name}`" :style="style">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.aero-motion {
  box-sizing: border-box;
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--ui-brand);
  border: 2px solid var(--ui-ink);

  &.is-spin {
    border-radius: 50%;
    border: 3px solid var(--ui-line-2);
    border-top-color: var(--ui-brand);
    background: transparent;
  }
}
</style>
