<script setup lang="ts">
defineProps<{
  /** 品牌强调（默认浅底） */
  accent?: boolean
}>()
</script>

<template>
  <code class="aero-tag" :class="{ 'is-accent': $props.accent }"><slot /></code>
</template>

<style scoped lang="scss">
.aero-tag {
  box-sizing: border-box;
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: var(--ui-radius-xs);
  background: var(--ui-bg-tint);
  color: var(--ui-brand-ink);
  font-family: var(--ui-font-mono);

  &.is-accent {
    background: var(--ui-brand);
    color: var(--ui-on-brand);
  }
}
</style>
