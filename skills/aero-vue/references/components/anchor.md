# AeroAnchor（anchor）

分组：Navigation 导航
中文名：锚点

具名导入：

```ts
import { AeroAnchor } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | AnchorItem[] | — |
| `container` | string | — |
| `offset` | number | 20 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { AeroAnchor, useLocale } from 'aero-vue'
// 节标题/正文/锚点 labels 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const secItems = computed(() => [
  { key: 'sec-1', label: t.value['anchor.sec1'] },
  { key: 'sec-2', label: t.value['anchor.sec2'] },
  { key: 'sec-3', label: t.value['anchor.sec3'] },
])
</script>
<template>
  <div style="display: flex; gap: 30px">
    <div style="height: 220px; overflow-y: auto; flex: 1; border: 2px dashed var(--ui-line-2); border-radius: 14px; padding: 14px" id="anchor-scroll">
      <h3 id="sec-1" style="margin: 0 0 90px">{{ t['anchor.sec1'] }}</h3>
      <p style="color: var(--ui-ink-2); font-size: 13.5px; line-height: 1.8">{{ t['anchor.note1'] }}</p>
      <h3 id="sec-2" style="margin: 90px 0">{{ t['anchor.sec2'] }}</h3>
      <p style="color: var(--ui-ink-2); font-size: 13.5px; line-height: 1.8">{{ t['anchor.note2'] }}</p>
      <h3 id="sec-3" style="margin: 90px 0 0">{{ t['anchor.sec3'] }}</h3>
      <p style="color: var(--ui-ink-2); font-size: 13.5px; line-height: 1.8; margin-top: 90px">{{ t['anchor.note3'] }}</p>
    </div>
    <AeroAnchor
      :items="secItems"
      container="#anchor-scroll"
      :offset="8"
    />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/anchor/demo/basic.vue

