<script setup lang="ts">
import { ref } from 'vue'
import { AeroSwitch } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const on = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <AeroSwitch v-model="on">{{ t['switch.followSystem'] }}</AeroSwitch>
    <AeroSwitch :model-value="!on">{{ t['switch.inverted'] }}</AeroSwitch>
    <AeroSwitch disabled>{{ t['switch.disabled'] }}</AeroSwitch>
  </div>
</template>
