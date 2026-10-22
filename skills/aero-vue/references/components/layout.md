# AeroLayout（layout）

分组：Basic 基础
中文名：区块

具名导入：

```ts
import { AeroLayout } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `padding` | 'normal'|'compact'|'none' | 'normal' |
| `alt` | boolean | false |
| `maxWidth` | number|string | 1180 |
| `radius` | number|string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroLayout, AeroTypography, useLocale } from 'aero-vue'
// 段落文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <AeroLayout alt padding="compact" :radius="16">
    <AeroTypography level="title">{{ t['layout.blockTitle'] }}</AeroTypography>
    <AeroTypography level="body">{{ t['layout.body'] }}</AeroTypography>
  </AeroLayout>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/layout/demo/basic.vue

