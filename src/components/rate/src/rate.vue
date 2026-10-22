<script setup lang="ts">
import { computed, ref } from 'vue'
import { party } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：星级「N 星」aria 走词包（ConfigProvider locale 注入）
const { rate: rateLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue?: number
    /** 星数 */
    count?: number
    disabled?: boolean
    /** 确认弹跳动画（评分礼花的前置） */
    animate?: boolean
    /** 确认评分时触发礼花特效（demo 原行为） */
    confetti?: boolean
    /** 一位小数评级（粒度 0.1，写入/emit 值取整到 0.1；默认 false 与修复前逐像素一致） */
    allowDecimal?: boolean
    /** 允许首评后重选。
 * - false（默认）：用户完成首次评分（pointer/键盘第一次 commit，无论值是否变化）后锁定——
 * 后续指针/键盘输入全部忽略、cursor: default、aria 保持；消费方程序化设值（modelValue）不受锁影响。
 * - true：现行为（可反复改）。 */
    allowReselect?: boolean
  }>(),
  { modelValue: 0, count: 5, disabled: false, animate: true, confetti: true, allowDecimal: false, allowReselect: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const hover = ref(0)
const done = ref(false)
// 首评锁定（仅 allowReselect=false 时生效）——用户第一次 commit（指针/键盘，
// 无论值是否变化）后置位；后续交互入口全忽略。程序化 modelValue 赋值不走此锁
// （锁只在交互 handler 内检查与置位，不受控赋值、可被消费方程序化设值绕过不影响）。
const locked = ref(false)
/** 当前是否处于锁定态（allowReselect=false 且已完成首次 commit）——
 * 驱动星钮 cursor: default（交互被忽略的视觉提示），aria 保持不动。 */
const isLocked = computed(() => !props.allowReselect && locked.value)

const current = computed(() => (hover.value || props.modelValue) as number)

/** 第 i 星（1 起）填充比例——小数模式 clamp(value-(i-1), 0, 1) 并量化 0.1（防浮点尾巴）；整数模式 0/1 */
function fillFrac(i: number) {
  if (!props.allowDecimal) return i <= current.value ? 1 : 0
  return Math.min(1, Math.max(0, Math.round((current.value - (i - 1)) * 10) / 10))
}

/** 星内水平位置 → 0.1 档 raw（0..1） */
function pointerFrac(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const f = (e.clientX - r.left) / r.width
  return Math.min(1, Math.max(0, f))
}

/** 提交量化——小数：clamp [0,count] 后 Math.round(v*10)/10（防浮点尾巴）；整数：原整星行为 */
function quantize(raw: number) {
  if (!props.allowDecimal) return raw
  return Math.min(props.count, Math.max(0, Math.round(raw * 10) / 10))
}

/** 整数模式 commit 与修复前逐行为一致（整星）。
 * allowReselect=false 时，本次 commit 后置 locked——后续交互全部忽略。 */
function commitInt(n: number, e: MouseEvent) {
  if (props.disabled || !props.allowReselect && locked.value) return
  emit('update:modelValue', n)
  emit('change', n)
  if (!props.allowReselect) locked.value = true
  if (props.animate) {
    done.value = false
    requestAnimationFrame(() => (done.value = true))
  }
  if (props.confetti) party(e.clientX, e.clientY)
}

function onStarEnter(e: MouseEvent, i: number) {
  if (props.disabled || !props.allowReselect && locked.value) return
  if (!props.allowDecimal) { hover.value = i; return }
  hover.value = i - 1 + pointerFrac(e)
}

function onStarMove(e: MouseEvent, i: number) {
  if (!props.allowDecimal || props.disabled || !props.allowReselect && locked.value) return
  hover.value = i - 1 + pointerFrac(e)
}

function onStarClick(e: MouseEvent, i: number) {
  if (props.disabled || !props.allowReselect && locked.value) return
  if (!props.allowDecimal) { commitInt(i, e); return }
  const v = quantize(i - 1 + pointerFrac(e))
  emit('update:modelValue', v)
  emit('change', v)
  if (!props.allowReselect) locked.value = true
  if (props.animate) {
    done.value = false
    requestAnimationFrame(() => (done.value = true))
  }
  if (props.confetti) party(e.clientX, e.clientY)
}

/** 键盘箭头步进 0.1（aria-valuenow 一位小数）。锁定后键盘同样忽略 */
function onKeyNav(e: KeyboardEvent) {
  if (!props.allowDecimal || props.disabled || !props.allowReselect && locked.value) return
  let d = 0
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = 1
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -1
  else return
  e.preventDefault()
  const v = quantize(current.value + d * 0.1)
  emit('update:modelValue', v)
  emit('change', v)
  if (!props.allowReselect) locked.value = true
}
</script>

<template>
  <span
    class="aero-rate"
    :class="{ 'is-disabled': disabled, 'is-done': done }"
    :aria-valuenow="allowDecimal ? +current.toFixed(1) : undefined"
    :aria-valuemin="allowDecimal ? 0 : undefined"
    :aria-valuemax="allowDecimal ? count : undefined"
    @mouseleave="hover = 0"
    @keydown="onKeyNav"
  >
    <button
      v-for="n in count"
      :key="n"
      type="button"
      class="aero-rate__star"
      :class="{ 'is-on': !allowDecimal && n <= current, 'is-locked': isLocked }"
      :style="isLocked ? { cursor: 'default' } : undefined"
      :disabled="disabled"
      :aria-label="rateLabels.starAria(n)"
      @mouseenter="onStarEnter($event, n)"
      @mousemove="onStarMove($event, n)"
      @click="onStarClick($event, n)"
    >
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
        <path
          d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16Z"
        />
      </svg>
      <!-- 小数部分填充叠层——同尺寸填充星按 frac×100% 宽度左裁切，盖在底层灰星上；
 整数模式（默认）不渲染，DOM 与修复前逐像素一致。小数模式不挂 is-on（底色恒灰） -->
      <span
        v-if="allowDecimal && fillFrac(n) > 0"
        class="aero-rate__fill"
        :style="{ width: fillFrac(n) * 100 + '%' }"
        aria-hidden="true"
      >
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16Z"
          />
        </svg>
      </span>
    </button>
  </span>
</template>

<style scoped lang="scss">
.aero-rate {
  box-sizing: border-box;
  display: inline-flex;
  gap: 5px;

  &.is-disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  &__star {
    color: var(--ui-line-2);
    display: flex;
    position: relative; /* __fill 叠层定位参照（整数模式不渲染 __fill，无像素影响） */
    border: 0;
    background: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s var(--ui-spring), color 0.18s;
    svg {
      fill: none;
    }
    &:not(:disabled):hover {
      transform: scale(1.3) rotate(-12deg);
    }
    &.is-on {
      color: var(--ui-star);
      svg {
        fill: currentColor;
      }
    }
    /* 锁定态——交互被忽略，光标 default + 禁 hover 放大（aria 不动） */
    &.is-locked {
      cursor: default;
      &:hover {
        transform: none;
      }
    }
  }

  /* 小数部分填充叠层——盖在底层灰星上、宽度 frac×100% 左裁切；
 星形/尺寸/间距/颜色（--ui-star）与底层一致，仅宽度按填充比例 */
  &__fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 23px;
    overflow: hidden;
    pointer-events: none;
    color: var(--ui-star);
    svg {
      fill: currentColor;
      stroke: currentColor;
    }
  }
  &.is-done .aero-rate__star.is-on {
    animation: ui-pop-in 0.4s var(--ui-spring);
  }
}
</style>
