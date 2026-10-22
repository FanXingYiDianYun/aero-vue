<script setup lang="ts">
import { AeroNotification, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 按钮文字/通知标题正文原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap">
    <AeroButton size="sm" type="primary" @click="AeroNotification.success(t['notification.successTitle'], t['notification.successBody'])">{{ t['notification.success'] }}</AeroButton>
    <AeroButton size="sm" type="danger" @click="AeroNotification.error(t['notification.errorTitle'], t['notification.errorBody'])">{{ t['notification.error'] }}</AeroButton>
    <AeroButton size="sm" @click="AeroNotification.warn(t['notification.warnTitle'], t['notification.warnBody'])">{{ t['notification.warn'] }}</AeroButton>
    <AeroButton size="sm" type="ghost" @click="AeroNotification.info(t['notification.infoTitle'], t['notification.infoBody'])">{{ t['notification.info'] }}</AeroButton>
  </div>
</template>
