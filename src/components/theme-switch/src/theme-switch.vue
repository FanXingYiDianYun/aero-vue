<!-- 主题切换滑钮。
     - modelValue?: 'light' | 'dark' —— 提供 = 受控（v-model：渲染跟 prop，点击只
       emit 不碰内部主题服务）；未提供 = 现行为（内部 useTheme 主题服务，零回归）。
     - emit('update:modelValue', theme) + emit('change', theme) —— 两种模式都发。
     - disabled?: boolean = false（禁交互 + aria-disabled）。
     - size?: 'sm' | 'md' | 'lg' = 'md'（sm 36×20 knob14 icon10、md 72.2×38 knob26 icon14、
       lg 88×44 knob30 icon16——inset/位移自算：inset=(44-4-30)/2=5、位移=88-4-30-10=44；
       轨道全圆角，过渡/hover 沿现 token）。
     - a11y：role="switch"、aria-checked（dark=true）、aria-label 走词包
       themeSwitch.switchToLight / switchToDark。 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../../composables'
import { useLocale } from '../../../locale'
import AeroIcon from '../../icon/src/icon.vue'

// i18n：亮/暗主题切换 aria/title 走词包（ConfigProvider locale 注入）
const { themeSwitch: themeLabels } = useLocale()

type ThemeValue = 'light' | 'dark'

