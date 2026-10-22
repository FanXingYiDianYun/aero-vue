<script setup lang="ts">
import { iconPaths } from '../../icon/src/paths'
import type { AeroTimelineItem } from './timeline.types'

defineProps<{
  /** 时间线条目列表（节点图标/日期/标签/标题/描述） */
  items: AeroTimelineItem[]
}>()
</script>

<template>
  <div class="aero-timeline">
    <div v-for="it in items" :key="it.title" class="aero-timeline__item">
      <span class="aero-timeline__node">
        <svg v-if="it.icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths[it.icon] ?? []" :key="i" :d="d" />
        </svg>
      </span>
      <div class="aero-timeline__card">
        <div class="aero-timeline__date">
          <span v-if="it.date">{{ it.date }}</span>
          <i v-if="it.chip" class="aero-timeline__chip">{{ it.chip }}</i>
        </div>
        <b>{{ it.title }}</b>
        <p v-if="it.desc">{{ it.desc }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-timeline {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__item {
    display: flex;
    gap: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 23px;
      top: 54px;
      bottom: -14px;
      width: 2.5px;
      background: repeating-linear-gradient(180deg, var(--ui-line-2) 0 6px, transparent 6px 12px);
    }
    &:last-child::before {
      display: none;
    }
  }

  &__node {
    flex: none;
    width: 46px;
    height: 46px;
    border-radius: 15px;
    background: var(--ui-bg-tint);
    border: 2px solid var(--ui-line-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-brand-ink);
    position: relative;
    z-index: 1;
    transition: 0.32s var(--ui-spring);
    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 15px;
      border: 2.5px solid var(--ui-brand);
      opacity: 0;
      transition: 0.3s;
    }
  }
  &__item:hover &__node {
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    transform: rotate(-7deg) scale(1.06);
    border-color: var(--ui-ink);
  }
  &__item:hover &__node::after {
    opacity: 0.5;
    animation: ui-pulse 1.6s infinite;
  }

  &__card {
    flex: 1;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 16px;
    padding: 13px 18px 14px;
    transition: 0.3s var(--ui-spring);
    b {
      font-size: 15px;
      color: var(--ui-ink);
    }
    p {
      color: var(--ui-ink-2);
      font-size: 13.5px;
      margin: 3px 0 0;
    }
  }
  &__item:hover &__card {
    transform: translateX(5px);
    border-color: var(--ui-brand);
    box-shadow: 4px 4px 0 var(--ui-bg-tint);
  }

  &__date {
    font-family: var(--ui-font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--ui-brand-ink);
    letter-spacing: 0.05em;
    display: flex;
    gap: 9px;
    align-items: center;
    margin-bottom: 2px;
  }
  &__chip {
    font-style: normal;
    font-size: 10px;
    font-weight: 700;
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    border-radius: 99px;
    padding: 1px 9px;
    letter-spacing: 0.08em;
    transform: rotate(-2deg);
  }
}
</style>
