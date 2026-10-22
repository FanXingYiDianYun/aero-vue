<script setup lang="ts">
import { AeroActionButtons, AeroToast, useLocale } from 'aero-vue'
// toast 文案原硬编码中文 → 走词包 demo 组，随 ConfigProvider locale 翻转
const { demo } = useLocale()
</script>

<template>
  <AeroActionButtons
    @reject="AeroToast.warn(demo['actionButtons.reject'])"
    @accept="AeroToast.success(demo['actionButtons.accept'])"
  />
</template>
