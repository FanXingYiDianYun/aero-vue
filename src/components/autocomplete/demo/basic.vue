<script setup lang="ts">
import { ref } from 'vue'
import { AeroAutocomplete, useLocale } from 'aero-vue'
import type { AutoSuggestion } from 'aero-vue'
// placeholder 原硬编码中文 → 走词包 demo 组（建议项 Vue 3/Vite 等为数据，保留）
const { demo } = useLocale()
const t = demo

const q = ref('')
const all: AutoSuggestion[] = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'Vite', value: 'vite' },
  { label: 'Vitest', value: 'vitest' },
  { label: 'SCSS', value: 'scss' },
  { label: 'TypeScript', value: 'ts' },
]
</script>

<template>
  <div style="max-width: 300px">
    <AeroAutocomplete v-model="q" :suggestions="all" :placeholder="t['autocomplete.placeholder']" />
  </div>
</template>
