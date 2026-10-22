<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 最大高度 px（超出滚动） */
    maxHeight?: number | string
  }>(),
  { maxHeight: 260 },
)
</script>

<template>
  <div class="aero-scrollbar" :style="{ maxHeight: typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight }">
    <div class="aero-scrollbar__view"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.aero-scrollbar {
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-line-2) transparent;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--ui-line-2);
    border-radius: 99px;
    &:hover {
      background: var(--ui-brand);
    }
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
