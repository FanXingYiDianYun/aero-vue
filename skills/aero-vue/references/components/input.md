# AeroInput（input）

分组：Form 表单
中文名：输入框

具名导入：

```ts
import { AeroInput } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string|number | — |
| `placeholder` | string | — |
| `disabled` | boolean | false |
| `readonly` | boolean | false |
| `error` | boolean | false |
| `prefix` | string | — |
| `suffix` | string | — |
| `type` | string | '' |
| `clearable` | boolean | false |
| `maxlength` | number | — |
| `width` | number|string | — |

## events
| event | payload |
|---|---|
| `update:modelValue` | string |
| `change` | Event |
| `clear` | — |
| `focus/blur` | FocusEvent |
| `input` | Event |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroInput, useLocale } from 'aero-vue'
// placeholder/校验文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const v = ref('')
const err = ref('')
function onBlur() {
  err.value = v.value ? '' : t.value['input.required']
}
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 14px; max-width: 300px">
    <AeroInput v-model="v" :placeholder="t['input.basicPlaceholder']" clearable />
    <AeroInput v-model="v" prefix="npm install" :placeholder="t['input.prefixPlaceholder']" />
    <AeroInput v-model="v" :placeholder="t['input.errorPlaceholder']" :error="!!err" @blur="onBlur" />
    <AeroInput :placeholder="t['input.disabledPlaceholder']" disabled :model-value="t['input.disabledValue']" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/input/demo/basic.vue

