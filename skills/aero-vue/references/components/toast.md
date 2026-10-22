# AeroToast（toast）

分组：Feedback 反馈
中文名：轻提示

具名导入：

```ts
import { AeroToast } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `show().type` | 'success'|'error'|'warn'|'info' | '' |
| `show().message` | string | — |
| `show().duration` | number | 4200 |

## events
| event | payload |
|---|---|
| `success/error/warn/info(msg, opts?)` | — |
| `show(opts)` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroToast } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap">
    <AeroButton size="sm" type="primary" @click="AeroToast.success(t['toast.successMsg'])">{{ t['toast.success'] }}</AeroButton>
    <AeroButton size="sm" type="danger" @click="AeroToast.error(t['toast.errorMsg'])">{{ t['toast.error'] }}</AeroButton>
    <AeroButton size="sm" @click="AeroToast.warn(t['toast.warnMsg'])">{{ t['toast.warn'] }}</AeroButton>
    <AeroButton size="sm" type="ghost" @click="AeroToast.info(t['toast.infoMsg'])">{{ t['toast.info'] }}</AeroButton>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/toast/demo/basic.vue

