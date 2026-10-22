<script setup lang="ts">
import { iconPaths } from '../../icon/src/paths'

export interface CollapseItem {
  key: string
  title: string
  content?: string
}

const props = withDefaults(
  defineProps<{
    items: CollapseItem[]
    /** 展开项（手风琴模式单值） */
    modelValue?: string
    /** 手风琴（仅展开一项） */
    accordion?: boolean
  }>(),
  { accordion: true },
)

const emit = defineEmits<{ (e: 'update:modelValue', v: string | undefined): void }>()

function toggle(k: string) {
  if (props.accordion) {
    emit('update:modelValue', props.modelValue === k ? undefined : k)
  }
}
</script>

<template>
  <div class="aero-acc-group">
    <div
      v-for="it in items"
      :key="it.key"
      class="aero-acc"
      :class="{ 'is-open': modelValue === it.key }"
    >
      <button class="aero-acc__head" type="button" @click="toggle(it.key)">
        <span class="aero-acc__title">{{ it.title }}</span>
        <span class="aero-acc__chev">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path v-for="(d, i) in iconPaths['chevron-down']" :key="i" :d="d" />
          </svg>
        </span>
      </button>
      <div class="aero-acc__body">
        <div class="aero-acc__inner">
          <div class="aero-acc__pad">
            <slot :item="it">{{ it.content }}</slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-acc-group {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aero-acc {
  border: 2px solid var(--ui-line);
  border-radius: 15px;
  background: var(--ui-card);
  transition: border-color 0.3s, box-shadow 0.3s;

  &.is-open {
    border-color: var(--ui-brand);
    box-shadow: 4px 4px 0 var(--ui-bg-tint);
  }

  &__head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 17px 20px;
    background: none;
    border: 0;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    color: var(--ui-ink);
    text-align: left;
    cursor: pointer;
  }
  &__chev {
    transition: transform 0.4s var(--ui-spring);
    color: var(--ui-brand-ink);
    display: flex;
  }
  &.is-open .aero-acc__chev {
    transform: rotate(180deg);
  }

  &__body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.45s var(--ui-ease);
  }
  &.is-open .aero-acc__body {
    grid-template-rows: 1fr;
  }
  &__inner {
    overflow: hidden;
    color: var(--ui-ink-2);
    font-size: 14px;
    min-height: 0;
    /* 左右 padding 放闭合层：grid 0fr 时连同内容一起压到 0，无底部缝隙 */
    padding: 0 20px;
  }
  &__pad {
    /* 底部留白放在 __pad 自身 padding-bottom：展开态让文字与卡片底边框之间
       留出 18px 呼吸距；收起态 grid 0fr 时闭合层 __inner 的 overflow:hidden
       把整层压到 0，不留缝隙 */
    padding-bottom: 18px;
  }
}
</style>
