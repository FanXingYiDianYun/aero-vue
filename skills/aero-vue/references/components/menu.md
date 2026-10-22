# AeroMenu（menu）

分组：Navigation 导航
中文名：导航菜单

具名导入：

```ts
import { AeroMenu } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | MenuItem[] | — |
| `modelValue` | string | — |
| `mode` | 'horizontal'|'vertical' | 'horizontal' |
| `width` | number|string | — |
| `collapsed` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | string |
| `select` | MenuItem |
| `focus` | FocusEvent |
| `blur` | FocusEvent |
| `update:collapsed` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroMenu, AeroButton, useLocale } from 'aero-vue'
import type { MenuItem } from 'aero-vue'
import { ref, computed, h, type Component } from 'vue'
// 菜单 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// demo 内联 SVG icon（线条 stroke 1.5，形状不敏感）——<component :is> 可消费的 Vue 组件
function makeIcon(paths: string[], opts?: { fill?: boolean }): Component {
  return {
    name: 'MenuDemoIcon',
    render() {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', style: 'width:18px;height:18px;display:block;flex:none' },
        paths.map((d) => h('path', { d, key: d })))
    },
  }
}
// lucide 线条（stroke 1.5 风格，形状不敏感）
const I_OVERVIEW = makeIcon(['M3 12h7M14 12h7M3 6h18M3 18h18'])
const I_DASHBOARD = makeIcon(['M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 15h8v6H3z'])
const I_MONITOR = makeIcon(['M3 4h18v12H3zM8 20h8M12 16v4'])
const I_COMPONENT = makeIcon(['M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5'])
const I_FORM = makeIcon(['M4 5h16v4H4zM4 13h10v4H4zM4 17h6M18 15h2v2h-2z'])
const I_DATA = makeIcon(['M6 3v18M6 7h12a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H6M6 13h12'])
const I_SETTINGS = makeIcon(['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8 7 17M17 7l2.8-2.8'])
const I_USER = makeIcon(['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'])

const active = ref('overview')
const collapsed = ref(false)

// 三组结构（概览/组件/设置），每项带 icon；折叠开关 demo 层用库内 Button 控制
const items = computed<MenuItem[]>(() => [
  { key: 'overview', label: t.value['menu.groupOverview'], group: t.value['menu.groupOverview'], icon: I_OVERVIEW },
  { key: 'dashboard', label: t.value['menu.dashboard'], group: t.value['menu.groupOverview'], icon: I_DASHBOARD },
  { key: 'monitor', label: t.value['menu.monitor'], group: t.value['menu.groupOverview'], icon: I_MONITOR },
  { key: 'component', label: t.value['menu.components'], group: t.value['menu.groupComponents'], icon: I_COMPONENT },
  { key: 'form', label: t.value['menu.form'], group: t.value['menu.groupComponents'], icon: I_FORM },
  { key: 'data', label: t.value['menu.data'], group: t.value['menu.groupComponents'], icon: I_DATA },
  { key: 'settings', label: t.value['menu.groupSettings'], group: t.value['menu.groupSettings'], icon: I_SETTINGS },
  { key: 'account', label: t.value['menu.account'], group: t.value['menu.groupSettings'], icon: I_USER },
])
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 18px; min-width: 0; max-width: 100%">
    <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap">
      <AeroButton size="sm" type="outline" @click="collapsed = !collapsed">{{ collapsed ? t['menu.expand'] : t['menu.collapse'] }}</AeroButton>
      <span style="font-size: 12px; color: var(--ui-ink-3); font-family: var(--ui-font-mono)">{{ t['menu.collapseHint'] }}</span>
    </div>
    <AeroMenu
      v-model="active"
      v-model:collapsed="collapsed"
      :items="items"
      mode="vertical"
    />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/menu/demo/basic.vue

