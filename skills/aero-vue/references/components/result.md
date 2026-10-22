# AeroResult（result）

分组：DataDisplay 数据展示
中文名：结果页

具名导入：

```ts
import { AeroResult } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `status` | 'success'|'error'|'warn'|'info' | 'info' |
| `title` | string | — |
| `desc` | string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroResult, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 结果页文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; width: 100%">
    <AeroResult status="success" :title="t['result.paySuccess']" :desc="t['result.paySuccessDesc']" style="flex: 1; min-width: 260px">
      <AeroButton type="primary" size="sm">{{ t['result.viewOrder'] }}</AeroButton>
    </AeroResult>
    <AeroResult status="error" :title="t['result.payFail']" :desc="t['result.payFailDesc']" style="flex: 1; min-width: 260px">
      <AeroButton type="outline" size="sm">{{ t['result.retry'] }}</AeroButton>
    </AeroResult>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/result/demo/basic.vue

