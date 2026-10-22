<script setup lang="ts">
const props = defineProps<{
  label?: string
  /** 必填标记（红*） */
  required?: boolean
  /** 提示文字 */
  hint?: string
  /** 错误文字（设置即错误态） */
  error?: string
}>()
</script>

<template>
  <div class="aero-field" :class="{ 'is-error': !!error }">
    <label v-if="label" class="aero-field__label">
      {{ label }}<i v-if="required" class="aero-field__req">*</i>
    </label>
    <slot />
    <p v-if="error" class="aero-field__hint is-error">{{ error }}</p>
    <p v-else-if="hint" class="aero-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.aero-field {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 230px;
  flex: 1;

  &__label {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ui-ink);
    .aero-field__req {
      color: var(--ui-err);
      font-style: normal;
      margin-left: 2px;
    }
  }
  &__hint {
    font-size: 12.5px;
    color: var(--ui-ink-3);
    margin: 0;
    &.is-error {
      color: var(--ui-err);
      font-weight: 600;
    }
  }
}
</style>
