# AeroAnnounce（announce）

分组：Feedback 反馈
中文名：通知横幅

具名导入：

```ts
import { AeroAnnounce } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `icon` | AeroIconName | 'sparkles' |
| `open` | boolean | undefined |
| `storageKey` | string | '' |
| `animated` | boolean | true |
| `marquee` | boolean | true |
| `actionHref` | string | — |

## events
| event | payload |
|---|---|
| `close` | — |
| `closed` | — |
| `update:open` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroAnnounce, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
// 横幅标题/正文/开关/按钮/注释文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// 受控显隐：v-model:open 外部接管，关闭后仍可重新打开（可逆）
const open = ref(true)
// 跑马灯开关：false 禁用（文字溢出直接截断）；true 自适应（仅装不下才滚动）
const marquee = ref(true)
// 长文案切换：演示跑马灯在文字溢出时的效果
const longText = ref(false)
</script>
<template>
  <div class="ann-demo">
    <div class="ann-demo__bar">
      <AeroAnnounce
        v-model:open="open"
        :marquee="marquee"
        @close="open = false"
        action-href="https://github.com/FanXingYiDianYun/aero-vue"
      >
        <template #title>{{ t['announce.title'] }}</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/announce/demo/basic.vue

