<script setup lang="ts">
import { AeroAvatar, useLocale } from 'aero-vue'
// 两行 hint 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

/* 六色配板 + 多尺寸（28-128px）——裁剪器逻辑已下沉 AeroCropper（见独立页 cropper） */
const tones = [1, 2, 3, 4, 5, 6]
const sizes = [28, 34, 44, 56, 72, 128]
</script>

<template>
  <div class="avatar-demo">
    <div class="row">
      <span class="hint">{{ t['avatar.pallet'] }}</span>
      <AeroAvatar v-for="tne in tones" :key="tne" :tone="tne">{{ ['AY', 'ZK', 'A3', 'Q4', 'W5', 'E6'][tne - 1] }}</AeroAvatar>
    </div>
    <div class="row">
      <span class="hint">{{ t['avatar.multiSize'] }}</span>
      <AeroAvatar v-for="s in sizes" :key="s" :size="s" :tone="(s % 6) + 1">{{ s }}</AeroAvatar>
    </div>
  </div>
</template>

<style scoped>
.avatar-demo { display: flex; flex-direction: column; gap: 20px; }
.row { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
.hint { font-family: var(--ui-font-mono); font-size: 12.5px; color: var(--ui-ink-3); }
</style>
