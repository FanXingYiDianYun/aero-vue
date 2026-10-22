# AeroSegmented（segmented）

分组：DataDisplay 数据展示
中文名：分段器

具名导入：

```ts
import { AeroSegmented } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string|number | — |
| `options` | SegmentedOption[] | — |
| `disabled` | boolean | false |
| `block` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | string|number |
| `change` | string|number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroSegmented, useLocale } from 'aero-vue'
// 分段选项/说明文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const m = ref('month')
const view = ref('list')

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const views = computed<Record<string, string>>(() => ({
  list: t.value['segmented.listDesc'],
  grid: t.value['segmented.gridDesc'],
  kanban: t.value['segmented.kanbanDesc'],
}))
</script>
<template>
  <div class="seg-demo">
    <div class="seg-demo__row">
      <AeroSegmented
        v-model="m"
        :options="[
          { label: t['segmented.monthly'], value: 'month' },
          { label: t['segmented.yearly'], value: 'year' },
        ]"
      />
      <span class="seg-demo__hint">{{ t['segmented.billing'] }}{{ m === 'month' ? t['segmented.monthly'] : t['segmented.yearly'] }}</span>
    </div>
    <div class="seg-demo__row">
      <AeroSegmented
        v-model="view"
        :options="[
          { label: t['segmented.list'], value: 'list' },
          { label: t['segmented.grid'], value: 'grid' },
          { label: t['segmented.kanban'], value: 'kanban' },
        ]"
      />
      <span class="seg-demo__hint">{{ t['segmented.viewLabel'] }}{{ view }}</span>
    </div>
    <div class="seg-demo__panel">{{ views[view] }}</div>  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/segmented/demo/basic.vue

