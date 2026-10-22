<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 水平/垂直 */
    vertical?: boolean
    /** 虚线样式（demo 页脚同款 dashed） */
    dashed?: boolean
    /** 分隔文案 */
    title?: string
  }>(),
  { vertical: false, dashed: false },
)
</script>

<template>
  <div
    v-if="$props.vertical"
    class="aero-divider aero-divider--vertical"
    :class="{ 'is-dashed': $props.dashed }"
  />
  <div v-else class="aero-divider" :class="{ 'is-dashed': $props.dashed }">
    <span v-if="$props.title" class="aero-divider__title">{{ $props.title }}</span>
  </div>
</template>

<style scoped lang="scss">
.aero-divider {
  box-sizing: border-box;
  width: 100%;
  border-top: 2px solid var(--ui-line-2);
  position: relative;
  margin: 14px 0;

  &.is-dashed {
    border-top-style: dashed;
  }

  &__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--ui-bg);
    padding: 0 14px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ui-ink-3);
    letter-spacing: 0.08em;
    font-family: var(--ui-font-en);
    text-transform: uppercase;
  }

  &--vertical {
    width: 2px;
    height: 100%;
    min-height: 1.2em;
    margin: 0 14px;
    border-top: 0;
    border-left: 2px solid var(--ui-line-2);
    &.is-dashed {
      border-left-style: dashed;
    }
  }
}
</style>
