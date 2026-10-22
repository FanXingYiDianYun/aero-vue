<script setup lang="ts">
import { computed } from 'vue'
import { useCountUp } from '../../../composables'

const props = withDefaults(
  defineProps<{
    /** 数值（变化时 tween 滚动） */
    value: number
    /** 前缀（如 ¥） */
    prefix?: string
    /** 后缀（如 %） */
    suffix?: string
    /** 标签 */
    label?: string
    /** 是否启用滚动动画 */
    animated?: boolean
  }>(),
  { animated: true },
)

const { text } = useCountUp(() => props.value)

const shown = computed(() => (props.animated ? text() : props.value.toLocaleString('zh-CN')))
</script>

<template>
  <div class="aero-stat">
    <b class="aero-stat__num">{{ props.prefix }}{{ shown }}{{ props.suffix }}</b>
    <span v-if="label" class="aero-stat__label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.aero-stat {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;

  &__num {
    font-family: var(--ui-font-en);
    font-size: clamp(30px, 3.4vw, 44px);
    font-weight: 700;
    color: var(--ui-brand-ink); /* demo .stat .num b 的主题推荐色 */
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  &__label {
    color: var(--ui-ink-2);
    font-size: 14px;
    margin-top: 4px;
  }
}
</style>
