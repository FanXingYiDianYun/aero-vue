# AeroForm + AeroFormItem（form）

分组：Form 表单
中文名：表单

具名导入：

```ts
import { AeroForm + AeroFormItem } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `submit` | () => void | — |
| `AeroFormItem.label` | string | '' |
| `AeroFormItem.required` | boolean | false |
| `AeroFormItem.hint/error` | string | '' |

## events
| event | payload |
|---|---|
| `submit` | Event |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroForm, useLocale } from 'aero-vue'
import { AeroFormItem } from 'aero-vue'
import { AeroInput } from 'aero-vue'
import { AeroTextarea } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 表单 label/提示/校验文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const name = ref('')
const desc = ref('')
const err = ref('')

function onBlur() {
  err.value = name.value ? '' : t.value['form.required']
}
function submit() {
  if (!name.value) {
    err.value = t.value['form.required']
    return
  }
  alert(`${t.value['form.submit']}${name.value}`)
}
</script>
<template>
  <AeroForm style="max-width: 380px" @submit="submit">
    <AeroFormItem :label="t['form.projectLabel']" required :hint="t['form.charHint']" :error="err" style="width: 100%">
      <AeroInput v-model="name" :placeholder="t['form.namePlaceholder']" @blur="onBlur" />
    </AeroFormItem>
    <AeroFormItem :label="t['form.descLabel']" style="width: 100%">
      <AeroTextarea v-model="desc" :placeholder="t['form.descPlaceholder']" />
    </AeroFormItem>
    <AeroButton type="primary" native-type="submit">{{ t['form.submitBtn'] }}</AeroButton>
  </AeroForm>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/form/demo/basic.vue

