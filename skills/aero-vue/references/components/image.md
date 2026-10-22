# AeroImage（image）

分组：DataDisplay 数据展示
中文名：图片

具名导入：

```ts
import { AeroImage } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `src` | string | — |
| `alt` | string | '' |
| `width/height` | number|string | 100%/- |
| `radius` | 'sm'|'md'|'lg'|'pill' | 'md' |
| `preview` | boolean | false |
| `fit` | 'cover'|'contain'|'fill' | 'cover' |

## events
| event | payload |
|---|---|
| `preview` | string |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroImage, useLocale } from 'aero-vue'
// alt 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 14px; flex-wrap: wrap">
    <AeroImage
      src="https://picsum.photos/seed/aero1/240/160"
      :alt="t['image.sampleAlt']"
      width="240"
      height="160"
      preview
    />
    <AeroImage src="not-exists.png" width="240" height="160" :alt="t['image.failAlt']" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/image/demo/basic.vue

