# AeroStatistic（statistic）

分组：DataDisplay 数据展示
中文名：统计数值

具名导入：

```ts
import { AeroStatistic } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `value` | number | — |
| `prefix` | string | '' |
| `suffix` | string | '' |
| `label` | string | '' |
| `animated` | boolean | true |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroStatistic, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 统计 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const n = ref(12864)
</script>
<template>
  <div style="display: flex; gap: 40px; align-items: center; flex-wrap: wrap">
    <AeroStatistic :value="n" label="GitHub Stars" />
    <AeroStatistic :value="99.9" suffix="%" :label="t['statistic.availability']" />
    <AeroStatistic :value="42" prefix="v" :label="t['statistic.componentCount']" :animated="false" />
    <AeroButton size="sm" @click="n += 500">+500</AeroButton>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/statistic/demo/basic.vue

