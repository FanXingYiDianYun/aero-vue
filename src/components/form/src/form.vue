<script setup lang="ts">
import { provide } from 'vue'

defineProps<{
  /** 提交处理：返回 false 或抛错则阻止 reset */
  submit?: () => void
}>()

const emit = defineEmits<{ (e: 'submit', ev: Event): void }>()

provide('AeroForm', { variant: 'default' })

function submit(e: Event) {
  e.preventDefault()
  emit('submit', e)
}
</script>

<template>
  <form class="aero-form" @submit="submit">
    <slot />
  </form>
</template>

<style scoped lang="scss">
.aero-form {
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}
</style>
