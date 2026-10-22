<script setup lang="ts">
/**
 * PullToRefresh 下拉刷新 —— 复刻 demo #ptrZone
 * 列表滚动至顶时按住下拉：指示器跟手 + 旋转；>46px 释放触发刷新；
 * 刷新 1.3s 完成后条目交错淡入。
 */
import { onBeforeUnmount, onMounted, ref, type VNode } from 'vue'
import { usePointerDrag } from '../../../composables'

export interface AeroPtrItem {
  /** 图标名（内置 ptr 图标集） */
  icon?: 'rocket' | 'git-branch' | 'trending-up' | 'rotate-ccw' | 'key-round' | 'check'
  title: string
  desc?: string
  time?: string
}

const props = withDefaults(
  defineProps<{
    items: AeroPtrItem[]
    /** 刷新模拟时长 ms */
    duration?: number
    /** 下拉阻尼（0-1） */
    damping?: number
    /** 容器宽度（px 或 CSS 值） */
    width?: number | string
    /** 容器高度（px 或 CSS 值） */
    height?: number | string
  }>(),
  { duration: 1300, damping: 0.55 },
)

const emit = defineEmits<{ (e: 'refresh'): void }>()

const zone = ref<HTMLElement>()
const ind = ref<HTMLElement>()
const list = ref<HTMLElement>()

let y0 = 0
let refreshing = false
let atTop = true

function onScroll() {
  if (list.value) atTop = list.value.scrollTop <= 2
}

// —— 触摸端原生 touch 事件（passive:false）——
// PointerEvent 在移动端触摸序列里会被浏览器优先用于纵向 pan（滚动 __list），
// JS 侧 pointermove 拿不到净位移；改用原生 touchstart/touchmove/touchend
// 并在 touchmove 阶段 preventDefault 阻止浏览器接管，pull 位移才可靠。
let touchPulling = false
let touchY0 = 0

function onTouchStart(e: TouchEvent) {
  if (!atTop || refreshing) return
  touchPulling = true
  touchY0 = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  if (!touchPulling || !ind.value || !list.value) return
  const dy = e.touches[0].clientY - touchY0
  if (dy <= 0) {
    list.value.style.transform = ''
    ind.value.style.transform = 'translate(-50%, -46px)'
    return
  }
  // 阻止浏览器纵向滚动接管（passive:false 才允许 preventDefault）
  e.preventDefault()
  const d = Math.min(76, dy * props.damping)
  list.value.style.transform = `translateY(${d}px)`
  ind.value.style.transform = `translate(-50%, ${-46 + d}px) rotate(${d * 4}deg)`
}

function onTouchEnd() {
  if (!touchPulling || !ind.value || !list.value) return
  touchPulling = false
  const dy = matrixY()
  if (dy > 46) {
    refreshing = true
    ind.value.classList.add('spin')
    ind.value.style.transform = 'translate(-50%, 14px)'
    list.value.style.transform = 'translateY(52px)'
    emit('refresh')
    setTimeout(() => {
      if (!ind.value || !list.value) return
      ind.value.classList.remove('spin')
      ind.value.style.transform = 'translate(-50%, -46px)'
      list.value.style.transform = ''
      refreshing = false
      const els = list.value.querySelectorAll('.aero-ptr__item')
      els.forEach((it, i) => {
        ;(it as HTMLElement).animate(
          [{ opacity: 0.3 }, { opacity: 1 }],
          { duration: 400, delay: i * 60, easing: 'ease-out' },
        )
      })
    }, props.duration)
  } else {
    list.value.style.transform = ''
    ind.value.style.transform = 'translate(-50%, -46px)'
  }
}

function onDown(e: PointerEvent) {
  // 触摸端走原生 touch 事件（onTouchStart/Move/End），pointer 事件仅处理鼠标
  if (e.pointerType === 'touch') return
  if (!atTop || refreshing) return
  y0 = e.clientY
  startDrag(list.value, e)
}

function onDragMove(e: PointerEvent) {
  if (!ind.value || !list.value) return
  const dy = e.clientY - y0
  if (dy <= 0) {
    list.value.style.transform = ''
    ind.value.style.transform = 'translate(-50%, -46px)'
    return
  }
  const d = Math.min(76, dy * props.damping)
  list.value.style.transform = `translateY(${d}px)`
  ind.value.style.transform = `translate(-50%, ${-46 + d}px) rotate(${d * 4}deg)`
}

function matrixY(): number {
  if (!list.value) return 0
  const tr = getComputedStyle(list.value).transform
  return tr && tr !== 'none' ? new DOMMatrixReadOnly(tr).f : 0
}

