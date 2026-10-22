<script setup lang="ts">
import { useLocale } from '../../../locale'

// i18n：未传 tip 时 aria-label 回落走词包（ConfigProvider locale 注入）
const { common: commonLabels } = useLocale()

withDefaults(
  defineProps<{
    /** 是否显示加载遮罩（默认：false） */
    loading?: boolean
    /** 加载提示文案（可选，不传则只显示转圈） */
    tip?: string
  }>(),
  { loading: false },
)
</script>

<template>
  <div class="aero-loading-wrap">
    <slot />
    <transition name="aero-loading">
      <div v-if="loading" class="aero-loading" role="status" :aria-label="tip ?? commonLabels.loading">
        <span class="aero-loading__spinner" />
        <span v-if="tip" class="aero-loading__tip">{{ tip }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-loading-wrap {
  box-sizing: border-box;
  position: relative;
  min-height: 60px;
}

.aero-loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: color-mix(in srgb, var(--ui-bg) 62%, transparent);
  backdrop-filter: var(--ui-blur-mask);

  &__spinner {
    box-sizing: border-box;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 3.5px solid var(--ui-line-2);
    border-top-color: var(--ui-brand);
    animation: ui-spin 0.8s linear infinite;
  }
  &__tip {
    font-size: 13px;
    font-weight: 600;
    color: var(--ui-ink-2);
  }
}

.aero-loading-enter-active,
.aero-loading-leave-active {
  transition: opacity 0.25s;
}
.aero-loading-enter-from,
.aero-loading-leave-to {
  opacity: 0;
}
</style>
