<script setup lang="ts">
import { ref } from 'vue'
import { AeroButton, AeroIcon, useLocale } from 'aero-vue'
// 按钮文字原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const loading = ref(false)
function simulate() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center">
    <AeroButton type="primary">{{ t['button.primary'] }}</AeroButton>
    <AeroButton type="outline">{{ t['button.secondary'] }}</AeroButton>
    <AeroButton type="ghost">{{ t['button.ghost'] }}</AeroButton>
    <AeroButton type="danger">{{ t['button.danger'] }}</AeroButton>
    <AeroButton type="dark">{{ t['button.dark'] }}</AeroButton>
    <AeroButton type="primary" size="sm">Small</AeroButton>
    <AeroButton type="primary" size="lg">Large</AeroButton>
    <AeroButton :loading="loading" @click="simulate">{{ t['button.clickLoad'] }}</AeroButton>
    <AeroButton type="primary" disabled>{{ t['button.disabled'] }}</AeroButton>
    <AeroButton type="outline" icon-only>
      <template #icon><AeroIcon name="zap" /></template>
    </AeroButton>
    <AeroButton type="primary">
      <template #icon><AeroIcon name="rocket" /></template>
      {{ t['button.withIcon'] }}
    </AeroButton>
  </div>
</template>
