<script setup lang="ts">
import { ref } from 'vue'
import { AeroInput, useLocale } from 'aero-vue'
// placeholder/校验文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const v = ref('')
const err = ref('')
function onBlur() {
  err.value = v.value ? '' : t.value['input.required']
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px; max-width: 300px">
    <AeroInput v-model="v" :placeholder="t['input.basicPlaceholder']" clearable />
    <AeroInput v-model="v" prefix="npm install" :placeholder="t['input.prefixPlaceholder']" />
    <AeroInput v-model="v" :placeholder="t['input.errorPlaceholder']" :error="!!err" @blur="onBlur" />
    <AeroInput :placeholder="t['input.disabledPlaceholder']" disabled :model-value="t['input.disabledValue']" />
  </div>
</template>
