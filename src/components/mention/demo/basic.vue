<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroMention, useLocale } from 'aero-vue'
// 团队名原硬编码中文 → 走词包 demo 组（个人名 Alia/Ben/Cara 为数据，保留）
const { demo } = useLocale()
const t = demo

const text = ref('')
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const options = computed(() => [
  { label: t.value['mention.aeroTeam'], value: 'aero-team' },
  { label: 'Alia', value: 'alia' },
  { label: 'Ben', value: 'ben' },
  { label: 'Cara', value: 'cara' },
])
</script>

<template>
  <div style="max-width: 380px">
    <AeroMention v-model="text" :options="options" />
  </div>
</template>
