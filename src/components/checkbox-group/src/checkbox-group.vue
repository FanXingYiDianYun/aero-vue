<script setup lang="ts">
import { computed, provide } from 'vue'

const props = defineProps<{
  /** 已勾选的 value 集合（v-model） */
  modelValue: (string | number)[]
  /** 是否禁用组内所有选项（默认：false） */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /** 勾选变化时同步 v-model */
  (e: 'update:modelValue', v: (string | number)[]): void
  /** 勾选变化时触发 */
  (e: 'change', v: (string | number)[]): void
}>()

const values = computed(() => props.modelValue)

provide('AeroCheckboxGroup', {
  values,
  disabled: computed(() => !!props.disabled),
  toggle(v: string | number) {
    const arr = [...props.modelValue]
    const i = arr.indexOf(v)
    if (i >= 0) arr.splice(i, 1)
    else arr.push(v)
    emit('update:modelValue', arr)
    emit('change', arr)
  },
})
</script>

<template>
  <div class="aero-check-group">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.aero-check-group {
  box-sizing: border-box;
  display: inline-flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
