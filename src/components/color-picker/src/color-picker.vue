<script setup lang="ts">
/**
 * ColorPicker 颜色选择器 —— 自绘 HSV 面板（替代原生 input[type=color]）
 * SV 拾取区（1 格渐变）+ 色相滑条 + HEX 手输（支持粘贴）+ RGB 只读展示
 */
import { computed, reactive, ref, watch } from 'vue'
import { useClickOutside, usePointerDrag } from '../../../composables'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** 预设色板（null 隐藏） */
    presets?: string[] | null
  }>(),
  {
    modelValue: '#0EBFFF',
    presets: () => ['#0EBFFF', '#7C6CFF', '#10C999', '#FF8A3D', '#FF5C8A', '#F59F00', '#FA5252', '#12B886'],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}>()

/* ---------- HSV <-> HEX 工具 ---------- */
function hexToRgb(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()
}
function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d) {
    // 标准六扇区公式：每段都用 /d 归一化后再除以 6 折到 0..1。
    // 旧实现 max===g 分支写成 b/r + (r-b)/d + 2（混入了未归一化的 b/r），
    // 导致色相整体偏移——#0EBFFF 实际色相 187.85° 被算成整 180°，
    // 显示值变成 #0EFFFF（青色），与输入不符。
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: max ? d / max : 0, v: max }
}
function hsvToRgb(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return { r: f(5) * 255, g: f(3) * 255, b: f(1) * 255 }
}

/* ---------- 状态 ---------- */
const hsv = reactive({ h: 200, s: 0.95, v: 1 })
const hexInput = ref(props.modelValue)

/**
 * hsv 是面板的唯一事实源（SV 拾取区改 s/v、色相条改 h、HEX 输入整体替换）。
 * 外部 modelValue 变化只做「若与面板当前 hex 不同 → 从 hex 重建 hsv + 同步输入框」，
 * 且仅在非拖拽时执行——避免 SV 拖拽中 commit 回灌时 s→0（纯灰）导致 rgbToHsv
 * 把 h 归零、色相条圆点乱跳（"移动小圆点色相条也在动"的根因）。
 */
let interacting = false

watch(
  () => props.modelValue,
  (hex) => {
    if (interacting) return // 拖拽中不回灌，圆点/色相条位置仅由本地 hsv 决定
    const rgb = hexToRgb(hex)
    // 仅当外部值与面板当前色不同才重建 hsv（避免同值空转 / s→0 时 h 归零跳变）
    const cur = hsvToRgb(hsv.h, hsv.s, hsv.v)
    if (rgb && rgbToHex(rgb.r, rgb.g, rgb.b) !== rgbToHex(cur.r, cur.g, cur.b)) {
      Object.assign(hsv, rgbToHsv(rgb.r, rgb.g, rgb.b))
    }
  },
  { immediate: true },
)

const rgb = computed(() => hsvToRgb(hsv.h, hsv.s, hsv.v))
const hex = computed(() => rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b))
const rgbLabel = computed(() => `${Math.round(rgb.value.r)}, ${Math.round(rgb.value.g)}, ${Math.round(rgb.value.b)}`)

/* 拖拽期间 hex 输入框与触发钮显示值实时跟随（松手后与 modelValue 一致） */
watch(hex, (v) => {
  if (!document.activeElement || (document.activeElement as HTMLElement).tagName !== 'INPUT') {
    hexInput.value = v
  }
})

// SV 拾取区底色 = 当前色相的满饱和满明度色，仅随 h 变化
const svBg = computed(() => {
  const c = hsvToRgb(hsv.h, 1, 1)
  return rgbToHex(c.r, c.g, c.b)
})

function commit() {
  hexInput.value = hex.value
  if (hex.value !== props.modelValue) {
    emit('update:modelValue', hex.value)
    emit('change', hex.value)
  }
}

/* ---------- SV 区拖拽 ---------- */
const root = ref<HTMLElement>()
const open = ref(false)
useClickOutside(() => root.value, () => (open.value = false))

const svEl = ref<HTMLElement>()

function svMove(e: PointerEvent) {
  if (!svEl.value) return
  const r = svEl.value.getBoundingClientRect()
  hsv.s = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  hsv.v = 1 - Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
}
function svEnd() {
  if (interacting) {
    interacting = false
    commit()
  }
}

// SV 区拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）；
// 首帧定位：startDrag 内部 preventDefault 后手动补一次（与原 onSvDown→onSvMove 等价）
const { startDrag: startSvDrag } = usePointerDrag(svMove, {
  onEnd: svEnd,
})
function onSvDown(e: PointerEvent) {
  interacting = true
  startSvDrag(svEl.value, e)
  svMove(e)
}

/* ---------- 色相拖拽 ---------- */
const hueEl = ref<HTMLElement>()

function hueMove(e: PointerEvent) {
  if (!hueEl.value) return
  const r = hueEl.value.getBoundingClientRect()
  hsv.h = Math.min(360, Math.max(0, ((e.clientY - r.top) / r.height) * 360))
}
function hueEnd() {
  if (interacting) {
    interacting = false
    commit()
  }
}

// 色相条拖拽骨架收敛到 usePointerDrag
const { startDrag: startHueDrag } = usePointerDrag(hueMove, {
  onEnd: hueEnd,
})
function onHueDown(e: PointerEvent) {
  interacting = true
  startHueDrag(hueEl.value, e)
  hueMove(e)
}

