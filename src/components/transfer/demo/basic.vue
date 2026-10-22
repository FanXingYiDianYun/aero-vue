<script setup lang="ts">
import { ref } from 'vue'
import { AeroTransfer } from 'aero-vue'

const target = ref<string[]>(['vite'])
const data = [
  { key: 'vue', label: 'Vue 3' },
  { key: 'vite', label: 'Vite' },
  { key: 'sass', label: 'Sass', disabled: true },
  { key: 'ts', label: 'TypeScript' },
  { key: 'pnpm', label: 'pnpm' },
]
</script>

<template>
  <AeroTransfer v-model="target" :data="data" />
</template>
