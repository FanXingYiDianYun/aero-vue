# AeroDialog（dialog）

分组：Feedback 反馈
中文名：对话框

具名导入：

```ts
import { AeroDialog } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | boolean | — |
| `title` | string | '' |
| `width` | string | '480px' |
| `maskClosable` | boolean | true |
| `blurMask` | boolean | true |

## events
| event | payload |
|---|---|
| `update:modelValue` | boolean |
| `close` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroDialog, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 按钮/标题/正文原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const open = ref(false)
</script>
<template>
  <div>
    <AeroButton type="primary" @click="open = true">{{ t['dialog.openBtn'] }}</AeroButton>
    <AeroDialog v-model="open" :title="t['dialog.title']">
      <p>{{ t['dialog.body'] }}</p>
      <template #footer>
        <AeroButton type="ghost" size="sm" @click="open = false">{{ t['dialog.cancel'] }}</AeroButton>
        <AeroButton type="danger" size="sm" @click="open = false">{{ t['dialog.delete'] }}</AeroButton>
      </template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/dialog/demo/basic.vue

