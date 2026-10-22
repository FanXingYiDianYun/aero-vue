# AeroRadio（radio）

分组：Form 表单
中文名：单选

具名导入：

```ts
import { AeroRadio } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `value` | string|number | — |
| `disabled` | boolean | false |
| `modelValue` | boolean|string|number | false |

## events
| event | payload |
|---|---|
| `change` | string|number|boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroRadio } from 'aero-vue'
import { AeroRadioGroup } from 'aero-vue'

const v = ref('vue')
</script>
<template>
  <AeroRadioGroup v-model="v">
    <AeroRadio value="vue">Vue</AeroRadio>
    <AeroRadio value="react">React</AeroRadio>
    <AeroRadio value="svelte">Svelte</AeroRadio>
    <AeroRadio value="solid" disabled>Solid</AeroRadio>
  </AeroRadioGroup>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/radio/demo/basic.vue

