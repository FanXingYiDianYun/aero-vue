<script setup lang="ts">
import { AeroCard, AeroButton, useLocale } from 'aero-vue'
// 卡片标题/正文/按钮原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 18px; flex-wrap: wrap">
    <AeroCard hoverable :width="280">
      <h4>{{ t['card.hoverableTitle'] }}</h4>
      <p>{{ t['card.hoverableBody'] }}</p>
    </AeroCard>
    <AeroCard :width="280">
      <template #header><h4>{{ t['card.withHeaderTitle'] }}</h4></template>
      {{ t['card.body'] }}
      <template #footer>
        <div style="display: flex; gap: 10px; margin-top: 18px">
          <Btn type="primary" size="sm">{{ t['card.confirm'] }}</Btn>
          <Btn type="ghost" size="sm">{{ t['card.cancel'] }}</Btn>
        </div>
      </template>
    </AeroCard>
  </div>
</template>
