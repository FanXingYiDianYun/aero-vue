<script setup lang="ts">
import { ref } from 'vue'
import { AeroRingProgress } from 'aero-vue'
import { AeroSlider } from 'aero-vue'

const p = ref(72)
</script>

<template>
  <div style="display: flex; gap: 20px; align-items: center">
    <AeroRingProgress :percent="p" sublabel="CPU LOAD" />
    <!-- 控制滑块统一用项目 Slider 组件（替代原生 input[type=range]） -->
    <AeroSlider v-model="p" :min="0" :max="100" :show-scale="false" />
  </div>
</template>
