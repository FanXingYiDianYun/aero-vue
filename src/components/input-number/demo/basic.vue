<script setup lang="ts">
import { ref } from 'vue'
import { AeroInputNumber } from 'aero-vue'

const n = ref(5)
</script>

<template>
  <div style="display: flex; gap: 18px; flex-wrap: wrap">
    <AeroInputNumber v-model="n" :min="0" :max="10" />
    <AeroInputNumber v-model="n" :step="2" step-strictly />
    <AeroInputNumber v-model="n" disabled />
  </div>
</template>
