<script setup lang="ts">
import { AeroBreadcrumb, useLocale } from 'aero-vue'
// 前两级 label 原硬编码中文 → 走词包 demo 组（'Breadcrumb' 为英文数据，保留）
const { demo } = useLocale()
const t = demo
</script>

<template>
  <AeroBreadcrumb
    :items="[
      { label: t['breadcrumb.home'], href: '#' },
      { label: t['breadcrumb.components'], href: '#' },
      { label: 'Breadcrumb' },
    ]"
  />
</template>
