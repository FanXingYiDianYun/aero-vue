<script setup lang="ts">
import { ref } from 'vue'
import { AeroTimePicker } from 'aero-vue'

const t = ref('09:30')
</script>

<template>
  <div style="max-width: 200px">
    <AeroTimePicker v-model="t" :minute-step="5" />
  </div>
</template>
