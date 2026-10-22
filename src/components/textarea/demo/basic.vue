<script setup lang="ts">
import { ref } from 'vue'
import { AeroTextarea } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const v = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px; max-width: 320px">
    <AeroTextarea v-model="v" :placeholder="t['textarea.multiLine']" />
    <AeroTextarea v-model="v" :placeholder="t['textarea.withCount']" :maxlength="100" show-count />
  </div>
</template>
