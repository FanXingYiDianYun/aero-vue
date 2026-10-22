# AeroBottomSheet（bottom-sheet）

分组：Mobile 移动端
中文名：底部抽屉

具名导入：

```ts
import { AeroBottomSheet } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `title` | string | '' |
| `rows` | [string,string][] | — |
| `open` | boolean | false |
| `bgTitle` | string | — |
| `bgHint` | string | — |

## events
| event | payload |
|---|---|
| `change` | boolean |
| `update:open` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroBottomSheet, AeroToast, useLocale } from 'aero-vue'
// 标题/行 label/toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <AeroBottomSheet
    :title="t['bottomSheet.title']"
    style="width: 280px; min-height: 220px"
    :rows="[[t['bottomSheet.duration'], '2.1s'], [t['bottomSheet.cacheHit'], '92%'], [t['bottomSheet.artifact'], '42MB']]"
    @change="(v) => v && AeroToast.info(t['bottomSheet.expanded'])"
  />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/bottom-sheet/demo/basic.vue

