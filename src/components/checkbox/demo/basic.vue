<script setup lang="ts">
import { ref } from 'vue'
import { AeroCheckbox, useLocale } from 'aero-vue'
import { AeroCheckboxGroup } from 'aero-vue'
// 标签/空态原硬编码中文 → 走词包 demo 组（Vue/Vite/SCSS 为数据，保留）
const { demo } = useLocale()
const t = demo

const single = ref(true)
const arr = ref<string[]>(['vue'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <AeroCheckbox v-model="single">{{ t['checkbox.single'] }}</AeroCheckbox>
    <AeroCheckboxGroup v-model="arr">
      <AeroCheckbox value="vue">Vue</AeroCheckbox>
      <AeroCheckbox value="vite">Vite</AeroCheckbox>
      <AeroCheckbox value="scss">SCSS</AeroCheckbox>
    </AeroCheckboxGroup>
    <p style="font-size: 12.5px; color: var(--ui-ink-3)">{{ t['checkbox.selected'] }}{{ arr.join(' / ') || t['checkbox.none'] }}</p>
  </div>
</template>
