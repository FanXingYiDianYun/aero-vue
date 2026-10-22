# AeroPopover（popover）

分组：Feedback 反馈
中文名：气泡

具名导入：

```ts
import { AeroPopover } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `trigger` | 'hover'|'click' | 'hover' |
| `placement` | 'top'|'bottom'|'right' | 'bottom' |
| `title` | string | '' |
| `width` | number | 260 |
| `open` | boolean | — |

## events
| event | payload |
|---|---|
| `update:open` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroPopover, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 浮层标题/按钮/内容原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 18px; padding: 30px 0">
    <AeroPopover :title="t['popover.hoverTitle']" trigger="hover">
      <AeroButton type="outline" size="sm">{{ t['popover.hoverBtn'] }}</AeroButton>
      <template #content>{{ t['popover.hoverBody'] }}</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/popover/demo/basic.vue

