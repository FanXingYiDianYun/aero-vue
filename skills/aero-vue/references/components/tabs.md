# AeroTabs（tabs）

分组：Navigation 导航
中文名：标签页

具名导入：

```ts
import { AeroTabs } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string|number | — |
| `tabs` | {key,label}[] | — |

## events
| event | payload |
|---|---|
| `change` | key |
| `update:modelValue` | string|number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroTabs } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const k = ref('a')
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const tabs = computed(() => [
  { key: 'a', label: t.value['tabs.basic'] },
  { key: 'b', label: t.value['tabs.style'] },
  { key: 'c', label: t.value['tabs.motion'] },
])
const panels = computed<Record<string, string>>(() => ({
  a: t.value['tabs.basicPanel'],
  b: t.value['tabs.stylePanel'],
  c: t.value['tabs.motionPanel'],
}))
</script>
<template>
  <AeroTabs v-model="k" :tabs="tabs">
    <template #default="{ active }">
      <div style="color: var(--ui-ink-2); font-size: 14px">{{ panels[active] }}</div>
    </template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/tabs/demo/basic.vue

