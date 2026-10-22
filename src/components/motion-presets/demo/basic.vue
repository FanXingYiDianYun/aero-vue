<script setup lang="ts">
import { AeroMotionPresets, useLocale } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
import { useMotion } from 'aero-vue'
import type { MotionName } from 'aero-vue'
// 开关 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const names: MotionName[] = ['pulse', 'bounce', 'shake', 'wiggle', 'float', 'spin']
// 全局动效门控：开关联动 html[data-motion]，影响全库循环动画（GPU 断路方案）
const { state, setEnabled } = useMotion()
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <AeroSwitch :model-value="state.enabled" @update:model-value="(v) => setEnabled(v)">{{ t['motionPresets.enableLabel'] }}</AeroSwitch>
    <div style="display: flex; gap: 14px; flex-wrap: wrap">
      <AeroMotionPresets v-for="n in names" :key="n" :name="n" :animated="state.enabled" />
    </div>
  </div>
</template>
