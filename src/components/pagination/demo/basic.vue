<script setup lang="ts">
import { ref } from 'vue'
import { AeroPagination, useLocale } from 'aero-vue'
// 页码提示原硬编码中文 → 走词包 demo 组（键+插值）
const { demo } = useLocale()
const t = demo

const page = ref(3)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
    <AeroPagination v-model="page" :total="264" />
    <span style="font-size: 12.5px; color: var(--ui-ink-3)">{{ t['pagination.pageOf'] }} {{ page }} {{ t['pagination.pageSuffix'] }}</span>
  </div>
</template>
