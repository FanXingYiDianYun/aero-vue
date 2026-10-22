<script setup lang="ts">
import { AeroToast } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap">
    <AeroButton size="sm" type="primary" @click="AeroToast.success(t['toast.successMsg'])">{{ t['toast.success'] }}</AeroButton>
    <AeroButton size="sm" type="danger" @click="AeroToast.error(t['toast.errorMsg'])">{{ t['toast.error'] }}</AeroButton>
    <AeroButton size="sm" @click="AeroToast.warn(t['toast.warnMsg'])">{{ t['toast.warn'] }}</AeroButton>
    <AeroButton size="sm" type="ghost" @click="AeroToast.info(t['toast.infoMsg'])">{{ t['toast.info'] }}</AeroButton>
  </div>
</template>
