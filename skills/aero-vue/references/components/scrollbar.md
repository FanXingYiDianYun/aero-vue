# AeroScrollbar（scrollbar）

分组：Basic 基础
中文名：滚动条

具名导入：

```ts
import { AeroScrollbar } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `maxHeight` | number|string | 260 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroScrollbar, useLocale } from 'aero-vue'
// 列表条目文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <AeroScrollbar :max-height="180" style="max-width: 320px">
    <p v-for="i in 12" :key="i" style="padding: 10px 14px; color: var(--ui-ink-2); font-size: 13.5px; border-bottom: 2px dashed var(--ui-line); margin: 0">
      {{ t['scrollbar.item'] }} {{ i }} {{ t['scrollbar.itemNote'] }}
    </p>
  </AeroScrollbar>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/scrollbar/demo/basic.vue

