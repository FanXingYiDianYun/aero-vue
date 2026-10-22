<script setup lang="ts">
import { ref } from 'vue'
import { AeroQRCode, useLocale } from 'aero-vue'
import { AeroSlider } from 'aero-vue'
import { AeroInput } from 'aero-vue'
import { AeroColorPicker } from 'aero-vue'
import { AeroTypography } from 'aero-vue'
// 标签/说明/placeholder 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const text = ref('https://github.com/FanXingYiDianYun/aero-vue')
const size = ref(160)
/** QR 前景色（dogfood：AeroColorPicker 选色；传 '' 时组件取 var(--ui-ink) 计算值） */
const color = ref('')
</script>

<template>
  <div class="qr-demo">
    <!-- 左列：固定方形预览容器（280x280）+ 居中 QR，几何位置不随 QR 尺寸变化 -->
    <div class="qr-demo__left">
      <div class="qr-demo__box">
        <AeroQRCode :value="text" :size="size" :fg="color" :key="text + color" />
      </div>
      <p class="qr-demo__cap">{{ t['qrcode.caption'] }}</p>
    </div>
    <!-- 右列：滑块独立成行，不随 QR 缩放容器位移 -->
    <div class="qr-demo__ctrls">
      <AeroTypography level="caption">{{ t['qrcode.contentLabel'] }}</AeroTypography>
      <AeroInput v-model="text" :placeholder="t['qrcode.inputPlaceholder']" :width="'100%'" />
      <AeroTypography level="caption">{{ t['qrcode.sizeLabel'] }} {{ size }}px</AeroTypography>
      <!-- 控制滑块统一用项目 Slider 组件 -->
      <AeroSlider v-model="size" :min="96" :max="280" :step="8" :show-scale="false" class="qr-demo__slider" />
      <AeroTypography level="caption">{{ t['qrcode.fgLabel'] }}</AeroTypography>
      <AeroColorPicker v-model="color" class="qr-demo__picker" />
      <p class="qr-demo__meta">{{ t['qrcode.meta'] }} {{ text.length }} {{ t['qrcode.chars'] }}</p>
    </div>
  </div>
</template>

<style scoped>
.qr-demo { display: flex; gap: 26px; align-items: flex-start; flex-wrap: wrap; }
.qr-demo__left { display: flex; flex-direction: column; align-items: center; gap: 8px; }
/* 固定 280x280 方形容器，QR 居中；滑块几何位置在任何 QR 尺寸下恒定 */
.qr-demo__box {
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  border: 2px solid var(--ui-line);
  border-radius: 14px;
  background: var(--ui-card);
  box-shadow: 5px 5px 0 var(--ui-bg-tint);
}
.qr-demo__cap { font-size: 12.5px; color: var(--ui-ink-3); }
.qr-demo__ctrls { display: flex; flex-direction: column; gap: 8px; min-width: 240px; flex: 1; }
.qr-demo__slider { width: 100%; }
.qr-demo__picker { width: 100%; }
.qr-demo__meta { font-size: 12px; color: var(--ui-ink-3); font-family: var(--ui-font-mono); }
</style>
