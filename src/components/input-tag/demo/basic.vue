<script setup lang="ts">
import { ref } from 'vue'
import { AeroInputTag, useLocale } from 'aero-vue'
// placeholder/当前标签原硬编码中文 → 走词包 demo 组（tags 数据保留）
const { demo } = useLocale()
const t = demo

const tags = ref<string[]>(['vue', 'vite'])
</script>

<template>
  <div style="max-width: 360px">
    <AeroInputTag v-model="tags" :placeholder="t['inputTag.placeholder']" :max="6" />
    <p style="font-size: 12.5px; color: var(--ui-ink-3); margin-top: 8px">{{ t['inputTag.current'] }}{{ tags.join(' / ') }}</p>
  </div>
</template>
