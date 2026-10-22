# AeroGrid（grid）

分组：Basic 基础
中文名：栅格

具名导入：

```ts
import { AeroGrid } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `cols` | number | 3 |
| `gap` | number | 20 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroGrid, useLocale } from 'aero-vue'
import { AeroCard } from 'aero-vue'
// 卡片文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <AeroGrid :cols="3" :gap="16" style="max-width: 560px">
    <AeroCard v-for="i in 6" :key="i" hoverable>
      <h4>{{ t['grid.card'] }} {{ i }}</h4>
      <p>{{ t['grid.sample'] }}</p>
    </AeroCard>
  </AeroGrid>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/grid/demo/basic.vue

