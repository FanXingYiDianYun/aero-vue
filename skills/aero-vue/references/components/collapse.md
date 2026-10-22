# AeroCollapse（collapse）

分组：DataDisplay 数据展示
中文名：折叠面板

具名导入：

```ts
import { AeroCollapse } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | CollapseItem[] | — |
| `modelValue` | string | — |
| `accordion` | boolean | true |

## events
| event | payload |
|---|---|
| `update:modelValue` | string|undefined |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroCollapse, useLocale } from 'aero-vue'
// 折叠面板标题/正文原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const open = ref('a')
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const items = computed(() => [
  { key: 'a', title: t.value['collapse.q1'], content: t.value['collapse.a1'] },
  { key: 'b', title: t.value['collapse.q2'], content: t.value['collapse.a2'] },
  { key: 'c', title: t.value['collapse.q3'], content: t.value['collapse.a3'] },
])
</script>
<template>
  <AeroCollapse v-model="open" :items="items" style="max-width: 480px" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/collapse/demo/basic.vue

