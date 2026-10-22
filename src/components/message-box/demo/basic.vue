<script setup lang="ts">
import { AeroMessageBox, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroToast } from 'aero-vue'
// 确认框文案/toast 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

async function ask() {
  const ok = await AeroMessageBox.confirm({
    title: t.value['messageBox.title'],
    message: t.value['messageBox.message'],
    danger: true,
    confirmText: t.value['messageBox.confirmText'],
  })
  AeroToast[ok ? 'success' : 'info'](ok ? t.value['messageBox.deleted'] : t.value['messageBox.cancelled'])
}
</script>

<template>
  <AeroButton type="danger" @click="ask">{{ t['messageBox.triggerBtn'] }}</AeroButton>
</template>
