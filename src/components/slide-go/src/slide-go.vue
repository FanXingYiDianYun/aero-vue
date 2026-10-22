<script setup lang="ts">
/**
 * SlideGo 滑动解锁 —— 复刻 demo .slide-go
 * 拖动旋钮到最右侧完成；fill 填充跟随；完成时 squish + done 色反转；
 * 1.4s 后自动回位。done 事件触发时把旋钮中心坐标传给礼花层。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：提示/完成文案缺省与滑轨 aria 走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { slideGo: slideGoLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 提示文案（缺省取词包 slideGo.text） */
    text?: string
    /** 完成提示文案（缺省取词包 slideGo.done） */
    doneText?: string
    /** 宽度（px 或 CSS 值） */
    width?: number | string
    /** 完成后 600ms 动画回位 + 重置一次性锁，允许再次滑动；
 * 默认 false（保持一次性行为），为 true 时 pointerdown/unmount 清除定时器 */
    autoReset?: boolean
  }>(),
  { text: undefined, doneText: undefined, autoReset: false },
)

const textValue = computed(() => props.text ?? slideGoLabels.value.text)
const doneTextValue = computed(() => props.doneText ?? slideGoLabels.value.done)

const emit = defineEmits<{ (e: 'done'): void }>()

const root = ref<HTMLElement>()
const knob = ref<HTMLElement>()
const fill = ref<HTMLElement>()
const done = ref(false)
const dragging = ref(false)

let x0 = 0
const max = () => (root.value?.clientWidth ?? 0) - (knob.value?.offsetWidth ?? 0) - 8

function upd(dx: number) {
  const v = Math.max(0, Math.min(max(), dx))
  if (knob.value) knob.value.style.transform = `translateX(${v}px)`
  if (fill.value) fill.value.style.transform = `scaleX(${v / max()})`
  return v / max()
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）
// doneFired 一次性闭锁：每个手势内到达末尾只 emit 一次 done；
// 后续 pointermove 持续在末尾不重触发；pointerdown（新手势）复位
let doneFired = false
// autoReset 定时器——完成后 600ms 回位 + 重置 doneFired；
// pointerdown / unmount 时清除，防止悬空定时器
let resetTimer: ReturnType<typeof setTimeout> | undefined

const { startDrag } = usePointerDrag(
  (e) => {
    const p = upd(e.clientX - x0)
    if (p >= 0.96 && !doneFired) {
      doneFired = true
      complete()
    }
  },
  {
    onEnd: () => {
      const tr = knob.value ? getComputedStyle(knob.value).transform : ''
      const dx = tr && tr !== 'none' ? new DOMMatrixReadOnly(tr).m41 : 0
      if (dx < max() * 0.96) {
        if (knob.value) knob.value.style.transition = 'transform .4s cubic-bezier(.3,1.4,.4,1)'
        upd(0)
        setTimeout(() => knob.value?.style.removeProperty('transition'), 420)
      }
    },
  },
)

function onDown(e: PointerEvent) {
  if (done.value) return
  dragging.value = true
  doneFired = false
  // 新手势开始时清除待执行的 autoReset 定时器
  clearTimeout(resetTimer)
  resetTimer = undefined
  x0 = e.clientX
  startDrag(e.currentTarget as HTMLElement, e)
}

function complete() {
  dragging.value = false
  done.value = true
  emit('done')
  if (props.autoReset) {
    // 完成后 600ms 动画回位 + 重置一次性锁
    resetTimer = setTimeout(() => {
      done.value = false
      doneFired = false
      if (knob.value) knob.value.style.transition = 'transform .45s cubic-bezier(.3,1.4,.4,1)'
      upd(0)
      setTimeout(() => knob.value?.style.removeProperty('transition'), 480)
      resetTimer = undefined
    }, 600)
  } else {
    setTimeout(() => {
      done.value = false
      if (knob.value) knob.value.style.transition = 'transform .45s cubic-bezier(.3,1.4,.4,1)'
      upd(0)
      setTimeout(() => knob.value?.style.removeProperty('transition'), 480)
    }, 1400)
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); complete() }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  // unmount 时清除 autoReset 定时器
  clearTimeout(resetTimer)
  resetTimer = undefined
})
</script>

<template>
  <div
    ref="root"
    class="aero-slidego"
    :class="{ dragging, done, check: done }"
    :style="width ? { width: typeof width === 'number' ? width + 'px' : width } : undefined"
    role="slider"
    tabindex="0"
    :aria-label="slideGoLabels.aria"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div ref="fill" class="aero-slidego__fill" />
    <div class="aero-slidego__txt">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" />
      </svg>
      {{ done ? doneTextValue : textValue }}
    </div>
    <div
      ref="knob"
      class="aero-slidego__knob"
      @pointerdown="onDown"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-slidego {
  box-sizing: border-box;
  margin: 12px 16px;
  position: relative;
  height: 58px;
  border-radius: 99px;
  background: var(--ui-bg-tint);
  border: 2px solid var(--ui-line-2);
  overflow: hidden;
  user-select: none;
  touch-action: none;
  outline: none;

  &:focus-visible {
    box-shadow: var(--ui-focus-ring);
  }

  &.done .aero-slidego__txt { color: var(--ui-on-brand); }

  &.check { animation: aero-slidego-squish 0.5s var(--ui-spring); }

  &__fill {
    position: absolute;
    inset: 0;
    background: var(--ui-brand);
    border-radius: 99px;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.08s linear;
  }

  &__txt {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 700;
    color: var(--ui-brand-ink);
    letter-spacing: 0.06em;
    pointer-events: none;
    transition: opacity 0.2s, color 0.2s;
    z-index: 2;

    svg { animation: aero-slidego-wiggle 2s infinite; }
  }

  &__knob {
    box-sizing: border-box;
    position: absolute;
    top: 4px;
    left: 4px;
    width: 50px;
    height: 48px;
    border-radius: 50%;
    background: var(--ui-card);
    border: 2px solid var(--ui-brand);
    box-shadow: 2.5px 2.5px 0 var(--ui-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-brand-ink);
    cursor: grab;
    z-index: 3;
    touch-action: none;
  }

  &.dragging .aero-slidego__knob { cursor: grabbing; }
}

@keyframes aero-slidego-wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
@keyframes aero-slidego-squish {
  0% { transform: scale(1); }
  40% { transform: scale(1.06, 0.92); }
  100% { transform: scale(1); }
}
</style>
