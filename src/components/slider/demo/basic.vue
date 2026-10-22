<script setup lang="ts">
import { ref } from 'vue'
import { AeroSlider } from 'aero-vue'

const v = ref(50)
</script>

<template>
  <AeroSlider v-model="v" start-label="0%" end-label="100%" unit="%" />
</template>
