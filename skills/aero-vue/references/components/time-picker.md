# AeroTimePicker（time-picker）

分组：Form 表单
中文名：时间选择

具名导入：

```ts
import { AeroTimePicker } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | 'HH:mm' | — |
| `placeholder` | string | 选择时间 |
| `disabled` | boolean | false |
| `minuteStep` | number | 5 |

## events
| event | payload |
|---|---|
| `update:modelValue` | string |
| `change` | string |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroTimePicker } from 'aero-vue'

const t = ref('09:30')
</script>
<template>
  <div style="max-width: 200px">
    <AeroTimePicker v-model="t" :minute-step="5" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/time-picker/demo/basic.vue

