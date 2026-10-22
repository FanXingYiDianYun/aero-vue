<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroKnob, useLocale } from 'aero-vue'
// 标签/单位原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const v = ref(8)
const info = computed(() => `${v.value} / 16 ${t.value['knob.vcpu']}`)
const cost = computed(() => `¥${(v.value * 0.102).toFixed(2)} ${t.value['knob.perHour']}`)
</script>

<template>
  <div style="display: flex; align-items: center; gap: 22px; user-select: none">
    <AeroKnob v-model="v" />
    <div class="knob-side">
      <span class="ks">{{ t['knob.currentQuota'] }}</span>
      <span class="kv">{{ info }}</span>
      <span class="ks">{{ t['knob.estimatedCost'] }}</span>
      <span class="kv">{{ cost }}</span>
    </div>
  </div>
</template>

<style scoped>
.knob-side { display: flex; flex-direction: column; gap: 8px; }
.ks { font-size: 11.5px; color: var(--ui-ink-3); font-weight: 600; }
.kv { font-family: var(--ui-font-mono); font-size: 13px; color: var(--ui-brand-ink); font-weight: 700; }
</style>
