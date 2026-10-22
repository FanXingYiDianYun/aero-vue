<script setup lang="ts">
import { ref } from 'vue'
import { useClickOutside } from '../../../composables'
import { iconPaths } from '../../icon/src/paths'
import type { AeroDropdownItem } from './dropdown.types'

defineProps<{
  items: AeroDropdownItem[]
  /** 触发器插槽内容 */
  align?: 'left' | 'right'
}>()

const emit = defineEmits<{
  (e: 'select', item: AeroDropdownItem): void
}>()

const root = ref<HTMLElement>()
const open = ref(false)
useClickOutside(
  () => root.value,
  () => (open.value = false),
)

function pick(it: AeroDropdownItem) {
  if (it.disabled) return
  open.value = false
  emit('select', it)
}
</script>

<template>
  <div ref="root" class="aero-dropdown" :class="{ 'is-open': open, 'is-right': align !== 'left' }">
    <span class="aero-dropdown__trigger" @click="open = !open"><slot /></span>
    <transition name="aero-drop">
      <div v-if="open" class="aero-dropdown__menu">
        <template v-for="it in items" :key="it.key">
          <hr v-if="it.divided" class="aero-dropdown__sep" />
          <button
            type="button"
            class="aero-dropdown__item"
            :class="{ 'is-disabled': it.disabled, 'is-danger': it.danger }"
            :disabled="it.disabled"
            @click="pick(it)"
          >
            <svg v-if="it.icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths[it.icon] ?? []" :key="i" :d="d" />
            </svg>
            <span class="aero-dropdown__text">
              {{ it.label }}
              <small v-if="it.desc">{{ it.desc }}</small>
            </span>
          </button>
        </template>
        <slot name="menu" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-dropdown {
  box-sizing: border-box;
  position: relative;

  &__trigger {
    display: inline-flex;
    cursor: pointer;
  }

  &__menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 16px;
    min-width: 250px;
    padding: 8px;
    box-shadow: var(--ui-shadow-md);
    z-index: calc(var(--ui-z-pop) - 200);
    transform-origin: top right;
  }
  &.is-right &__menu {
    left: 0;
    right: auto;
    transform-origin: top left;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 12px;
    border-radius: var(--ui-radius-sm);
    font-size: 13.5px;
    font-weight: 500;
    width: 100%;
    background: none;
    border: 0;
    color: var(--ui-ink);
    text-align: left;
    transition: 0.15s;
    cursor: pointer;
    font-family: inherit;

    svg {
      color: var(--ui-brand-ink);
      flex: none;
    }
    &:hover {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
    &.is-danger {
      color: var(--ui-err);
      svg {
        color: var(--ui-err);
      }
    }
    &.is-disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
  &__text {
    small {
      display: block;
      color: var(--ui-ink-3);
      font-size: 12px;
      font-weight: 400;
    }
  }
  &__sep {
    height: 2px;
    background: var(--ui-line);
    margin: 7px 6px;
    border: 0;
  }
}

.aero-drop-enter-active,
.aero-drop-leave-active {
  transition: opacity 0.28s var(--ui-spring), transform 0.28s var(--ui-spring);
}
.aero-drop-enter-from,
.aero-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
