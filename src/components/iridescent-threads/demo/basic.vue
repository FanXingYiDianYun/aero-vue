<script setup lang="ts">
import { ref } from 'vue'
import { AeroIridescentThreads, AeroSwitch, AeroTypography, useLocale } from 'aero-vue'
// 面板文案/开关 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const hueShift = ref(0)
/** 开关控制是否启相位漂移（switch 要 boolean，hueShift 保留 number 供组件消费） */
const driftOn = ref(false)
</script>

<template>
  <div class="it-stage">
    <AeroIridescentThreads :count="7" :cycle="32" :hue-shift="driftOn ? hueShift : 0" />
    <div class="it-panel">
      <AeroTypography level="body">{{ t['iridescent.desc'] }}</AeroTypography>
      <div class="it-panel__row">
        <AeroSwitch v-model="driftOn">{{ t['iridescent.hueDrift'] }}</AeroSwitch>
      </div>
    </div>
  </div>
</template>

<style scoped>
.it-stage {
  position: relative;
  width: 100%;
  min-height: 280px;
  overflow: hidden;
  border: 2px dashed var(--ui-line-2);
  border-radius: 20px;
  display: grid;
  place-items: center;
}
.it-panel {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: color-mix(in srgb, var(--ui-bg) 82%, transparent);
  backdrop-filter: blur(6px);
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid var(--ui-line);
}
.it-panel__row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
