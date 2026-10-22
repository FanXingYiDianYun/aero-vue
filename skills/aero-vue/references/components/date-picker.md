# AeroDatePicker（date-picker）

分组：Form 表单
中文名：日期选择

具名导入：

```ts
import { AeroDatePicker } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | 'YYYY-MM-DD' | — |
| `placeholder` | string | 选择日期 |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | string |
| `change` | string |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroDatePicker } from 'aero-vue'

const d = ref('2026-09-13')
</script>
<template>
  <div style="max-width: 240px">
    <AeroDatePicker v-model="d" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/date-picker/demo/basic.vue

