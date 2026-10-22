# AeroActionButtons（action-buttons）

分组：Basic 基础
中文名：操作钮

具名导入：

```ts
import { AeroActionButtons } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `rejectTip` | string | '回滚' |
| `acceptTip` | string | '部署' |

## events
| event | payload |
|---|---|
| `reject` | — |
| `accept` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroActionButtons, AeroToast, useLocale } from 'aero-vue'
// toast 文案原硬编码中文 → 走词包 demo 组，随 ConfigProvider locale 翻转
const { demo } = useLocale()
</script>
<template>
  <AeroActionButtons
    @reject="AeroToast.warn(demo['actionButtons.reject'])"
    @accept="AeroToast.success(demo['actionButtons.accept'])"
  />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/action-buttons/demo/basic.vue

