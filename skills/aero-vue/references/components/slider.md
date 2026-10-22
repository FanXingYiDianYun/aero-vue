# AeroSlider（slider）

分组：Form 表单
中文名：滑块

具名导入：

```ts
import { AeroSlider } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | number | 0 |
| `min/max` | number | 0/100 |
| `step` | number | 1 |
| `showScale` | boolean | true |
| `startLabel/endLabel` | string | — |
| `unit` | string | '' |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | number |
| `change` | number |
| `focus` | FocusEvent |
| `blur` | FocusEvent |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroSlider } from 'aero-vue'

const v = ref(50)
</script>
<template>
  <AeroSlider v-model="v" start-label="0%" end-label="100%" unit="%" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/slider/demo/basic.vue

