<script setup lang="ts">
import { ref } from 'vue'
import { AeroOTP, AeroToast, useLocale } from 'aero-vue'
// toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const code = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <AeroOTP v-model="code" @complete="(v) => AeroToast.success(`${t['otp.codeLabel']}${v}`)" />
    <span style="font-size: 12.5px; color: var(--ui-ink-3); font-family: var(--ui-font-mono)">value = {{ code || '…' }}</span>
  </div>
</template>
