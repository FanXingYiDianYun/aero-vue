# AeroTerminal（terminal）

分组：DataDisplay 数据展示
中文名：终端

具名导入：

```ts
import { AeroTerminal } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `lines` | TermLine[] | — |
| `typeSpeed` | number | 26 |
| `lineDelay` | number | 300 |
| `title` | string | 'aero@terminal' |

## events
| event | payload |
|---|---|
| `done` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroTerminal } from 'aero-vue'
import type { TermLine } from 'aero-vue'

const lines: TermLine[] = [
  { text: '$ pnpm add aero-vue', type: 'cmd' },
  { text: '+ aero-vue 0.1.0', type: 'ok' },
  { text: '$ pnpm build', type: 'cmd' },
  { text: 'building for production...', type: 'live' },
  { text: 'done in 1.2s', type: 'ok' },
]
</script>
<template>
  <AeroTerminal :lines="lines" title="ztk@aero" style="max-width: 480px" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/terminal/demo/basic.vue

