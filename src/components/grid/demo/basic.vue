<script setup lang="ts">
import { AeroGrid, useLocale } from 'aero-vue'
import { AeroCard } from 'aero-vue'
// 卡片文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <AeroGrid :cols="3" :gap="16" style="max-width: 560px">
    <AeroCard v-for="i in 6" :key="i" hoverable>
      <h4>{{ t['grid.card'] }} {{ i }}</h4>
      <p>{{ t['grid.sample'] }}</p>
    </AeroCard>
  </AeroGrid>
</template>
