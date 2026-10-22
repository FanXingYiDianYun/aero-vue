<script setup lang="ts">
import { AeroLink, useLocale } from 'aero-vue'
// 链接文字原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 16px">
    <AeroLink href="#">{{ t['link.internal'] }}</AeroLink>
    <AeroLink href="https://github.com/FanXingYiDianYun/aero-vue" external>{{ t['link.external'] }}</AeroLink>
    <AeroLink disabled>{{ t['link.disabled'] }}</AeroLink>
  </div>
</template>
