<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 排版阶梯 */
    level?: 'display' | 'heading-en' | 'title' | 'body' | 'caption'
    /** HTML 标签（默认按阶梯推导） */
    tag?: string
    /** 西文轴字体（Space Grotesk） */
    en?: boolean
    /** 等宽字体 */
    mono?: boolean
    /** 高亮词（底部品牌色擦入条） */
    highlight?: boolean
    /** 贴纸盒（品牌底+旋转+硬阴影） */
    sticker?: boolean
  }>(),
  { level: 'body' },
)

const defaultTag: Record<string, string> = {
  display: 'h1',
  'heading-en': 'h2',
  title: 'h3',
  body: 'p',
  caption: 'span',
}

const is = computed(() => props.tag ?? defaultTag[props.level])
</script>

<template>
  <component :is="is" class="aero-type" :class="[`aero-type--${$props.level}`, { 'is-en': $props.en, 'is-mono': $props.mono, 'is-highlight': $props.highlight, 'is-sticker': $props.sticker }]">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.aero-type {
  box-sizing: border-box;
  margin: 0;

  &--display {
    font-size: clamp(38px, 5.2vw, 66px);
    font-weight: 900;
    letter-spacing: -0.015em;
    line-height: 1.25;
  }
  &--heading-en {
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }
  &--title {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.25;
  }
  &--body {
    font-size: 15.5px;
    line-height: 1.75;
    color: var(--ui-ink-2);
  }
  &--caption {
    font-size: 12.5px;
    color: var(--ui-ink-3);
    font-weight: 600;
  }

  &.is-en {
    font-family: var(--ui-font-en);
  }
  &.is-mono {
    font-family: var(--ui-font-mono);
  }

  // 高亮词：品牌色底部擦入条
  &.is-highlight {
    position: relative;
    // z-index: 0 让自身成为独立堆叠上下文，否则下面 ::after 的 z-index:-1
    // 会逃逸到最近的祖先堆叠上下文（页面根），被页面背景整层盖住 —— 这正是
    // 「高亮条看不见」的根因，而非动画未播放。
    z-index: 0;
    color: var(--ui-brand-ink);
    white-space: nowrap;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.05em;
      height: 0.3em;
      border-radius: 0 0 0.1em 0.1em;
      // 直接用 background-color 而非 background 简写：简写在部分引擎下会把
      // var() 解析成 none，导致擦入条无底色（配合上面的堆叠问题一起不可见）。
      background-color: var(--ui-brand);
      z-index: -1;
      transform-origin: left;
      animation: ui-wipe-in 1s 0.55s var(--ui-ease) both;
    }
  }

  // 贴纸盒
  &.is-sticker {
    display: inline-block;
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    font-family: var(--ui-font-en);
    font-size: 0.62em;
    font-weight: 700;
    padding: 2px 12px;
    border-radius: 9px;
    transform: rotate(-2deg);
    box-shadow: var(--ui-shadow-xs);
    margin: 0 5px;
    transition: transform 0.25s var(--ui-spring);
    &:hover {
      transform: rotate(2deg) scale(1.1);
    }
  }
}
</style>
