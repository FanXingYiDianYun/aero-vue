<script setup lang="ts">
import { ref } from 'vue'
import { AeroSelect, useLocale } from 'aero-vue'
// placeholder/当前值原硬编码中文 → 走词包 demo 组（框架 options 为数据，保留）
const { demo } = useLocale()
const t = demo

const v = ref<string | undefined>('vue')
const opts = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
]
</script>

<template>
  <div style="max-width: 260px">
    <AeroSelect v-model="v" :options="opts" :placeholder="t['select.placeholder']" clearable />
    <p style="margin-top: 10px; font-size: 12.5px; color: var(--ui-ink-3)">{{ t['select.current'] }}{{ v ?? t['select.none'] }}</p>
  </div>
</template>
