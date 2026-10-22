<script setup lang="ts">
import { ref } from 'vue'
import { AeroRadio } from 'aero-vue'
import { AeroRadioGroup } from 'aero-vue'

const v = ref('vue')
</script>

<template>
  <AeroRadioGroup v-model="v">
    <AeroRadio value="vue">Vue</AeroRadio>
    <AeroRadio value="react">React</AeroRadio>
    <AeroRadio value="svelte">Svelte</AeroRadio>
    <AeroRadio value="solid" disabled>Solid</AeroRadio>
  </AeroRadioGroup>
</template>
