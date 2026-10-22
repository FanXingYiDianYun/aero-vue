<script setup lang="ts">
import { iconPaths, type AeroIconName } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：关闭钮 aria 走词包（ConfigProvider locale 注入）
const { notification: notiLabels } = useLocale()

interface Item {
  id: number
  type?: 'success' | 'error' | 'warn' | 'info'
  title: string
  message?: string
  duration?: number
}

defineProps<{
  /** 待展示的通知列表（由调用方管理生命周期） */
  list: Item[]
}>()

const emit = defineEmits<{
  /** 点击某条通知关闭按钮时触发 */
  (e: 'close', id: number): void
}>()

const iconMap: Record<string, AeroIconName> = {
  success: 'circle-check',
  error: 'circle-x',
  warn: 'triangle-alert',
  info: 'bell',
}
</script>

<template>
  <Teleport to="body">
    <div class="aero-noti-host">
      <div v-for="n in list" :key="n.id" class="aero-noti" :class="`is-${n.type ?? 'info'}`" role="alert">
        <svg class="aero-noti__ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths[iconMap[n.type ?? 'info']] ?? []" :key="i" :d="d" />
        </svg>
        <div class="aero-noti__body">
          <b class="aero-noti__title">{{ n.title }}</b>
          <p v-if="n.message" class="aero-noti__msg">{{ n.message }}</p>
        </div>
        <button class="aero-noti__close" type="button" :aria-label="notiLabels.closeAria" @click="emit('close', n.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style>
.aero-noti-host {
  box-sizing: border-box;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: calc(var(--ui-z-toast) + 5);
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  pointer-events: none;
}

.aero-noti {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--ui-card);
  border: 2px solid var(--ui-line-2);
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: var(--ui-shadow-md);
  pointer-events: auto;
  min-width: 300px;
  max-width: min(460px, calc(100vw - 40px));
  animation: aero-noti-in 0.45s var(--ui-spring);
}

.aero-noti__ic {
  flex: none;
  margin-top: 1px;
}
.aero-noti__title {
  font-size: 14.5px;
  color: var(--ui-ink);
  display: block;
}
.aero-noti__msg {
  font-size: 13px;
  color: var(--ui-ink-2);
  margin: 3px 0 0;
  line-height: 1.6;
}
.aero-noti__close {
  margin-left: auto;
  background: none;
  border: 0;
  color: var(--ui-ink-3);
  display: flex;
  cursor: pointer;
  padding: 2px;
  transition: color 0.2s, transform 0.2s;
}
.aero-noti__close:hover {
  color: var(--ui-ink);
  transform: rotate(90deg);
}
.aero-noti.is-success .aero-noti__ic { color: var(--ui-ok); }
.aero-noti.is-error .aero-noti__ic { color: var(--ui-err); }
.aero-noti.is-warn .aero-noti__ic { color: var(--ui-warn); }
.aero-noti.is-info .aero-noti__ic { color: var(--ui-brand-ink); }

@keyframes aero-noti-in {
  from {
    opacity: 0;
    transform: translateY(-18px) scale(0.94) rotate(-1deg);
  }
}
</style>
