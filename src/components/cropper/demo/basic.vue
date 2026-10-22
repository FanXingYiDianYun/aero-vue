<script setup lang="ts">
import { AeroCropper, useLocale } from 'aero-vue'
// 展示组件内 .aero-cropper__result 结果卡片排，每档导出尺寸真实像素渲染
// tip slot 走 useLocale() 词包 hint，文案随 ConfigProvider locale 翻转
const { cropper } = useLocale()
</script>

<template>
  <div class="cropper-demo">
    <AeroCropper>
      <template #tip>
        <span class="hint-chip">{{ cropper.hint }}</span>
      </template>
    </AeroCropper>
  </div>
</template>

<style scoped>
.cropper-demo { display: flex; flex-direction: column; gap: 20px; max-width: 100%; }
/* 提示 chip：与 avatar demo .hint 风格统一——bg --ui-bg-soft + 1px --ui-line
   + pill 圆角 + 12.5px + --ui-ink-3 */
.hint-chip {
  display: inline-block;
  background: var(--ui-bg-soft);
  border: 1px solid var(--ui-line);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12.5px;
  color: var(--ui-ink-3);
  max-width: 100%;
  line-height: 1.5;
  box-sizing: border-box;
}
</style>
