<script setup lang="ts">
import { iconPaths, type AeroIconName } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：关闭钮 aria 走词包（ConfigProvider locale 注入；Teleport 只移动 DOM，注入仍按组件树解析）
const { toast: toastLabels } = useLocale()

interface Item {
  id: number
  type?: 'success' | 'error' | 'warn' | 'info'
  title?: string
  message?: string
  duration?: number
}

const props = defineProps<{
  /** 待展示的 toast 列表（由调用方管理生命周期） */
  list: Item[]
  /** 全局默认展示时长（毫秒）（可选，单条 duration 优先） */
  duration?: number
}>()

const emit = defineEmits<{
  /** 单条 toast 离场动画结束后触发（用于调用方从列表移除） */
  (e: 'leave', id: number): void
}>()

const iconMap: Record<string, AeroIconName> = {
  success: 'circle-check',
  error: 'circle-x',
  warn: 'triangle-alert',
  info: 'info',
}

function dismiss(id: number) {
  const el = document.getElementById(`aero-toast-${id}`)
  el?.classList.add('is-out')
  setTimeout(() => emit('leave', id), 350)
}
</script>

<template>
  <Teleport to="body">
    <div class="aero-toasts">
      <div
        v-for="t in props.list"
        :id="`aero-toast-${t.id}`"
        :key="t.id"
        class="aero-toast"
        :class="`aero-toast--${t.type ?? 'info'}`"
        role="status"
      >
        <svg class="aero-toast__ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths[iconMap[t.type ?? 'info']] ?? []" :key="i" :d="d" />
        </svg>
        <div class="aero-toast__body">
          <b v-if="t.title" class="aero-toast__title">{{ t.title }}</b>
          <div v-if="t.message" class="aero-toast__msg">{{ t.message }}</div>
        </div>
        <button class="aero-toast__close" type="button" @click="dismiss(t.id)" :aria-label="toastLabels.closeAria">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
        <i class="aero-toast__bar" :style="{ animationDuration: (t.duration ?? 4200) + 'ms' }" @animationend="dismiss(t.id)" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.aero-toasts {
  box-sizing: border-box;
  position: fixed;
  top: 84px;
  right: 24px;
  z-index: var(--ui-z-toast);
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: min(370px, calc(100vw - 40px));
  pointer-events: none;
}

.aero-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--ui-card);
  border: 2px solid var(--ui-line);
  border-radius: 15px;
  padding: 14px 16px;
  box-shadow: var(--ui-shadow-md);
  animation: ui-toast-in 0.5s var(--ui-spring);
  position: relative;
  overflow: hidden;
  pointer-events: auto;

  &.is-out {
    opacity: 0;
    transform: translateX(50px);
    transition: 0.35s;
  }

  &__ic {
    flex: none;
    width: 20px;
    height: 20px;
    margin-top: 1px;
  }
  &.is-success .aero-toast__ic { color: var(--ui-ok); }
  &.is-error .aero-toast__ic { color: var(--ui-err); }
  &.is-warn .aero-toast__ic { color: var(--ui-warn); }
  &.is-info .aero-toast__ic { color: var(--ui-brand-ink); }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: var(--ui-ink);
  }
  &__msg {
    font-size: 13px;
    color: var(--ui-ink-2);
    line-height: 1.6;
  }
  &__close {
    margin-left: auto;
    background: none;
    border: 0;
    color: var(--ui-ink-3);
    display: flex;
    padding: 2px;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
    &:hover {
      color: var(--ui-ink);
      transform: rotate(90deg);
    }
  }
  &__bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 0;
    background: var(--ui-brand);
    animation: ui-tbar 4.2s linear forwards;
  }
}
</style>
