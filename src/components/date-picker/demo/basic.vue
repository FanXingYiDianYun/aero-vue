<script setup lang="ts">
import { ref } from 'vue'
import { AeroDatePicker } from 'aero-vue'

const d = ref('2026-09-13')
</script>

<template>
  <div style="max-width: 240px">
    <AeroDatePicker v-model="d" />
  </div>
</template>
