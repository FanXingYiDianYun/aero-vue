<script setup lang="ts">
/**
 * MobileStatCard 移动端数据卡 —— 复刻 demo .p-stat
 * 左上标签 + 大数字 + 可选 spark 图表（折线 chartline / 柱状 bars）
 */

export interface AeroSparkPoint {
  x: number
  y: number
}

const props = withDefaults(
  defineProps<{
    /** 标签（如 QPS） */
    label: string
    /** 主数值文本 */
    value: string | number
    /** 迷你图表类型：line 折线 / bar 柱状 / none */
    chart?: 'line' | 'bar' | 'none'
    /** 折线坐标点（viewBox 0 0 100 26） */
    points?: AeroSparkPoint[]
    /** 柱状数据 [x,y,w,h]（viewBox 0 0 100 26） */
    bars?: Array<{ x: number; y: number; w: number; h: number; main?: boolean }>
    /** 图表线色是否主色 */
    mainColor?: boolean
  }>(),
  { chart: 'none', mainColor: true },
)
</script>

<template>
  <div class="aero-mstat">
    <small class="aero-mstat__label">{{ label }}</small>
    <b class="aero-mstat__value">{{ value }}</b>
    <svg v-if="chart === 'line' && points?.length" class="aero-mstat__spark" viewBox="0 0 100 26" preserveAspectRatio="none">
      <path
        class="aero-mstat__chartline"
        :d="'M' + points.map((p) => `${p.x} ${p.y}`).join(' L')"
        fill="none"
        :stroke="mainColor ? 'var(--ui-brand)' : 'var(--ui-line-2)'"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else-if="chart === 'bar' && bars?.length" class="aero-mstat__spark" viewBox="0 0 100 26" preserveAspectRatio="none">
      <g class="aero-mstat__bars">
        <rect
          v-for="(b, i) in bars"
          :key="i"
          :x="b.x"
          :y="b.y"
          :width="b.w"
          :height="b.h"
          rx="2"
          :fill="b.main ? 'var(--ui-brand)' : 'var(--ui-line-2)'"
          :style="{ animationDelay: i * 0.4 + 's' }"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.aero-mstat {
  box-sizing: border-box;
  border: 2px solid var(--ui-line);
  border-radius: 15px;
  padding: 11px 13px;
  background: var(--ui-card);

  &__label {
    font-size: 10.5px;
    color: var(--ui-ink-3);
    font-weight: 600;
    display: block;
  }

  &__value {
    font-family: var(--ui-font-mono);
    font-size: 19px;
    color: var(--ui-brand-ink);
  }

  &__spark {
    width: 100%;
    height: 26px;
    margin-top: 4px;
    display: block;
  }

  &__chartline {
    stroke-dasharray: 600;
    animation: aero-mstat-drawline 5s var(--ui-ease) infinite;
  }

  &__bars rect {
    transform-origin: bottom;
    transform-box: fill-box;
    animation: aero-mstat-bargrow 2.6s ease-in-out infinite;
  }
}

@keyframes aero-mstat-drawline {
  0% { stroke-dashoffset: 600; }
  55%, 100% { stroke-dashoffset: 0; }
}
@keyframes aero-mstat-bargrow {
  0%, 100% { transform: scaleY(0.45); }
  50% { transform: scaleY(1); }
}
</style>
