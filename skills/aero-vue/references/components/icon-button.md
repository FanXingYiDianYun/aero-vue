# AeroIconButton（icon-button）

分组：Basic 基础
中文名：图标按钮

具名导入：

```ts
import { AeroIconButton } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `icon` | AeroIconName | — |
| `disabled` | boolean | false |
| `loading` | boolean | false |
| `dot` | boolean | false |
| `label` | string | — |

## events
| event | payload |
|---|---|
| `click` | MouseEvent |
| `focus` | FocusEvent |
| `blur` | FocusEvent |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroIconButton, useLocale } from 'aero-vue'
// aria label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 12px">
    <AeroIconButton icon="bell" dot :label="t['iconButton.notify']" />
    <AeroIconButton icon="sun" :label="t['iconButton.theme']" />
    <AeroIconButton icon="search" :label="t['iconButton.search']" />
    <AeroIconButton icon="menu" :label="t['iconButton.menu']" />
    <AeroIconButton icon="settings" disabled :label="t['iconButton.settings']" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/icon-button/demo/basic.vue

