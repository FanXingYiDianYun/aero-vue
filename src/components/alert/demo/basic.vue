<script setup lang="ts">
import { AeroAlert, useLocale } from 'aero-vue'
// 四条 Alert 标题/正文原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 420px">
    <AeroAlert type="info" :title="t['alert.infoTitle']">{{ t['alert.infoBody'] }}</AeroAlert>
    <AeroAlert type="success" :title="t['alert.successTitle']">{{ t['alert.successBody'] }}</AeroAlert>
    <AeroAlert type="warn" :title="t['alert.warnTitle']">{{ t['alert.warnBody'] }}</AeroAlert>
    <AeroAlert type="error" :title="t['alert.errorTitle']" closable>{{ t['alert.errorBody'] }}</AeroAlert>
  </div>
</template>
