# AeroEmpty（empty）

分组：DataDisplay 数据展示
中文名：空状态

具名导入：

```ts
import { AeroEmpty } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `hint` | string | 暂无数据 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroEmpty, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// hint/按钮原硬编码中文 → 走词包，随 ConfigProvider locale 翻转
const { empty } = useLocale()
</script>
<template>
  <div style="max-width: 400px">
    <AeroEmpty :hint="empty.search">
      <template #actions>
        <AeroButton type="outline" size="sm">{{ empty.reset }}</AeroButton>
      </template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/empty/demo/basic.vue

