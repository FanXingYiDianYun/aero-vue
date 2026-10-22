<script setup lang="ts">
import { AeroPageHeader, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 标题/副标题/按钮原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="max-width: 640px">
    <AeroPageHeader :title="t['pageHeader.title']" :subtitle="t['pageHeader.subtitle']" back @back="() => {}">
      <AeroButton type="outline" size="sm">{{ t['pageHeader.exportBtn'] }}</AeroButton>
    </AeroPageHeader>
  </div>
</template>
