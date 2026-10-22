<script setup lang="ts">
import { AeroLayout, AeroTypography, useLocale } from 'aero-vue'
// 段落文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <AeroLayout alt padding="compact" :radius="16">
    <AeroTypography level="title">{{ t['layout.blockTitle'] }}</AeroTypography>
    <AeroTypography level="body">{{ t['layout.body'] }}</AeroTypography>
  </AeroLayout>
</template>
