<script setup lang="ts">
/**
 * Knob 拖动旋钮 —— 复刻 demo #knob
 * 270° 扫描弧（-135°起），atan2 角度换算，release 时 WAAPI 弹跳反馈。
 */
import { computed, onMounted, ref } from 'vue'
import { usePointerDrag } from '../../../composables'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    /** 中心单位文案 */
    unit?: string
  }>(),
  { modelValue: 8, min: 0, max: 16, step: 1, unit: 'CORES' },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const root = ref<HTMLElement>()
const arc = ref<SVGCircleElement>()
const val = ref(props.modelValue)

const R = 40
const C = 2 * Math.PI * R
const SWEEP = 270 / 360

const ratio = computed(() => (val.value - props.min) / (props.max - props.min))

function render() {
  if (arc.value) arc.value.style.strokeDashoffset = String(C * SWEEP * (1 - ratio.value))
}

/**
 * 将指针位置映射为 0..270° 扫描角。
 * 死区：指针位于扫描弧 90° 缺口（角度 270°~360°）内时返回 null，
 * 避免在缺口区域误触发值变更。
 */
function absAngle(e: PointerEvent): number | null {
  if (!root.value) return null
  const r = root.value.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  let ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 135
  ang = ((ang % 360) + 360) % 360
  if (ang > 270) return null // 在 90° 缺区内，不响应
  return ang
}

/** 取 360° 内最近方向的角增量 */
function angleDelta(prev: number, cur: number): number {
  let d = cur - prev
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}

/** 上一帧扫描角（0..270）；null = 尚未按下 */
let lastAng: number | null = null
/** 上一次的有效比率（0..1） */
let lastRatio = 0

function fromEvent(e: PointerEvent) {
  const cur = absAngle(e)
  if (cur === null) return // 缺区内，不变更值

  if (lastAng === null) {
    // 首次按下：直接定位
    lastAng = cur
    lastRatio = cur / 270
    val.value = Math.round(lastRatio * (props.max - props.min) / props.step) * props.step + props.min
  } else {
    // 后续帧：用增量累加，避免跨 270°→0° 边界时 cur 跳变导致反向
    const d = angleDelta(lastAng, cur)
    lastRatio = Math.max(0, Math.min(1, lastRatio + d / 270))
    lastAng = cur
    val.value = Math.round(lastRatio * (props.max - props.min) / props.step) * props.step + props.min
  }
  render()
  emit('update:modelValue', val.value)
  emit('change', val.value)
}

function onDown(e: PointerEvent) {
  const cur = absAngle(e)
  if (cur === null) return // 点在缺区，不启动拖拽
  lastAng = cur
  lastRatio = cur / 270
  root.value?.classList.add('drag')
  startDrag(root.value, e)
}

function end() {
  lastAng = null
  root.value?.classList.remove('drag')
  root.value?.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }],
    { duration: 280, easing: 'ease-out' },
  )
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）；触摸 preventDefault 由 composable 统一处理
const { startDrag } = usePointerDrag(fromEvent, { onEnd: end })

onMounted(() => {
  if (arc.value) arc.value.style.strokeDasharray = `${C * SWEEP} ${C}`
  render()
  // 触摸端：非 passive 绑定 touchstart，在浏览器接管滚动前阻止
  root.value?.addEventListener('touchstart', (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t || !root.value) return
    const r = root.value.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let ang = Math.atan2(t.clientY - cy, t.clientX - cx) * 180 / Math.PI + 135
    ang = ((ang % 360) + 360) % 360
    if (ang <= 270) e.preventDefault() // 在有效扫描区内，阻止页面滚动
  }, { passive: false })
})
</script>

<template>
  <div
    ref="root"
    class="aero-knob"
    role="slider"
    :aria-valuenow="val"
    :aria-valuemin="min"
    :aria-valuemax="max"
    tabindex="0"
    @pointerdown="onDown"
  >
    <svg viewBox="0 0 100 100">
      <circle class="aero-knob__track" cx="50" cy="50" r="40" />
      <circle ref="arc" class="aero-knob__arc" cx="50" cy="50" r="40" />
    </svg>
    <div class="aero-knob__c">
      <b>{{ val }}</b>
      <small>{{ unit }}</small>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-knob {
  box-sizing: border-box;
  width: 118px;
  height: 118px;
  position: relative;
  cursor: grab;
  flex: none;
  outline: none;
  /* 禁用浏览器触摸手势（滚动/缩放），确保拖拽事件不被识别为页面滑动 */
  touch-action: none;

  &:focus-visible {
    box-shadow: var(--ui-focus-ring);
    border-radius: 50%;
  }

  &.drag { cursor: grabbing; }

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-135deg);
  }

  &__track {
    fill: none;
    stroke: var(--ui-line);
    stroke-width: 9;
    stroke-linecap: round;
  }

  &__arc {
    fill: none;
    stroke: var(--ui-brand);
    stroke-width: 9;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.1s linear;
  }

  &__c {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    b {
      font-family: var(--ui-font-mono);
      font-size: 27px;
      color: var(--ui-brand-ink);
    }

    small {
      font-size: 10px;
      color: var(--ui-ink-3);
      font-weight: 700;
      letter-spacing: 0.1em;
    }
  }
}
</style>