const props = withDefaults(
  defineProps<{
    /** 受控主题值。提供 = v-model 受控（渲染跟 prop，点击只 emit 不碰内部
 主题服务）；未提供 = 现行为（内部 useTheme 主题服务，零回归） */
    modelValue?: ThemeValue
    /** 禁用交互（aria-disabled + 不响应点击） */
    disabled?: boolean
    /** 尺寸。sm 36×20/knob14/icon10、md 72.2×38/knob26/icon14；
 lg 88×44/knob30/icon16（> md 72.2 明显拉开档差） */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { modelValue: undefined, disabled: false, size: 'md' },
)

const emit = defineEmits<{
  /** 两种模式都发（受控=点按目标值；非受控=主题服务切换后值） */
  (e: 'update:modelValue', v: ThemeValue): void
  (e: 'change', v: ThemeValue): void
}>()

const { state, toggleTheme } = useTheme()
const controlled = props.modelValue !== undefined
/** 渲染态：受控跟 prop，非受控跟内部主题服务（现行为） */
const isDark = computed<ThemeValue>(() =>
  controlled ? (props.modelValue as ThemeValue) : (state.theme === 'dark' ? 'dark' : 'light'),
)

/** 尺寸几何：
 *  sm 36×20 knob14 icon10 / md 72.2×38 knob26 icon14 / lg 88×44 knob30 icon16
 *  knob inset=(轨道高-knob)/2；位移=内宽(轨道宽-4px 描边)-knob-2×inset；
 *  md 代入 = 72.2-4-26-8 = 34.2 = 旧 0.9h（逐值一致，零视觉回归）
 *  lg 代入 = 88-4-30-10 = 44 */
const iconSize = computed(() => (props.size === 'sm' ? 10 : props.size === 'lg' ? 16 : 14))

function onClick() {
  if (props.disabled) return
  if (controlled) {
    // 受控：只算目标值发事件，不碰内部主题服务
    const next: ThemeValue = isDark.value === 'dark' ? 'light' : 'dark'
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    // 非受控（现行为）：内部主题服务切换（watchEffect 落 DOM + 持久化），随后双发事件
    toggleTheme()
    const next: ThemeValue = state.theme === 'dark' ? 'dark' : 'light'
    emit('update:modelValue', next)
    emit('change', next)
  }
}

const ariaLabel = computed(() => (isDark.value === 'dark' ? themeLabels.value.switchToLight : themeLabels.value.switchToDark))
</script>

<template>
  <button
    class="aero-theme-switch"
    :class="[ `aero-theme-switch--${size}`, { 'is-dark': isDark === 'dark', 'is-disabled': disabled } ]"
    type="button"
    :disabled="disabled"
    role="switch"
    :aria-checked="isDark === 'dark'"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <span class="aero-theme-switch__thumb">
      <AeroIcon class="aero-theme-switch__sun" name="sun" :size="iconSize" />
      <AeroIcon class="aero-theme-switch__moon" name="moon" :size="iconSize" />
    </span>
    <span class="aero-theme-switch__track-icons" aria-hidden="true">
      <AeroIcon name="moon" :size="11" />
      <AeroIcon name="sun" :size="11" />
    </span>
  </button>
</template>

<style scoped lang="scss">
/* 胶囊滑钮：pill 轨道 + spring 滑块 + 日/月旋换。
   尺寸参数化：--_h/--_w/--_knob/--_icon 每档一组。视觉语言沿用硬阴影签名 + brand 主色态 */
.aero-theme-switch {
  box-sizing: border-box;
  /* md（现状：--_h 38px，宽 calc(h*1.9)=72.2px，knob h-12=26px，主 icon 14） */
  --_h: 38px;
  --_w: calc(var(--_h) * 1.9);
  --_knob: calc(var(--_h) - 12px);
  position: relative;
  width: var(--_w);
  height: var(--_h);
  border-radius: 99px;
  border: 2px solid var(--ui-line);
  background: var(--ui-bg-soft);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.25s, background 0.3s, transform 0.25s var(--ui-spring), box-shadow 0.25s;

  /* sm 轨道 36×20 / knob 14 / icon 10；lg 轨道 88×44 / knob 30 / icon 16。
 公式：inset=(轨道高-knob)/2、位移=内宽-knob-2×inset。「轨道高」按内高
 （border-box 外径减 2px 双侧描边）计——md 代入 (38-4-26)/2=4、位移
 72.2-4-26-8=34.2。
 sm inset=(20-4-14)/2=1、位移 36-4-14-2=16；lg inset=(44-4-30)/2=5、
 位移 88-4-30-10=44 */
  &--sm {
    --_h: 20px;
    --_w: 36px;
    --_knob: 14px;
  }
  &--lg {
    --_h: 44px;
    --_w: 88px;
    --_knob: 30px;
  }

  --_inset: calc((var(--_h) - 4px - var(--_knob)) / 2);
  --_shift: calc(var(--_w) - 4px - var(--_knob) - 2 * var(--_inset));

  &:hover {
    border-color: var(--ui-brand);
    transform: translateY(-2px) rotate(-1deg);
    box-shadow: 3px 3px 0 var(--ui-bg-tint);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ui-focus-ring);
  }

  /* 禁用（与库散落 disabled 模式对齐：opacity 降 + 不响应 + not-allowed，
 与 rate .is-disabled 0.6 / tree 0.45 同族，不造新 token） */
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  &.is-dark {
    background: color-mix(in srgb, var(--ui-brand) 12%, var(--ui-bg));
    border-color: color-mix(in srgb, var(--ui-brand) 40%, var(--ui-bg));
  }

  &__thumb {
    position: absolute;
    top: var(--_inset);
    left: var(--_inset);
    width: var(--_knob);
    height: var(--_knob);
    border-radius: 50%;
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    border: 2px solid var(--ui-ink);
    box-shadow: 2px 2px 0 var(--ui-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s var(--ui-spring), background 0.3s, color 0.3s;
    z-index: 1;
  }

  &.is-dark &__thumb {
    transform: translateX(var(--_shift));
    background: var(--ui-ink);
    color: var(--ui-brand);
    border-color: var(--ui-brand);
    box-shadow: 2px 2px 0 var(--ui-brand);
  }

  &__sun,
  &__moon {
    position: absolute;
    transition: transform 0.45s var(--ui-spring), opacity 0.2s;
  }

  &__sun {
    transform: rotate(0) scale(1);
    opacity: 1;
  }

  &__moon {
    transform: rotate(-120deg) scale(0.3);
    opacity: 0;
  }

  &.is-dark &__sun {
    transform: rotate(120deg) scale(0.3);
    opacity: 0;
  }

  &.is-dark &__moon {
    transform: rotate(0) scale(1);
    opacity: 1;
  }

  /* 轨道两端的小对侧图标提示（弱化；尺寸保持 11） */
  &__track-icons {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    color: var(--ui-ink-3);
    opacity: 0.45;
    pointer-events: none;
  }
}
</style>
