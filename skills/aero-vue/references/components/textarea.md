# AeroTextarea（textarea）

分组：Form 表单
中文名：文本域

具名导入：

```ts
import { AeroTextarea } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string | — |
| `placeholder` | string | — |
| `disabled` | boolean | false |
| `readonly` | boolean | false |
| `error` | boolean | false |
| `maxlength` | number | — |
| `showCount` | boolean | false |
| `rows` | number | 3 |

## events
| event | payload |
|---|---|
| `update:modelValue` | string |
| `focus/blur` | FocusEvent |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroTextarea } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const v = ref('')
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 14px; max-width: 320px">
    <AeroTextarea v-model="v" :placeholder="t['textarea.multiLine']" />
    <AeroTextarea v-model="v" :placeholder="t['textarea.withCount']" :maxlength="100" show-count />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/textarea/demo/basic.vue

