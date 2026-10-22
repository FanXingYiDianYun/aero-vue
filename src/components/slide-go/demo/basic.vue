<script setup lang="ts">
import { AeroSlideGo, AeroToast, useLocale } from 'aero-vue'
// toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

function onDone() {
  AeroToast.success(t.value['slideGo.done'], { title: t.value['slideGo.title'] })
}
</script>

<template>
  <AeroSlideGo :width="280" @done="onDone" />
</template>
