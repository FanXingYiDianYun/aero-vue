# AeroMessageBox（message-box）

分组：Feedback 反馈
中文名：确认框

具名导入：

```ts
import { AeroMessageBox } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `confirm().message` | string | — |
| `confirm().title` | string | '' |
| `confirm().confirmText/cancelText` | string | '确定'/'取消' |
| `confirm().danger` | boolean | false |

## events
| event | payload |
|---|---|
| `confirm() → Promise<boolean>` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroMessageBox, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroToast } from 'aero-vue'
// 确认框文案/toast 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

async function ask() {
  const ok = await AeroMessageBox.confirm({
    title: t.value['messageBox.title'],
    message: t.value['messageBox.message'],
    danger: true,
    confirmText: t.value['messageBox.confirmText'],
  })
  AeroToast[ok ? 'success' : 'info'](ok ? t.value['messageBox.deleted'] : t.value['messageBox.cancelled'])
}
</script>
<template>
  <AeroButton type="danger" @click="ask">{{ t['messageBox.triggerBtn'] }}</AeroButton>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/message-box/demo/basic.vue

