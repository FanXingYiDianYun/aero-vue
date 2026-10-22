# AeroInputNumber（input-number）

分组：Form 表单
中文名：数字输入

具名导入：

```ts
import { AeroInputNumber } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | number | — |
| `min/max` | number | — |
| `step` | number | 1 |
| `stepStrictly` | boolean | false |
| `disabled` | boolean | false |
| `placeholder` | string | — |

## events
| event | payload |
|---|---|
| `update:modelValue` | number |
| `change` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroInputNumber } from 'aero-vue'

const n = ref(5)
</script>
<template>
  <div style="display: flex; gap: 18px; flex-wrap: wrap">
    <AeroInputNumber v-model="n" :min="0" :max="10" />
    <AeroInputNumber v-model="n" :step="2" step-strictly />
    <AeroInputNumber v-model="n" disabled />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/input-number/demo/basic.vue

