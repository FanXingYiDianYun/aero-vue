# AeroTransfer（transfer）

分组：Form 表单
中文名：穿梭框

具名导入：

```ts
import { AeroTransfer } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `data` | TransferItem[] | — |
| `modelValue` | string[] | — |
| `titles` | [string,string] | ['来源','目标'] |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | string[] |
| `change` | string[] |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroTransfer } from 'aero-vue'

const target = ref<string[]>(['vite'])
const data = [
  { key: 'vue', label: 'Vue 3' },
  { key: 'vite', label: 'Vite' },
  { key: 'sass', label: 'Sass', disabled: true },
  { key: 'ts', label: 'TypeScript' },
  { key: 'pnpm', label: 'pnpm' },
]
</script>
<template>
  <AeroTransfer v-model="target" :data="data" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/transfer/demo/basic.vue

