<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useClickOutside } from '../../../composables'

const props = withDefaults(
  defineProps<{
    /** 触发方式 */
    trigger?: 'hover' | 'click'
    /** 弹出方位 */
    placement?: 'top' | 'bottom' | 'right'
    /** 弹层标题 */
    title?: string
    /** 弹层最小宽度 */
    width?: number
    /** 受控显隐（不传则内部自控） */
    open?: boolean
  }>(),
  { trigger: 'hover', placement: 'bottom', width: 260, open: undefined },
)

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const inner = ref(false)
const visible = computed(() => (props.open !== undefined ? props.open : inner.value))
const root = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const pos = ref({ left: '0px', top: '0px' })

useClickOutside(
  () => root.value,
  () => {
    if (props.trigger === 'click') setOpen(false)
  },
)

function setOpen(v: boolean) {
  inner.value = v
  emit('update:open', v)
}

async function show() {
  setOpen(true)
  await nextTick()
  update()
}
function hide() {
  setOpen(false)
}
function toggle() {
  visible.value ? hide() : show()
}

function update() {
  const trg = root.value?.firstElementChild as HTMLElement | undefined
  const p = panel.value
  if (!trg || !p) return
  const r = trg.getBoundingClientRect()
  const pw = p.offsetWidth
  const ph = p.offsetHeight
  let left = r.left + r.width / 2 - pw / 2
  let top = r.bottom + 10
  if (props.placement === 'top') top = r.top - ph - 10
  if (props.placement === 'right') {
    left = r.right + 10
    top = r.top + r.height / 2 - ph / 2
  }
  left = Math.max(8, Math.min(window.innerWidth - pw - 8, left))
  pos.value = { left: left + 'px', top: top + 'px' }
}

function onMove() {
  if (visible.value) update()
}
onMounted(() => {
  window.addEventListener('scroll', onMove, { passive: true })
  window.addEventListener('resize', onMove)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onMove)
  window.removeEventListener('resize', onMove)
})
</script>

<template>
  <span
    ref="root"
    class="aero-popover-trigger"
    @mouseenter="trigger === 'hover' && show()"
    @mouseleave="trigger === 'hover' && hide()"
    @click="trigger === 'click' && toggle()"
  >
    <slot />
  </span>
  <Teleport to="body">
    <transition name="aero-popover">
      <div v-if="visible" ref="panel" class="aero-popover" :class="`is-${placement}`" :style="[pos, { minWidth: width + 'px' }]" role="dialog">
        <b v-if="title" class="aero-popover__title">{{ title }}</b>
        <div class="aero-popover__body"><slot name="content" /></div>
      </div>
    </transition>
  </Teleport>
</template>

<style>
.aero-popover {
  position: fixed;
  z-index: calc(var(--ui-z-pop) - 50);
  background: var(--ui-card);
  border: 2px solid var(--ui-line-2);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: var(--ui-shadow-md);
  max-width: min(320px, calc(100vw - 32px));
}

.aero-popover__title {
  display: block;
  font-size: 14.5px;
  margin-bottom: 6px;
  color: var(--ui-ink);
}
.aero-popover__body {
  font-size: 13.5px;
  color: var(--ui-ink-2);
  line-height: 1.65;
}
.aero-popover-enter-active,
.aero-popover-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-popover-enter-from,
.aero-popover-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.95);
}
</style>

<style scoped lang="scss">
.aero-popover-trigger {
  box-sizing: border-box;
  display: inline-flex;
}
</style>
