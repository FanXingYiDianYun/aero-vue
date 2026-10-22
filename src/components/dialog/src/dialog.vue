<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useLocale } from '../../../locale'

// i18n：未传 title 时 aria-label 回落走词包（ConfigProvider locale 注入）
const { dialog: dialogLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    width?: string
    /** 点击遮罩关闭（默认开） */
    maskClosable?: boolean
    /** 毛玻璃遮罩（GPU 门控） */
    blurMask?: boolean
  }>(),
  { maskClosable: true, blurMask: true, width: '480px' },
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

function onMask() {
  if (props.maskClosable) close()
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

/** 焦点圈：打开时聚焦首个可聚焦元素，Tab 循环困在面板内 */
function focusFirst() {
  const el = panel.value
  if (!el) return
  const focusable = el.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  focusable?.focus()
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
    <transition name="aero-modal-mask">
      <div
        v-if="modelValue"
        class="aero-modal-mask"
        :class="{ 'has-blur': blurMask }"
        @click.self="onMask"
      >
        <div ref="panel" class="aero-modal" :style="{ maxWidth: width }" role="dialog" aria-modal="true" :aria-label="title || dialogLabels.label">
          <slot name="header">
            <h3 v-if="title">{{ title }}</h3>
          </slot>
          <div class="aero-modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="aero-modal__foot">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.aero-modal-mask {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  background: rgba(7, 20, 33, 0.55);
  backdrop-filter: var(--ui-blur-mask);
  z-index: var(--ui-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;

  &.has-blur {
    backdrop-filter: var(--ui-blur-mask);
  }
}

.aero-modal {
  background: var(--ui-card);
  border: 2px solid var(--ui-line);
  border-radius: 22px;
  max-width: 480px;
  width: 100%;
  padding: 30px;
  box-shadow: var(--ui-shadow-xl-brand);

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: var(--ui-ink);
  }
  &__body {
    color: var(--ui-ink-2);
    font-size: 14.5px;
    line-height: 1.7;
  }
  &__foot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
  }
}

// —— 过渡 ——
.aero-modal-mask-enter-active {
  transition: opacity 0.3s;
  .aero-modal {
    transition: transform 0.4s var(--ui-spring);
  }
}
.aero-modal-mask-leave-active {
  transition: opacity 0.25s;
  .aero-modal {
    transition: transform 0.25s var(--ui-ease);
  }
}
.aero-modal-mask-enter-from,
.aero-modal-mask-leave-to {
  opacity: 0;
  .aero-modal {
    transform: scale(0.85) translateY(16px) rotate(-1deg);
  }
}
</style>
