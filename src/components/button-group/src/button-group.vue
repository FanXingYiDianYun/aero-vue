<script setup lang="ts">
defineProps<{
  /** 垂直排列 */
  vertical?: boolean
}>()
</script>

<template>
  <div class="aero-btn-group" :class="{ 'is-vertical': $props.vertical }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.aero-btn-group {
  box-sizing: border-box;
  display: inline-flex;
  :deep(.aero-btn) {
    border-radius: 0;
    margin-left: -2px;
    &:first-child {
      border-radius: 12px 0 0 12px;
      margin-left: 0;
    }
    &:last-child {
      border-radius: 0 12px 12px 0;
    }
    &:only-child {
      border-radius: 14px;
    }
  }
  &.is-vertical {
    flex-direction: column;
    align-items: flex-start;
    :deep(.aero-btn) {
      margin-left: 0;
      margin-top: -2px;
      width: auto; // 防止被父容器 stretch 拉伸为全宽
      &:first-child {
        border-radius: 12px 12px 0 0;
        margin-top: 0;
      }
      &:last-child {
        border-radius: 0 0 12px 12px;
      }
      &:only-child {
        border-radius: 14px;
      }
    }
  }
}
</style>
