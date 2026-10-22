<script setup lang="ts">
import { ref } from 'vue'
import { AeroMobileTabBar, useLocale } from 'aero-vue'
// 底部标签 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const act = ref(0)
</script>

<template>
  <div style="width: 300px">
    <AeroMobileTabBar
      v-model="act"
      :items="[
        { icon: 'home', label: t['mobileTabBar.home'] },
        { icon: 'rocket', label: t['mobileTabBar.deploy'] },
        { icon: 'activity', label: t['mobileTabBar.monitor'] },
        { icon: 'user', label: t['mobileTabBar.my'] },
      ]"
    />
  </div>
</template>
