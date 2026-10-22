<script setup lang="ts">
import { AeroBottomSheet, AeroToast, useLocale } from 'aero-vue'
// 标题/行 label/toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <AeroBottomSheet
    :title="t['bottomSheet.title']"
    style="width: 280px; min-height: 220px"
    :rows="[[t['bottomSheet.duration'], '2.1s'], [t['bottomSheet.cacheHit'], '92%'], [t['bottomSheet.artifact'], '42MB']]"
    @change="(v) => v && AeroToast.info(t['bottomSheet.expanded'])"
  />
</template>
