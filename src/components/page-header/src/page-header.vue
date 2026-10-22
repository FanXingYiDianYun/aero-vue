<script setup lang="ts">
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：返回钮 aria 走词包（ConfigProvider locale 注入）
const { pageHeader: pgHeadLabels } = useLocale()

defineProps<{
  title: string
  subtitle?: string
  /** 显示返回按钮 */
  back?: boolean
}>()

const emit = defineEmits<{ (e: 'back'): void }>()
</script>

<template>
  <header class="aero-pghead">
    <button v-if="back" class="aero-pghead__back" type="button" :aria-label="pgHeadLabels.backAria" @click="emit('back')">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['arrow-left']" :key="i" :d="d" />
      </svg>
    </button>
    <div class="aero-pghead__main">
      <h1 class="aero-pghead__title">{{ title }}</h1>
      <p v-if="subtitle" class="aero-pghead__sub">{{ subtitle }}</p>
    </div>
    <div class="aero-pghead__extra"><slot /></div>
  </header>
</template>

<style scoped lang="scss">
.aero-pghead {
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 34px 0 22px;
  border-bottom: 2px solid var(--ui-line);

  &__back {
    width: 38px;
    height: 38px;
    border-radius: 13px;
    border: 2px solid var(--ui-line);
    background: var(--ui-card);
    color: var(--ui-ink-2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.25s var(--ui-spring);
    flex: none;
    margin-top: 4px;
    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
      transform: translateX(-2px) rotate(-6deg);
      box-shadow: 3px 3px 0 var(--ui-bg-tint);
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
  &__title {
    margin: 0;
    font-size: clamp(26px, 3.4vw, 38px);
    letter-spacing: -0.01em;
    color: var(--ui-ink);
    line-height: 1.25;
  }
  &__sub {
    margin: 8px 0 0;
    color: var(--ui-ink-2);
    font-size: 14.5px;
    max-width: 640px;
    line-height: 1.7;
  }
  &__extra {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
</style>
