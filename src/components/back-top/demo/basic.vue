<script setup lang="ts">
import { AeroBackTop, useLocale } from 'aero-vue'
// 提示文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// 不传 target，靠组件自动探测真实滚动容器（双视口自适应）。
// 桌面端 window 不可滚 → 兜底命中 .pg-main；移动端 window 可滚 → 直接走 window。
// 硬传 ".pg-main" 在移动端失效（.pg-main 无滚动，scrollTop 恒 0）。
</script>

<template>
  <div style="height: 1200px; padding-top: 400px; color: var(--ui-ink-3); font-size: 13px">
    {{ t['backTop.hint'] }}
    <AeroBackTop :threshold="200" />
  </div>
</template>
