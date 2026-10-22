<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    percent: number
    /** 中心主文字（默认显示百分比） */
    label?: string
    /** 中心小字 */
    sublabel?: string
    /** 环粗细 */
    width?: number
    /** 整体尺寸 px */
    size?: number
    stroke?: number
  }>(),
  { width: 130, size: 130, stroke: 11 },
)

const CIRC = 2 * Math.PI * (props.size / 2 - props.stroke) // demo 130/11 → 326.7
const clamped = computed(() => Math.min(100, Math.max(0, props.percent)))
const dashoffset = computed(() => CIRC - (CIRC * clamped.value) / 100)
</script>

<template>
  <div class="aero-ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        class="aero-ring__bg"
        :cx="size / 2"
        :cy="size / 2"
        :r="size / 2 - stroke"
        :stroke-width="stroke"
      />
      <circle
        class="aero-ring__fg"
        :cx="size / 2"
        :cy="size / 2"
        :r="size / 2 - stroke"
        :stroke-width="stroke"
        :stroke-dasharray="CIRC"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <div class="aero-ring__num">
      <b>{{ label ?? clamped + '%' }}</b>
      <small v-if="sublabel">{{ sublabel }}</small>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-ring {
  box-sizing: border-box;
  position: relative;

  svg {
    transform: rotate(-90deg);
  }
  &__bg {
    fill: none;
    stroke: var(--ui-line);
  }
  &__fg {
    fill: none;
    stroke: var(--ui-brand);
    stroke-linecap: round;
    transition: stroke-dashoffset 1.1s var(--ui-ease);
  }
  &__num {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: var(--ui-font-en);
    font-weight: 700;
    font-size: 25px;
    color: var(--ui-ink);
    small {
      font-size: 11px;
      color: var(--ui-ink-3);
      font-weight: 600;
      letter-spacing: 0.08em;
    }
  }
}
</style>
