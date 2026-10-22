# AeroSortList（sort-list）

分组：Mobile 移动端
中文名：拖动排序

具名导入：

```ts
import { AeroSortList } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | AeroSortItem[] | — |
| `width` | number|string | — |

## events
| event | payload |
|---|---|
| `sorted` | AeroSortItem[] |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroSortList, AeroToast, useLocale } from 'aero-vue'
import type { AeroSortItem } from 'aero-vue'
// 条目 meta/toast 原硬编码中文 → 走词包 demo 组
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
import { computed, ref } from 'vue'
const { demo } = useLocale()
const t = demo

// demo 状态只存 locale 无关的「键序」（name 键 + meta 词包键），
// 文案一律渲染期 t() 求值；拖拽只回写键序（onSorted），永不回写字符串。
// 库侧 watch 同步守卫要求 inner 键序 === props.items 键序——order 化后
// 两者恒等（都=用户当前序），切语言时库同步新文案，翻转恢复。
const META_KEY: Record<string, string> = {
  'web-portal': 'sortList.meta12',
  'api-gateway': 'sortList.meta18',
  'billing-svc': 'sortList.meta4',
  'admin-console': 'sortList.meta2',
}
const order = ref(['web-portal', 'api-gateway', 'billing-svc', 'admin-console'])

const items = computed<AeroSortItem[]>(() =>
  order.value.map((name) => ({ name, meta: t.value[META_KEY[name]] })),
)

function onSorted(list: AeroSortItem[]) {
  order.value = list.map((i) => i.name)
  AeroToast.info(t.value['sortList.updated'], { title: t.value['sortList.dragTitle'] })
}
</script>
<template>
  <AeroSortList :items="items" :width="280" @sorted="onSorted" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/sort-list/demo/basic.vue

