# AeroWatermark（watermark）

分组：DataDisplay 数据展示
中文名：水印

具名导入：

```ts
import { AeroWatermark } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `content` | string | — |
| `rotate` | number | -22 |
| `gap` | number | 140 |
| `fontSize` | number | 15 |
| `opacity` | number | 0.22 |
| `maxWidth` | number|string | — |
| `radius` | number|string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroWatermark, AeroCard } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo
</script>
<template>
  <AeroWatermark content="AERO UI" :gap="150" :max-width="480" :radius="16" style="overflow: hidden">
    <AeroCard :min-height="160">
      <h4>{{ t['watermark.title'] }}</h4>
      <p>{{ t['watermark.body'] }}</p>
    </AeroCard>
  </AeroWatermark>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/watermark/demo/basic.vue

