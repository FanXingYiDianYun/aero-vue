# AeroBreadcrumb（breadcrumb）

分组：Navigation 导航
中文名：面包屑

具名导入：

```ts
import { AeroBreadcrumb } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | BreadcrumbItem[] | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroBreadcrumb, useLocale } from 'aero-vue'
// 前两级 label 原硬编码中文 → 走词包 demo 组（'Breadcrumb' 为英文数据，保留）
const { demo } = useLocale()
const t = demo
</script>
<template>
  <AeroBreadcrumb
    :items="[
      { label: t['breadcrumb.home'], href: '#' },
      { label: t['breadcrumb.components'], href: '#' },
      { label: 'Breadcrumb' },
    ]"
  />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/breadcrumb/demo/basic.vue

