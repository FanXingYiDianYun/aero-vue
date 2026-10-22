<script setup lang="ts">
import { ref } from 'vue'
import { AeroColorPicker, useLocale } from 'aero-vue'
// 当前色标签原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const c = ref('#0EBFFF')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <AeroColorPicker v-model="c" />
    <span style="font-family: var(--ui-font-mono); font-size: 13px; color: var(--ui-brand-ink)">{{ t['colorPicker.current'] }}{{ c }}</span>
  </div>
</template>
