# AeroDivider（divider）

分组：Basic 基础
中文名：分割线

具名导入：

```ts
import { AeroDivider } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `vertical` | boolean | false |
| `dashed` | boolean | false |
| `title` | string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroDivider, useLocale } from 'aero-vue'
// 段落文案原硬编码中文 → 走词包 demo 组（'Or' 英文保留）
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div>
    <p style="color: var(--ui-ink-2)">{{ t['divider.topContent'] }}</p>
    <AeroDivider />
    <AeroDivider title="Or" />
    <div style="display: flex; height: 40px; align-items: center">
      {{ t['divider.left'] }} <AeroDivider vertical /> {{ t['divider.middle'] }} <AeroDivider vertical dashed /> {{ t['divider.right'] }}
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/divider/demo/basic.vue

