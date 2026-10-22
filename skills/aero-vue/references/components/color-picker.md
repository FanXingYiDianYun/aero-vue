# AeroColorPicker（color-picker）

分组：Form 表单
中文名：颜色选择

具名导入：

```ts
import { AeroColorPicker } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string | '#0EBFFF' |
| `presets` | string[]|null | 内置8色 |

## events
| event | payload |
|---|---|
| `update:modelValue` | string |
| `change` | string |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroColorPicker, useLocale } from 'aero-vue'
// 当前色标签原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const c = ref('#0EBFFF')
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <AeroColorPicker v-model="c" />
    <span style="font-family: var(--ui-font-mono); font-size: 13px; color: var(--ui-brand-ink)">{{ t['colorPicker.current'] }}{{ c }}</span>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/color-picker/demo/basic.vue

