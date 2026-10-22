# AeroDrawer（drawer）

分组：Feedback 反馈
中文名：抽屉

具名导入：

```ts
import { AeroDrawer } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | boolean | — |
| `title` | string | '' |
| `width` | string | '400px' |
| `maskClosable` | boolean | true |

## events
| event | payload |
|---|---|
| `update:modelValue` | boolean |
| `close` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroDrawer, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroChip } from 'aero-vue'
// 按钮/标题/标签/正文原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const open = ref(false)
</script>
<template>
  <div>
    <AeroButton type="outline" @click="open = true">{{ t['drawer.openBtn'] }}</AeroButton>
    <AeroDrawer v-model="open" :title="t['drawer.title']">
      <div style="display: flex; flex-direction: column; gap: 14px">
        <AeroChip>{{ t['drawer.tag1'] }}</AeroChip>
        <AeroChip>{{ t['drawer.tag2'] }}</AeroChip>
        <p style="color: var(--ui-ink-2); font-size: 13.5px">{{ t['drawer.body'] }}</p>
      </div>
    </AeroDrawer>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/drawer/demo/basic.vue

