<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 百分比 0-100 */
    percent: number
    /** 是否显示流光（GPU 门控，demo shimmer） */
    shimmer?: boolean
    /** 状态色 */
    status?: 'normal' | 'success' | 'error'
    /** 显示百分比文字 */
    showText?: boolean
  }>(),
  { shimmer: true, status: 'normal', showText: true },
)

const clamped = computed(() => Math.min(100, Math.max(0, props.percent)))
const barColor = computed(() =>
  props.status === 'success' ? 'var(--ui-ok)' : props.status === 'error' ? 'var(--ui-err)' : 'var(--ui-brand)',
)
</script>

<template>
  <div class="aero-progress">
    <div class="aero-progress__track">
      <div
        class="aero-progress__bar"
        :class="{ 'has-shimmer': shimmer && status === 'normal' }"
        :style="{ width: clamped + '%', background: barColor }"
      />
    </div>
    <span v-if="showText" class="aero-progress__text">{{ clamped }}%</span>
  </div>
</template>

<style scoped lang="scss">
.aero-progress {
  box-sizing: border-box;
  width: 100%;
  max-width: 320px;
  display: flex;
  align-items: center;
  gap: 10px;

  &__track {
    flex: 1;
    height: 9px;
    background: var(--ui-line);
    border-radius: 99px;
    overflow: hidden;
  }
  &__bar {
    height: 100%;
    border-radius: 99px;
    transition: width 1s var(--ui-ease);
    position: relative;
    overflow: hidden;
  }
  &__bar.has-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    background-size: 200% 100%;
    animation: ui-shimmer 1.6s linear infinite;
  }
  &__text {
    font-family: var(--ui-font-mono);
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ui-brand-ink);
    min-width: 38px;
    text-align: right;
  }
}
</style>
