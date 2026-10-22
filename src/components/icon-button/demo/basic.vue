<script setup lang="ts">
import { AeroIconButton, useLocale } from 'aero-vue'
// aria label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 12px">
    <AeroIconButton icon="bell" dot :label="t['iconButton.notify']" />
    <AeroIconButton icon="sun" :label="t['iconButton.theme']" />
    <AeroIconButton icon="search" :label="t['iconButton.search']" />
    <AeroIconButton icon="menu" :label="t['iconButton.menu']" />
    <AeroIconButton icon="settings" disabled :label="t['iconButton.settings']" />
  </div>
</template>
