<script setup lang="ts">
import { AeroDivider, useLocale } from 'aero-vue'
// 段落文案原硬编码中文 → 走词包 demo 组（'Or' 英文保留）
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div>
    <p style="color: var(--ui-ink-2)">{{ t['divider.topContent'] }}</p>
    <AeroDivider />
    <AeroDivider title="Or" />
    <div style="display: flex; height: 40px; align-items: center">
      {{ t['divider.left'] }} <AeroDivider vertical /> {{ t['divider.middle'] }} <AeroDivider vertical dashed /> {{ t['divider.right'] }}
    </div>
  </div>
</template>
