<script setup lang="ts">
import { AeroWatermark, AeroCard } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo
</script>

<template>
  <AeroWatermark content="AERO UI" :gap="150" :max-width="480" :radius="16" style="overflow: hidden">
    <AeroCard :min-height="160">
      <h4>{{ t['watermark.title'] }}</h4>
      <p>{{ t['watermark.body'] }}</p>
    </AeroCard>
  </AeroWatermark>
</template>
