<script setup lang="ts">
import { ref } from 'vue'
import { AeroCheckboxGroup } from 'aero-vue'
import { AeroCheckbox } from 'aero-vue'

const arr = ref<string[]>((['vue']))
</script>

<template>
  <AeroCheckboxGroup v-model="arr">
    <AeroCheckbox value="vue">Vue</AeroCheckbox>
    <AeroCheckbox value="vite">Vite</AeroCheckbox>
    <AeroCheckbox value="ts">TypeScript</AeroCheckbox>
  </AeroCheckboxGroup>
</template>
