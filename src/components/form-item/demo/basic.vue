<script setup lang="ts">
import { AeroFormItem, useLocale } from 'aero-vue'
import { AeroInput } from 'aero-vue'
import { AeroTextarea } from 'aero-vue'
// label/提示/错误文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 20px; max-width: 480px; width: 100%">
    <AeroFormItem :label="t['formItem.nameLabel']" required :hint="t['formItem.requiredHint']">
      <AeroInput :placeholder="t['formItem.namePlaceholder']" />
    </AeroFormItem>
    <AeroFormItem :label="t['formItem.noteLabel']" :error="t['formItem.noteError']">
      <AeroTextarea :placeholder="t['formItem.notePlaceholder']" />
    </AeroFormItem>
  </div>
</template>
