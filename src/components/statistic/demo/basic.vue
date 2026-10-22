<script setup lang="ts">
import { ref } from 'vue'
import { AeroStatistic, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 统计 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const n = ref(12864)
</script>

<template>
  <div style="display: flex; gap: 40px; align-items: center; flex-wrap: wrap">
    <AeroStatistic :value="n" label="GitHub Stars" />
    <AeroStatistic :value="99.9" suffix="%" :label="t['statistic.availability']" />
    <AeroStatistic :value="42" prefix="v" :label="t['statistic.componentCount']" :animated="false" />
    <AeroButton size="sm" @click="n += 500">+500</AeroButton>
  </div>
</template>
