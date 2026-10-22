<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroTour, AeroButton, AeroInput, AeroBadge } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const open = ref(false)
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const steps = computed(() => [
  { target: '#tour-input', title: t.value['tour.step1Title'], desc: t.value['tour.step1Desc'] },
  { target: '#tour-badge', title: t.value['tour.step2Title'], desc: t.value['tour.step2Desc'] },
  { target: '#tour-btn', title: t.value['tour.step3Title'], desc: t.value['tour.step3Desc'] },
])
</script>

<template>
  <div style="display: flex; gap: 22px; align-items: center; padding: 30px 0; flex-wrap: wrap">
    <AeroInput id="tour-input" :placeholder="t['tour.searchPlaceholder']" :width="200" />
    <AeroBadge id="tour-badge" type="ok" dot>{{ t['tour.badge'] }}</AeroBadge>
    <AeroButton id="tour-btn" type="primary" size="sm" @click="open = true">{{ t['tour.startBtn'] }}</AeroButton>
    <AeroTour v-model="open" :steps="steps" />
  </div>
</template>
