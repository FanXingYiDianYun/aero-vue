# AeroTimeline（timeline）

分组：DataDisplay 数据展示
中文名：时间线

具名导入：

```ts
import { AeroTimeline } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | AeroTimelineItem[] | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroTimeline } from 'aero-vue'
import type { AeroTimelineItem } from 'aero-vue'
// demo 文案走词包 demo 组
import { computed } from 'vue'
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const items = computed<AeroTimelineItem[]>(() => [
  { icon: 'git-commit', date: '2026-09-01', chip: 'INIT', title: t.value['timeline.item1'], desc: t.value['timeline.item1Desc'] },
  { icon: 'code', date: '2026-09-05', chip: 'DEV', title: t.value['timeline.item2'], desc: t.value['timeline.item2Desc'] },
  { icon: 'rocket', date: '2026-09-13', chip: 'NEXT', title: t.value['timeline.item3'], desc: t.value['timeline.item3Desc'] },
])
</script>
<template>
  <AeroTimeline :items="items" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/timeline/demo/basic.vue

