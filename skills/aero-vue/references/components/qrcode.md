# AeroQRCode（qrcode）

分组：DataDisplay 数据展示
中文名：二维码

具名导入：

```ts
import { AeroQRCode } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `value` | string | — |
| `size` | number | 160 |
| `margin` | number | 2 |
| `fg` | string | ''（取 --ui-ink） |
| `bg` | string | 'transparent' |
| `level` | 'L'|'M'|'Q'|'H' | 'M' |


## 最小示例（源自 demo/basic.vue）
```vue
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
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/qrcode/demo/basic.vue

