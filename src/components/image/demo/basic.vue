<script setup lang="ts">
import { AeroImage, useLocale } from 'aero-vue'
// alt 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 14px; flex-wrap: wrap">
    <AeroImage
      src="https://picsum.photos/seed/aero1/240/160"
      :alt="t['image.sampleAlt']"
      width="240"
      height="160"
      preview
    />
    <AeroImage src="not-exists.png" width="240" height="160" :alt="t['image.failAlt']" />
  </div>
</template>
