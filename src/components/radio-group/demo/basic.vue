<script setup lang="ts">
import { ref } from 'vue'
import { AeroRadioGroup, useLocale } from 'aero-vue'
import { AeroRadio } from 'aero-vue'
// 选项文字原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const v = ref('a')
</script>

<template>
  <AeroRadioGroup v-model="v">
    <AeroRadio value="a">{{ t['radioGroup.optA'] }}</AeroRadio>
    <AeroRadio value="b">{{ t['radioGroup.optB'] }}</AeroRadio>
    <AeroRadio value="c">{{ t['radioGroup.optC'] }}</AeroRadio>
  </AeroRadioGroup>
</template>
