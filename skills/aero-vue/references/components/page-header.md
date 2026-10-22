# AeroPageHeader（page-header）

分组：Navigation 导航
中文名：页头

具名导入：

```ts
import { AeroPageHeader } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `title` | string | — |
| `subtitle` | string | — |
| `back` | boolean | false |

## events
| event | payload |
|---|---|
| `back` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroPageHeader, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 标题/副标题/按钮原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="max-width: 640px">
    <AeroPageHeader :title="t['pageHeader.title']" :subtitle="t['pageHeader.subtitle']" back @back="() => {}">
      <AeroButton type="outline" size="sm">{{ t['pageHeader.exportBtn'] }}</AeroButton>
    </AeroPageHeader>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/page-header/demo/basic.vue

