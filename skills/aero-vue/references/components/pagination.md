# AeroPagination（pagination）

分组：DataDisplay 数据展示
中文名：分页

具名导入：

```ts
import { AeroPagination } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | number | — |
| `total` | number | — |
| `pageSize` | number | 10 |
| `jumper` | boolean | true |

## events
| event | payload |
|---|---|
| `change` | number |
| `update:modelValue` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroPagination, useLocale } from 'aero-vue'
// 页码提示原硬编码中文 → 走词包 demo 组（键+插值）
const { demo } = useLocale()
const t = demo

const page = ref(3)
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
    <AeroPagination v-model="page" :total="264" />
    <span style="font-size: 12.5px; color: var(--ui-ink-3)">{{ t['pagination.pageOf'] }} {{ page }} {{ t['pagination.pageSuffix'] }}</span>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/pagination/demo/basic.vue

