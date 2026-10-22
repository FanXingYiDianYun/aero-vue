<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 总项数（默认插槽内头像数量），超出 max 折叠 +N */
    total: number
    /** 最多显示个数 */
    max?: number
    /** 尺寸 px（用于 +N 徽标） */
    size?: number | string
  }>(),
  { max: 5, size: 44 },
)

const rest = computed(() => Math.max(0, props.total - props.max))

const moreStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: s, height: s, fontSize: `calc(${s} / 3)` }
})
</script>

<template>
  <span class="aero-avatar-group">
    <slot />
    <span v-if="rest > 0" class="aero-avatar-group__more" :style="moreStyle"> +{{ rest }} </span>
  </span>
</template>

<style scoped lang="scss">
.aero-avatar-group {
  box-sizing: border-box;
  display: inline-flex;
  :deep(.aero-avatar) {
    position: relative;
    z-index: 1;
    margin-left: -12px;
    &:first-child {
      margin-left: 0;
    }
    &:hover {
      transform: translateY(-7px) rotate(-6deg) scale(1.08);
      z-index: 30;
    }
  }
  &__more {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-family: var(--ui-font-en);
    border: 2.5px solid var(--ui-card);
    background: var(--ui-bg-tint);
    color: var(--ui-brand-ink);
    flex: none;
    margin-left: -12px;
    position: relative;
    z-index: 1;
    transition: transform 0.3s var(--ui-spring);
    &:hover {
      transform: translateY(-7px) rotate(-6deg) scale(1.08);
      z-index: 30;
    }
  }
}
</style>
