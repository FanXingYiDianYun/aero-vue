<script setup lang="ts">
import { computed } from 'vue'
import { iconPaths, type AeroIconName } from '../../icon/src/paths'

const props = withDefaults(
  defineProps<{
    /** 结果状态，决定图标与配色（默认：'info'） */
    status?: 'success' | 'error' | 'warn' | 'info'
    /** 结果标题 */
    title: string
    /** 结果描述文案（可选） */
    desc?: string
  }>(),
  { status: 'info' },
)

const iconName = computed<AeroIconName>(() => iconMap[props.status] ?? 'info')

const iconMap: Record<string, AeroIconName> = {
  success: 'circle-check',
  error: 'circle-x',
  warn: 'triangle-alert',
  info: 'info',
}
</script>

<template>
  <div class="aero-result" :class="`is-${$props.status}`">
    <span class="aero-result__badge">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths[iconName] ?? []" :key="i" :d="d" />
      </svg>
    </span>
    <h3 class="aero-result__title">{{ title }}</h3>
    <p v-if="desc" class="aero-result__desc">{{ desc }}</p>
    <div class="aero-result__extra"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.aero-result {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 38px 26px;
  background: var(--ui-card);
  border: 2px solid var(--ui-line);
  border-radius: var(--ui-radius-xl);

  &__badge {
    width: 84px;
    height: 84px;
    border-radius: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    transform: rotate(-4deg);
    box-shadow: var(--ui-shadow-xs);
    animation: ui-pop-in 0.5s var(--ui-spring);
  }
  &.is-success &__badge {
    background: color-mix(in srgb, var(--ui-ok) 16%, transparent);
    color: var(--ui-ok);
  }
  &.is-error &__badge {
    background: color-mix(in srgb, var(--ui-err) 14%, transparent);
    color: var(--ui-err);
  }
  &.is-warn &__badge {
    background: color-mix(in srgb, var(--ui-warn) 16%, transparent);
    color: var(--ui-warn);
  }
  &.is-info &__badge {
    background: var(--ui-bg-tint);
    color: var(--ui-brand-ink);
  }

  &__title {
    font-size: 22px;
    margin: 0 0 8px;
    color: var(--ui-ink);
  }
  &__desc {
    color: var(--ui-ink-2);
    font-size: 14px;
    margin: 0;
    max-width: 420px;
    line-height: 1.7;
  }
  &__extra {
    margin-top: 22px;
    display: flex;
    gap: 10px;
  }
}
</style>
