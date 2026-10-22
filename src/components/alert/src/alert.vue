<script setup lang="ts">
import { ref } from 'vue'
import { iconPaths, type AeroIconName } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// 关闭钮 aria 走词包（alert 组）
const { alert } = useLocale()

const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warn' | 'error'
    /** 标题 */
    title?: string
    /** 可关闭 */
    closable?: boolean
  }>(),
  { type: 'info', closable: false },
)

const iconMap: Record<string, AeroIconName> = {
  info: 'info',
  success: 'circle-check',
  warn: 'triangle-alert',
  error: 'circle-x',
}

const closed = ref(false)
</script>

<template>
  <div v-if="!closed" class="aero-alert" :class="`aero-alert--${type}`" role="alert">
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path v-for="(d, i) in iconPaths[iconMap[type]] ?? []" :key="i" :d="d" />
    </svg>
    <div class="aero-alert__body">
      <b v-if="title">{{ title }}</b>
      <div class="aero-alert__content"><slot /></div>
    </div>
    <button v-if="closable" class="aero-alert__close" type="button" @click="closed = true" :aria-label="alert.closeAria">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.aero-alert {
  box-sizing: border-box;
  display: flex;
  gap: 13px;
  padding: 15px 18px;
  border-radius: 15px;
  border: 2px solid;
  font-size: 14px;
  align-items: flex-start;
  width: 100%;

  svg {
    flex: none;
    width: 19px;
    height: 19px;
    margin-top: 2px;
  }
  b {
    display: block;
    margin-bottom: 2px;
    font-size: 14.5px;
  }
  &__content {
    color: inherit;
    line-height: 1.6;
  }
  &__close {
    margin-left: auto;
    background: none;
    border: 0;
    color: inherit;
    opacity: 0.6;
    display: flex;
    cursor: pointer;
    padding: 2px;
    transition: opacity 0.2s, transform 0.2s;
    &:hover {
      opacity: 1;
      transform: rotate(90deg);
    }
  }

  &--info {
    background: var(--ui-bg-tint);
    border-color: color-mix(in srgb, var(--ui-brand) 35%, transparent);
    color: var(--ui-brand-ink);
  }
  &--success {
    background: color-mix(in srgb, var(--ui-ok) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-ok) 32%, transparent);
    color: color-mix(in srgb, var(--ui-ok) 75%, var(--ui-ink));
    svg {
      color: var(--ui-ok);
    }
  }
  &--warn {
    background: color-mix(in srgb, var(--ui-warn) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-warn) 35%, transparent);
    color: color-mix(in srgb, var(--ui-warn) 70%, var(--ui-ink));
    svg {
      color: var(--ui-warn);
    }
  }
  &--error {
    background: color-mix(in srgb, var(--ui-err) 10%, transparent);
    border-color: color-mix(in srgb, var(--ui-err) 32%, transparent);
    color: color-mix(in srgb, var(--ui-err) 70%, var(--ui-ink));
    svg {
      color: var(--ui-err);
    }
  }
}
</style>
