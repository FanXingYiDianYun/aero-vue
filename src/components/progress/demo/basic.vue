<script setup lang="ts">
import { ref } from 'vue'
import { AeroProgress } from 'aero-vue'
import { AeroSlider } from 'aero-vue'

const p = ref(66)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 320px">
    <AeroProgress :percent="p" />
    <AeroProgress :percent="100" status="success" :shimmer="false" />
    <AeroProgress :percent="32" status="error" :shimmer="false" />
    <!-- 控制滑块统一用项目 Slider 组件（替代原生 input[type=range]） -->
    <AeroSlider v-model="p" :min="0" :max="100" :show-scale="false" />
  </div>
</template>
