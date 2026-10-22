<script setup lang="ts">
/**
 * Phone 手机壳 —— 复刻 demo .phone
 * 46px 圆角深色外壳 + notch + 状态栏 + 标题区 + 滚动内容 + 底部 homebar
 * hover 微浮旋转（签名交互）
 */
import { useSlots, type VNode } from 'vue'

withDefaults(
  defineProps<{
    /** 状态栏时间文本 */
    time?: string
    /** 顶部标题 */
    title?: string
    /** 副标题 */
    subtitle?: string
  }>(),
  { time: '9:41', title: '', subtitle: '' },
)

const slots = defineSlots<{ default?: () => VNode[] }>()
const has = useSlots()
</script>

<template>
  <div class="aero-phone">
    <div class="aero-phone__notch" />
    <div class="aero-phone__screen">
      <div class="aero-phone__status">
        <span>{{ time }}</span>
        <span class="aero-phone__si">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" />
          </svg>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M12 20h.01" />
          </svg>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="8" width="17" height="9" rx="3" /><path d="M22 11v3" />
          </svg>
        </span>
      </div>
      <div v-if="title" class="aero-phone__title">{{ title }}</div>
      <div v-if="subtitle" class="aero-phone__sub">{{ subtitle }}</div>
      <slot />
      <div class="aero-phone__homebar" />
    </div>
  </div>
  <div v-if="false">{{ has }}</div>
</template>

<style scoped lang="scss">
.aero-phone {
  box-sizing: border-box;
  width: 330px;
  max-width: 100%;
  background: var(--ui-ink);
  border-radius: 46px;
  padding: 10px;
  box-shadow: 12px 12px 0 var(--ui-bg-tint);
  position: relative;
  flex: none;
  transition: transform 0.35s var(--ui-spring);
  user-select: none;
  -webkit-user-select: none;

  &:hover {
    transform: translateY(-4px) rotate(-0.5deg);
  }

  &__notch {
    position: absolute;
    top: 9px;
    left: 50%;
    transform: translateX(-50%);
    width: 104px;
    height: 22px;
    background: var(--ui-ink);
    border-radius: 99px;
    z-index: 6;
  }

  &__screen {
    background: var(--ui-bg);
    border-radius: 36px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 566px;
    position: relative;
  }

  &__status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 24px 4px;
    font-family: var(--ui-font-mono);
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ui-ink-2);

    .aero-phone__si {
      display: flex;
      gap: 5px;
      align-items: center;
    }
  }

  &__title {
    padding: 10px 18px 2px;
    font-size: 16px;
    font-weight: 900;
  }

  &__sub {
    padding: 0 18px 8px;
    font-size: 11.5px;
    color: var(--ui-ink-3);
  }

  &__homebar {
    width: 118px;
    height: 4.5px;
    background: var(--ui-ink);
    opacity: 0.8;
    border-radius: 99px;
    margin: 6px auto 8px;
  }
}
</style>
