# AeroCard（card）

分组：DataDisplay 数据展示
中文名：卡片

具名导入：

```ts
import { AeroCard } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `hoverable` | boolean | false |
| `paddingless` | boolean | false |
| `width` | number|string | — |
| `minHeight` | number|string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroCard, AeroButton, useLocale } from 'aero-vue'
// 卡片标题/正文/按钮原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 18px; flex-wrap: wrap">
    <AeroCard hoverable :width="280">
      <h4>{{ t['card.hoverableTitle'] }}</h4>
      <p>{{ t['card.hoverableBody'] }}</p>
    </AeroCard>
    <AeroCard :width="280">
      <template #header><h4>{{ t['card.withHeaderTitle'] }}</h4></template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/card/demo/basic.vue

