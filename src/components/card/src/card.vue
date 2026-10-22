<script setup lang="ts">
withDefaults(
  defineProps<{
    /** hover 抬升签名交互（位移+旋转+7px硬阴影） */
    hoverable?: boolean
    /** 去内边距（内容自管） */
    paddingless?: boolean
    /** 宽度（px 或 CSS 值） */
    width?: number | string
    /** 最小高度（px 或 CSS 值） */
    minHeight?: number | string
  }>(),
  { hoverable: false, paddingless: false },
)
function dim(v: number | string | undefined) {
  if (v === undefined || v === '') return undefined
  return typeof v === 'number' ? v + 'px' : v
}
</script>

<template>
  <div class="aero-card" :class="{ 'is-hoverable': $props.hoverable, 'is-paddingless': $props.paddingless }" :style="{ width: dim($props.width), minHeight: dim($props.minHeight) }">
    <slot name="header" />
    <div v-if="$slots.header" class="aero-card__divider" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<style scoped lang="scss">
.aero-card {
  box-sizing: border-box;
  background: var(--ui-card);
  border: 2px solid var(--ui-line);
  border-radius: var(--ui-radius);
  padding: 24px;
  transition: transform 0.3s var(--ui-spring), box-shadow 0.3s, border-color 0.3s;

  :deep(h4) {
    font-size: 17px;
    margin-bottom: 8px;
  }
  :deep(p) {
    color: var(--ui-ink-2);
    font-size: 14px;
  }

  &__divider {
    height: 2px;
    background: var(--ui-line);
    margin: 16px -24px;
  }

  &.is-paddingless {
    padding: 0;
    overflow: hidden;
    .aero-card__divider {
      margin: 0;
    }
  }

  &.is-hoverable:hover {
    transform: translate(-3px, -3px) rotate(-0.5deg);
    box-shadow: var(--ui-shadow-lg);
    border-color: var(--ui-brand-ink);
  }
}
</style>
