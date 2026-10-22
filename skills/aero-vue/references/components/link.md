# AeroLink（link）

分组：Basic 基础
中文名：链接

具名导入：

```ts
import { AeroLink } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `href` | string | '#' |
| `external` | boolean | false |
| `disabled` | boolean | false |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroLink, useLocale } from 'aero-vue'
// 链接文字原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 16px">
    <AeroLink href="#">{{ t['link.internal'] }}</AeroLink>
    <AeroLink href="https://github.com/FanXingYiDianYun/aero-vue" external>{{ t['link.external'] }}</AeroLink>
    <AeroLink disabled>{{ t['link.disabled'] }}</AeroLink>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/link/demo/basic.vue

