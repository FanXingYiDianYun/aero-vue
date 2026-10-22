<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useLocale } from '../../../locale'

// i18n：aria-label 回落与关闭钮 aria 走词包（ConfigProvider locale 注入）
const { drawer: drawerLabels, common: commonLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    /** 抽屉宽度 */
    width?: string
    /** 点击遮罩关闭（默认开） */
    maskClosable?: boolean
  }>(),
  { maskClosable: true, width: '400px' },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
}>()

const panel = ref<HTMLElement>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

/** 焦点圈：打开时聚焦关闭钮，Tab 困在抽屉内 */
function focusFirst() {
  panel.value?.querySelector<HTMLElement>('.aero-drawer__close')?.focus()
}
function onKeyTrap(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !panel.value) return
  const focusable = [...panel.value.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement
  if (e.shiftKey && active === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onEsc)
      document.addEventListener('keydown', onKeyTrap)
      requestAnimationFrame(focusFirst)
    } else {
      document.removeEventListener('keydown', onEsc)
      document.removeEventListener('keydown', onKeyTrap)
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.removeEventListener('keydown', onKeyTrap)
})
</script>

<template>
  <Teleport to="body">
    <transition name="aero-drawer-mask">
      <div v-if="modelValue" class="aero-drawer-mask" @click.self="maskClosable && close()">
        <aside ref="panel" class="aero-drawer" :style="{ width: `min(${width}, 92vw)` }" role="dialog" aria-modal="true" :aria-label="title || drawerLabels.label">
          <header class="aero-drawer__head">
            <h3>{{ title }}</h3>
            <button class="aero-drawer__close" type="button" @click="close" :aria-label="commonLabels.close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </header>
          <div class="aero-drawer__body"><slot /></div>
        </aside>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.aero-drawer-mask {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  background: rgba(7, 20, 33, 0.5);
  backdrop-filter: var(--ui-blur-mask);
  z-index: var(--ui-z-modal);
}

.aero-drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(400px, 92vw);
  background: var(--ui-card);
  border-left: 2px solid var(--ui-line);
  padding: 26px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    h3 {
      font-size: 19px;
      margin: 0;
      color: var(--ui-ink);
    }
  }
  &__close {
    background: none;
    border: 0;
    color: var(--ui-ink-3);
    display: flex;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
    &:hover {
      color: var(--ui-ink);
      transform: rotate(90deg);
    }
  }
}

.aero-drawer-mask-enter-active,
.aero-drawer-mask-leave-active {
  transition: opacity 0.3s;
  .aero-drawer {
    transition: transform 0.42s var(--ui-ease);
  }
}
.aero-drawer-mask-enter-from,
.aero-drawer-mask-leave-to {
  opacity: 0;
  .aero-drawer {
    transform: translateX(100%);
  }
}
</style>
