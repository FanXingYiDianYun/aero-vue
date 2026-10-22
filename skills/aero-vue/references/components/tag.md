# AeroTag（tag）

分组：DataDisplay 数据展示
中文名：码标签

具名导入：

```ts
import { AeroTag } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `accent` | boolean | false |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroTag } from 'aero-vue'
</script>
<template>
  <div style="display: flex; gap: 10px; align-items: center">
    <AeroTag>npm</AeroTag>
    <AeroTag>pnpm</AeroTag>
    <AeroTag accent>Vue 3.4</AeroTag>
    <AeroTag>MIT</AeroTag>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/tag/demo/basic.vue

