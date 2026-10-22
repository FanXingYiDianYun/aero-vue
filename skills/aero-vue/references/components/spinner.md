# AeroSpinner（spinner）

分组：DataDisplay 数据展示
中文名：转圈加载

具名导入：

```ts
import { AeroSpinner } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `size` | 'sm'|'md'|'lg' | 'md' |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroSpinner } from 'aero-vue'
</script>
<template>
  <div style="display: flex; gap: 18px; align-items: center">
    <AeroSpinner size="sm" />
    <AeroSpinner />
    <AeroSpinner size="lg" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/spinner/demo/basic.vue

