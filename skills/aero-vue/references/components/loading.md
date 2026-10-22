# AeroLoading（loading）

分组：Feedback 反馈
中文名：加载

具名导入：

```ts
import { AeroLoading } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `loading` | boolean | false |
| `tip` | string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroLoading, useLocale } from 'aero-vue'
import { AeroCard } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// tip/卡片/按钮文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const loading = ref(true)
</script>
<template>
  <div style="max-width: 380px">
    <AeroLoading :loading="loading" :tip="t['loading.tip']">
      <AeroCard>
        <h4>{{ t['loading.wrapped'] }}</h4>
        <p>{{ t['loading.wrappedBody'] }}</p>
      </AeroCard>
    </AeroLoading>
    <AeroButton size="sm" type="outline" style="margin-top: 12px" @click="loading = !loading">
      {{ t['loading.toggle'] }}
    </AeroButton>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/loading/demo/basic.vue

