# AeroDescriptions（descriptions）

分组：DataDisplay 数据展示
中文名：描述列表

具名导入：

```ts
import { AeroDescriptions } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `data` | Record<string,any> | — |
| `items` | {key,label,span?}[] | — |
| `column` | number | 3 |
| `bordered` | boolean | true |
| `title` | string | '' |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroDescriptions, useLocale } from 'aero-vue'
import { AeroTag } from 'aero-vue'
// 标题/字段 label 原硬编码中文 → 走词包 demo 组（数据值英文，保留）
const { demo } = useLocale()
const t = demo

const data = {
  name: 'aero-vue',
  version: '0.1.0',
  license: 'MIT',
  author: 'AeroBase Team',
  deps: 'vue >= 3.4',
  build: 'vite lib (es + umd)',
  style: 'SCSS tokens',
}
</script>
<template>
  <AeroDescriptions
    :title="t['descriptions.title']"
    :data="data"
    :column="2"
    :items="[
      { key: 'name', label: t['descriptions.pkgName'] },
      { key: 'version', label: t['descriptions.version'] },
      { key: 'license', label: t['descriptions.license'] },
      { key: 'author', label: t['descriptions.author'], span: 2 },
      { key: 'build', label: t['descriptions.build'] },
      { key: 'style', label: t['descriptions.style'] },
    ]"
    style="max-width: 560px"
  >
    <template #license>
      <AeroTag accent>MIT</AeroTag>
    </template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/descriptions/demo/basic.vue

