<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    /** 显示外链角标 */
    external?: boolean
    disabled?: boolean
  }>(),
  { href: '#', external: false, disabled: false },
)
</script>

<template>
  <a
    class="aero-link"
    :class="{ 'is-disabled': disabled }"
    :href="disabled ? undefined : href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :aria-disabled="disabled"
  >
    <slot />
    <svg v-if="external" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 3px; vertical-align: -1px">
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h6" />
    </svg>
  </a>
</template>

<style scoped lang="scss">
.aero-link {
  box-sizing: border-box;
  color: var(--ui-brand-ink);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
    color: var(--ui-brand);
  }
  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}
</style>
