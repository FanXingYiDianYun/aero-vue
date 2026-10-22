<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 提示文字 */
    content: string
    /** 显示方位 */
    placement?: 'top' | 'bottom'
  }>(),
  { placement: 'top' },
)

const visible = ref(false)
const pos = ref({ left: '0px', top: '0px' })
const below = ref(false)
const tipRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()

async function show() {
  visible.value = true
  await nextTick()
  update()
}
function hide() {
  visible.value = false
}
function update() {
  const tip = tipRef.value
  const trg = triggerRef.value?.firstElementChild as HTMLElement | null
  if (!tip || !trg) return
  const r = trg.getBoundingClientRect()
  const tw = tip.offsetWidth
  const th = tip.offsetHeight
  let left = r.left + r.width / 2 - tw / 2
  let top = r.top - th - 8
  below.value = false
  if (props.placement === 'bottom' || top < 8) {
    top = r.bottom + 8
    below.value = true
  }
  left = Math.max(8, Math.min(window.innerWidth - tw - 8, left))
  pos.value = { left: left + 'px', top: top + 'px' }
}

function onScroll() {
  if (visible.value) update()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <span ref="triggerRef" class="aero-tip-trigger" @mouseenter="show" @mouseleave="hide" @focusin="show" @focusout="hide">
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="tipRef"
      class="aero-tip"
      :class="{ 'is-below': below }"
      :style="pos"
      role="tooltip"
    >{{ content }}</div>
  </Teleport>
</template>

<style>
.aero-tip {
  position: fixed;
  z-index: var(--ui-z-tip);
  background: var(--ui-ink);
  color: var(--ui-bg);
  font-size: 12.5px;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: 11px;
  pointer-events: none;
  animation: ui-tip-in 0.22s var(--ui-spring);
  white-space: nowrap;
  box-shadow: var(--ui-shadow-soft);
  max-width: 280px;
}
.aero-tip::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
  border: 5.5px solid transparent;
  border-top-color: var(--ui-ink);
  border-bottom: 0;
}
.aero-tip.is-below::after {
  bottom: auto;
  top: -5px;
  border-top: 0;
  border-bottom-color: var(--ui-ink);
}
@keyframes ui-tip-in {
  from {
    opacity: 0;
    transform: translateY(5px) scale(0.92);
  }
}
</style>

<style scoped lang="scss">
.aero-tip-trigger {
  box-sizing: border-box;
  display: inline-flex;
}
</style>
