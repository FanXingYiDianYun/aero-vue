<script setup lang="ts">
import { computed, provide } from 'vue'

const props = defineProps<{
  /** 当前选中项的 value（v-model，未选时为 undefined） */
  modelValue?: string | number
  /** 是否禁用组内所有选项（默认：false） */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /** 选中项变化时同步 v-model */
  (e: 'update:modelValue', v: string | number): void
  /** 选中项变化时触发 */
  (e: 'change', v: string | number): void
}>()

provide('AeroRadioGroup', {
  value: computed(() => props.modelValue),
  disabled: computed(() => !!props.disabled),
  pick(v: string | number) {
    emit('update:modelValue', v)
    emit('change', v)
  },
})
</script>

<template>
  <div class="aero-radio-group" role="radiogroup">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.aero-radio-group {
  box-sizing: border-box;
  display: inline-flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