function end() {
  if (!ind.value || !list.value) return
  // 恢复内部滚动（onDown 时触摸端临时锁定）
  list.value.style.overflowY = ''
  const dy = matrixY()
  if (dy > 46) {
    refreshing = true
    ind.value.classList.add('spin')
    ind.value.style.transform = 'translate(-50%, 14px)'
    list.value.style.transform = 'translateY(52px)'
    emit('refresh')
    setTimeout(() => {
      if (!ind.value || !list.value) return
      ind.value.classList.remove('spin')
      ind.value.style.transform = 'translate(-50%, -46px)'
      list.value.style.transform = ''
      refreshing = false
      const els = list.value.querySelectorAll('.aero-ptr__item')
      els.forEach((it, i) => {
        ;(it as HTMLElement).animate(
          [{ opacity: 0.3 }, { opacity: 1 }],
          { duration: 400, delay: i * 60, easing: 'ease-out' },
        )
      })
    }, props.duration)
  } else {
    if (list.value) list.value.style.transform = ''
    if (ind.value) ind.value.style.transform = 'translate(-50%, -46px)'
  }
}

// 鼠标端拖拽骨架收敛到 usePointerDrag（触摸端仍走原生 touch 序列）
const { startDrag } = usePointerDrag(onDragMove, { onEnd: end })

const iconD: Record<string, string> = {
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z|m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z|M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0|M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  'git-branch': 'M6 3v12|M18 9a9 9 0 0 1-9 9|M15 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6|M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  'trending-up': 'M16 7h6v6|m22 7-8.5 8.5-5-5L2 17',
  'rotate-cw': 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8|M21 3v5h-5',
  'rotate-ccw': 'M3 12a9 9 0 1 0 3-6.7|M3 4v5h5',
  'key-round': 'M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z|M17.5 7.5a1 1 0 1 0 0-.01',
  check: 'M20 6 9 12l-5 5',
}

const paths = (name?: string) => (name ? (iconD[name] ?? iconD.rocket).split('|') : iconD['rotate-cw'].split('|'))

// 非 passive 绑定 pointerdown（鼠标；move/up 由 usePointerDrag 接管）+ touchstart/touchmove（触摸）
onMounted(() => {
  list.value?.addEventListener('pointerdown', onDown, { passive: false })
  list.value?.addEventListener('touchstart', onTouchStart, { passive: true })
  list.value?.addEventListener('touchmove', onTouchMove, { passive: false })
  list.value?.addEventListener('touchend', onTouchEnd, { passive: true })
  list.value?.addEventListener('touchcancel', onTouchEnd, { passive: true })
})
onBeforeUnmount(() => {
  const l = list.value
  if (!l) return
  l.removeEventListener('pointerdown', onDown)
  l.removeEventListener('touchstart', onTouchStart)
  l.removeEventListener('touchmove', onTouchMove)
  l.removeEventListener('touchend', onTouchEnd)
  l.removeEventListener('touchcancel', onTouchEnd)
})
</script>

<template>
  <div ref="zone" class="aero-ptr" :style="{ width: width ? (typeof width === 'number' ? width + 'px' : width) : undefined, height: height ? (typeof height === 'number' ? height + 'px' : height) : undefined }">
    <div ref="ind" class="aero-ptr__ind">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path v-for="(d, i) in paths()" :key="i" :d="d" />
      </svg>
    </div>
    <div
      ref="list"
      class="aero-ptr__list"
      @scroll.passive="onScroll"
    >
      <div v-for="(it, i) in items" :key="i" class="aero-ptr__item">
        <span class="aero-ptr__ic">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path v-for="(d, j) in paths(it.icon)" :key="j" :d="d" />
          </svg>
        </span>
        <div>
          <b>{{ it.title }}</b>
          <small v-if="it.desc">{{ it.desc }}</small>
        </div>
        <span v-if="it.time" class="aero-ptr__time">{{ it.time }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-ptr {
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin: 6px 16px 10px;
  overflow: hidden;
  /* 外层 zone：完全禁用浏览器触摸手势（纵向/横向/缩放），
     内部 __list 在 pull 态由 JS 驱动 translateY，
     非 pull 态保持 overflow-y:auto 正常滚动 */
  touch-action: none;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;

  &__ind {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translate(-50%, -46px);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--ui-card);
    border: 2px solid var(--ui-brand);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-brand-ink);
    z-index: 5;
    transition: transform 0.3s var(--ui-spring);

    &.spin svg {
      animation: aero-ptr-spin 0.8s linear infinite;
    }
  }

  &__list {
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 18px;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    transition: transform 0.3s var(--ui-spring);
  }

  &__item {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px;
    border-radius: 11px;

    &:hover { background: var(--ui-bg-soft); }

    b {
      font-size: 12.5px;
      display: block;
    }

    small {
      font-size: 10.5px;
      color: var(--ui-ink-3);
      font-family: var(--ui-font-mono);
    }
  }

  &__ic {
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: var(--ui-bg-tint);
    border: 2px solid var(--ui-line-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-brand-ink);
    flex: none;
  }

  &__time {
    margin-left: auto;
    font-size: 10.5px;
    color: var(--ui-ink-3);
    font-family: var(--ui-font-mono);
  }
}

@keyframes aero-ptr-spin {
  to { transform: rotate(360deg); }
}
</style>
