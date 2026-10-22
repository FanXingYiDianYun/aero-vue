<script setup lang="ts">
import { useLocale } from '../../../locale'

// i18n：转圈 aria 走词包（ConfigProvider locale 注入）
const { common: commonLabels } = useLocale()

withDefaults(
  defineProps<{
    /** 尺寸档位（默认：'md'） */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <span class="aero-spinner" :class="`aero-spinner--${$props.size}`" role="status" :aria-label="commonLabels.loading" />
</template>

<style scoped lang="scss">
.aero-spinner {
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid var(--ui-line-2);
  border-top-color: var(--ui-brand);
  animation: ui-spin 0.8s linear infinite;
  display: inline-block;

  &--sm {
    width: 18px;
    height: 18px;
    border-width: 2.5px;
  }
  &--lg {
    width: 46px;
    height: 46px;
    border-width: 4px;
  }
}
</style>
