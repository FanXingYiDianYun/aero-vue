<script setup lang="ts">
import { useLocale } from '../../../locale'

// i18n：hint 缺省文案 + 默认 slot 回落文案走词包（ConfigProvider locale 注入；hint prop/slot 显式传入仍覆盖）
const { empty: emptyLabels } = useLocale()

withDefaults(
  defineProps<{
    /** 标题文案（缺省走词包 empty.empty） */
    hint?: string
  }>(),
  { hint: undefined },
)
</script>

<template>
  <div class="aero-empty">
    <!-- demo 同款：虚线云 + 表情脸 + 下方下载箭头 -->
    <svg class="aero-empty__art" width="100" height="74" viewBox="0 0 100 74" fill="none">
      <path
        d="M24 36 a13 13 0 0 1 26 -6 a11 11 0 0 1 21 5 a9 9 0 0 1 -2 18 H26 a10 10 0 0 1 -2 -17 Z"
        stroke="var(--ui-line-2)"
        stroke-width="3"
        stroke-dasharray="5 5"
      />
      <circle cx="42" cy="31" r="2.2" fill="var(--ui-ink-2)" />
      <circle cx="56" cy="31" r="2.2" fill="var(--ui-ink-2)" />
      <path d="M43 38 q5 5 10 0" stroke="var(--ui-brand)" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="34" cy="27" r="3" fill="color-mix(in srgb, var(--ui-err) 28%, transparent)" />
      <circle cx="65" cy="27" r="3" fill="color-mix(in srgb, var(--ui-err) 28%, transparent)" />
      <path
        d="M50 50 v10 M44 56 l6 6 6-6"
        stroke="var(--ui-brand-deep)"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <b>{{ hint ?? emptyLabels.hint }}</b>
    <p><slot>{{ emptyLabels.text }}</slot></p>
    <div class="aero-empty__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped lang="scss">
.aero-empty {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 30px;
  text-align: center;
  border: 2px dashed var(--ui-line-2);
  border-radius: var(--ui-radius-xl);
  background: color-mix(in srgb, var(--ui-bg) 55%, transparent);
  backdrop-filter: var(--ui-blur-strong);
  -webkit-backdrop-filter: var(--ui-blur-strong);

  &__art {
    margin-bottom: 6px;
  }
  b {
    font-size: 16px;
    margin-top: 8px;
    color: var(--ui-ink);
  }
  p {
    color: var(--ui-ink-3);
    font-size: 13.5px;
    margin: 0 0 12px;
  }
  &__actions {
    display: flex;
    gap: 10px;
  }
}
</style>
