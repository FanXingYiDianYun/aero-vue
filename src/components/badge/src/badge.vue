<script setup lang="ts">
import type { AeroBadgeProps } from './badge.types'

const props = withDefaults(defineProps<AeroBadgeProps>(), { type: 'soft', dot: false })
</script>

<template>
  <span class="aero-badge" :class="`aero-badge--${props.type}`">
    <i v-if="props.dot" class="aero-badge__dot" />
    <slot />
  </span>
</template>

<style scoped lang="scss">
.aero-badge {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
  padding: 3px 11px;
  border-radius: var(--ui-radius-pill);
  letter-spacing: 0.02em;
  transition: transform 0.2s;

  &:hover {
    transform: rotate(-3deg) scale(1.05);
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  &--solid {
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    box-shadow: 0 0 0 2px var(--ui-bg);
  }
  &--soft {
    background: var(--ui-bg-tint);
    color: var(--ui-brand-ink);
    box-shadow: 0 0 0 2px var(--ui-bg);
  }
  &--line {
    border: 2px solid var(--ui-line-2);
    color: var(--ui-ink-2);
  }
  &--dark {
    background: var(--ui-ink);
    color: var(--ui-bg);
    box-shadow: 0 0 0 2px var(--ui-bg);
  }
  &--ok {
    background: color-mix(in srgb, var(--ui-ok) 16%, transparent);
    color: var(--ui-ok);
    box-shadow: 0 0 0 2px var(--ui-bg);
  }
  &--warn {
    background: color-mix(in srgb, var(--ui-warn) 18%, transparent);
    color: var(--ui-warn);
    box-shadow: 0 0 0 2px var(--ui-bg);
  }
  &--err {
    background: color-mix(in srgb, var(--ui-err) 15%, transparent);
    color: var(--ui-err);
    box-shadow: 0 0 0 2px var(--ui-bg);
  }
}
</style>
