# AeroCropper（cropper）

分组：DataDisplay 数据展示
中文名：头像裁剪器

具名导入：

```ts
import { AeroCropper } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `exportSizes` | number[] | [32,48,64,96,128] |
| `shape` | 'circle'|'rect' | 'circle' |
| `minSize` | number | 60 |
| `maxSize` | number | 0（自动 view-10） |
| `disabled` | boolean | false |
| `view` | number | 260 |
| `labels` | Partial<CropperLabels> | — |

## events
| event | payload |
|---|---|
| `change` | CropFrameState |
| `export` | CropResult[] |
| `error` | unknown |

## 最小示例（源自 demo/basic.vue）
```vue
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
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/cropper/demo/basic.vue

