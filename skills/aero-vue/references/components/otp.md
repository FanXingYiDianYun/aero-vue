# AeroOTP（otp）

分组：Form 表单
中文名：验证码

具名导入：

```ts
import { AeroOTP } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string | — |
| `length` | number | 6 |
| `numeric` | boolean | true |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `complete` | string |
| `update:modelValue` | string |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroOTP, AeroToast, useLocale } from 'aero-vue'
// toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const code = ref('')
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <AeroOTP v-model="code" @complete="(v) => AeroToast.success(`${t['otp.codeLabel']}${v}`)" />
    <span style="font-size: 12.5px; color: var(--ui-ink-3); font-family: var(--ui-font-mono)">value = {{ code || '…' }}</span>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/otp/demo/basic.vue

