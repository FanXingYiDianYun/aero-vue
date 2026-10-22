<script setup lang="ts">
import { iconPaths } from '../../icon/src/paths'

defineProps<{
  /** 可关闭 */
  closable?: boolean
  /** 选中态 */
  active?: boolean
}>()

const emit = defineEmits<{ (e: 'close', ev: MouseEvent): void }>()
</script>

<template>
  <span class="aero-chip" :class="{ 'is-active': $props.active }">
    <span class="aero-chip__label"><slot /></span>
    <button v-if="$props.closable" class="aero-chip__close" type="button" @click="emit('close', $event)">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path v-for="(d, i) in iconPaths['x']" :key="i" :d="d" />
      </svg>
    </button>
  </span>
</template>

<style scoped lang="scss">
.aero-chip {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 8px 6px 13px;
  background: var(--ui-bg-soft);
  border: 2px solid var(--ui-line);
  border-radius: var(--ui-radius-pill);
  font-size: 13.5px;
  font-weight: 500;
  transition: 0.25s;

  &:hover {
    border-color: var(--ui-brand);
    transform: translateY(-1px);
  }
  &.is-active {
    background: var(--ui-bg-tint);
    border-color: var(--ui-brand);
    color: var(--ui-brand-ink);
    font-weight: 700;
  }

  &__close {
    display: flex;
    border: 0;
    background: var(--ui-line);
    color: var(--ui-ink-2);
    border-radius: 50%;
    width: 19px;
    height: 19px;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    cursor: pointer;
    &:hover {
      background: var(--ui-err);
      color: var(--ui-on-ink);
      transform: rotate(90deg);
    }
  }
}
</style>
