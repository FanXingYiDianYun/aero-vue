<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 配板 1-6（映射 --ui-av-{n}） */
    tone?: number
    /** 尺寸 px */
    size?: number | string
    /** 头像图片地址 */
    src?: string
    /** 图片加载失败回退文字 */
    alt?: string
    /** 形状：circle（默认，圆）/ square（方形圆角） */
    shape?: 'circle' | 'square'
    /** 图片填充（object-fit）：cover（默认）/ contain / fill */
    fit?: 'cover' | 'contain' | 'fill'
  }>(),
  { tone: 2, size: 44, shape: 'circle', fit: 'cover' },
)

const style = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  const fs = `calc(${s} / 3)` // 44px→约15px 比例同 demo
  const radius = props.shape === 'square' ? 'calc(var(--ui-radius))' : '50%'
  return {
    width: s,
    height: s,
    fontSize: fs,
    borderRadius: radius,
    background: `var(--ui-av-${props.tone}-bg)`,
    color: `var(--ui-av-${props.tone}-tx)`,
  }
})

const imgStyle = computed(() => ({
  objectFit: props.fit,
  borderRadius: props.shape === 'square' ? 'calc(var(--ui-radius))' : '50%',
}))

const failed = defineModel('failed', { type: Boolean, default: false })
</script>

<template>
  <span class="aero-avatar" :style="style">
    <img v-if="src && !failed" class="aero-avatar__img" :src="src" :alt="alt ?? ''" :style="imgStyle" @error="failed = true" />
    <template v-else><slot /></template>
  </span>
</template>

<style scoped lang="scss">
.aero-avatar {
  box-sizing: border-box; /* G 修复：border-box，使 width=size 时总宽精确等于 size px（旧 box-sizing:content-box 加 5px 边框导致 getBoundingClientRect() 比 size 大） */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-family: var(--ui-font-en);
  border: 2.5px solid var(--ui-card);
  flex: none;
  overflow: hidden;
  transition: transform 0.3s var(--ui-spring);

  &:hover {
    transform: translateY(-5px) rotate(-5deg) scale(1.06);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
