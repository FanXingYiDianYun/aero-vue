<script setup lang="ts">
import { AeroMobileStatCard, useLocale } from 'aero-vue'
// 卡片 label 原硬编码中文 → 走词包 demo 组（数值数据保留）
const { demo } = useLocale()
const t = demo

const line = [
  { x: 2, y: 20 }, { x: 18, y: 14 }, { x: 32, y: 17 }, { x: 48, y: 8 },
  { x: 64, y: 12 }, { x: 80, y: 5 }, { x: 98, y: 9 },
]
const bars = [
  { x: 10, y: 12, w: 8, h: 12 }, { x: 30, y: 8, w: 8, h: 16, main: true },
  { x: 50, y: 14, w: 8, h: 10 }, { x: 70, y: 5, w: 8, h: 19, main: true }, { x: 88, y: 10, w: 8, h: 14 },
]
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 300px">
    <AeroMobileStatCard label="QPS" value="12,480" />
    <AeroMobileStatCard :label="t['mobileStatCard.p95']" value="41ms" />
    <AeroMobileStatCard :label="t['mobileStatCard.online']" value="34" chart="line" :points="line" />
    <AeroMobileStatCard :label="t['mobileStatCard.deploy']" value="218" chart="bar" :bars="bars" />
  </div>
</template>