/* ---------- HEX 输入（含粘贴） ---------- */
function onHexKey(e: KeyboardEvent) {
  if (e.key === 'Enter') applyHex()
}
function onHexPaste() {
  // 粘贴后等 value 更新再校验
  requestAnimationFrame(applyHex)
}
function applyHex() {
  const rgbv = hexToRgb(hexInput.value)
  if (rgbv) {
    Object.assign(hsv, rgbToHsv(rgbv.r, rgbv.g, rgbv.b))
    commit()
    hexInput.value = hex.value
  } else {
    hexInput.value = hex.value // 非法回滚
  }
}

function pick(c: string) {
  hexInput.value = c
  const rgbv = hexToRgb(c)
  if (rgbv) Object.assign(hsv, rgbToHsv(rgbv.r, rgbv.g, rgbv.b))
  commit()
}
</script>

<template>
  <div ref="root" class="aero-color">
    <button class="aero-color__trigger" type="button" @click="open = !open">
      <span class="aero-color__chip" :style="{ background: hex }" />
      <span class="aero-color__hex">{{ hex }}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <transition name="aero-color">
      <div v-if="open" class="aero-color__panel">
        <!-- SV 拾取区 + 竖向色相条（胶囊细边） -->
        <div class="aero-color__svrow">
          <div
            ref="svEl"
            class="aero-color__sv"
            :style="{ backgroundColor: svBg }"
            @pointerdown="onSvDown"
          >
            <span
              class="aero-color__dot"
              :style="{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }"
            />
          </div>
          <div
            ref="hueEl"
            class="aero-color__hue"
            @pointerdown="onHueDown"
          >
            <span class="aero-color__hue-dot" :style="{ top: `${(hsv.h / 360) * 100}%` }" />
          </div>
        </div>

        <!-- HEX + RGB -->
        <div class="aero-color__meta">
          <input
            v-model="hexInput"
            class="aero-color__input"
            spellcheck="false"
            maxlength="7"
            @keydown="onHexKey"
            @blur="applyHex"
            @paste="onHexPaste"
          />
          <span class="aero-color__rgb">RGB {{ rgbLabel }}</span>
        </div>

        <!-- 预设 -->
        <div v-if="presets" class="aero-color__presets">
          <button
            v-for="c in presets"
            :key="c"
            type="button"
            class="aero-color__preset"
            :class="{ 'is-on': c.toLowerCase() === modelValue?.toLowerCase() }"
            :style="{ '--c': c }"
            :aria-label="c"
            @click="pick(c)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-color {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;

  &__trigger {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 8px 12px;
    font-family: var(--ui-font-mono);
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ui-brand-ink);
    cursor: pointer;
    transition: border-color 0.25s, box-shadow 0.25s;

    &:hover { border-color: var(--ui-brand); }
  }

  &__chip {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
    border-radius: 7px;
    border: 2px solid var(--ui-card);
    box-shadow: 0 0 0 2px var(--ui-line-2);
    flex: none;
  }

  &__panel {
    box-sizing: border-box;
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    z-index: calc(var(--ui-z-pop) - 50);
    width: 236px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 12px;
    box-shadow: var(--ui-shadow-md);
    transform-origin: top left;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* SV 拾取区 + 竖向色相条并排 */
  &__svrow {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  &__sv {
    box-sizing: border-box;
    position: relative;
    flex: 1;
    height: 130px;
    border-radius: 10px;
    border: 1.5px solid var(--ui-line-2);
    cursor: crosshair;
    touch-action: none;
    /* 双渐变叠当前色相底色：右白→透明（饱和度），下黑→透明（明度） */
    background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent);
  }

  &__dot {
    box-sizing: border-box;
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.4);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__hue {
    box-sizing: border-box;
    position: relative;
    width: 18px;
    border-radius: 99px;
    border: 1.5px solid var(--ui-line-2);
    cursor: pointer;
    touch-action: none;
    background: linear-gradient(
      to bottom,
      #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%
    );
  }

  &__hue-dot {
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    width: 20px;
    height: 8px;
    border-radius: 99px;
    background: var(--ui-card);
    border: 1.5px solid var(--ui-line-2);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__input {
    width: 92px;
    background: var(--ui-bg-soft);
    border: 2px solid var(--ui-line-2);
    border-radius: 9px;
    padding: 6px 9px;
    font-family: var(--ui-font-mono);
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ui-ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
      border-color: var(--ui-brand);
      box-shadow: var(--ui-focus-ring);
    }
  }

  &__rgb {
    font-family: var(--ui-font-mono);
    font-size: 11.5px;
    color: var(--ui-ink-3);
    white-space: nowrap;
  }

  &__presets {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 2px;
  }

  &__preset {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2.5px solid var(--ui-card);
    box-shadow: 0 0 0 2px var(--ui-line-2);
    background: var(--c);
    position: relative;
    transition: 0.2s var(--ui-spring);
    cursor: pointer;
    &:hover { transform: scale(1.2) rotate(-10deg); }
    &.is-on {
      box-shadow: 0 0 0 2.5px var(--ui-ink);
      &::after {
        content: '✓';
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.45);
      }
    }
  }
}

.aero-color-enter-active,
.aero-color-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-color-enter-from,
.aero-color-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
