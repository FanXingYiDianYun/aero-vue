<script setup lang="ts">
import { AeroButton, useLocale } from 'aero-vue'
import { party } from 'aero-vue'
// 按钮/说明原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
    <AeroButton type="primary" @click="party($event.clientX, $event.clientY)">{{ t['partyFx.btn'] }}</AeroButton>
    <span style="font-size:13px;color:var(--ui-ink-3)">{{ t['partyFx.note'] }}</span>
  </div>
</template>
