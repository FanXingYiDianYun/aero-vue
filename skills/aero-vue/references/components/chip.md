# AeroChip（chip）

分组：Feedback 反馈
中文名：可关闭标签

具名导入：

```ts
import { AeroChip } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `closable` | boolean | false |
| `active` | boolean | false |

## events
| event | payload |
|---|---|
| `close` | MouseEvent |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroChip, AeroButton, useLocale } from 'aero-vue'
// chip 文案/日志/重置原硬编码中文 → 走词包 demo 组（chip 数据 Vue 3/TS 保留）
const { demo } = useLocale()
const t = demo

const all = ['Vue 3', 'TypeScript', 'Vite', 'SCSS']
const tags = ref([...all])
// 日志只存被移除的 tag（locale 无关键），文案渲染期拼词包求值——
// 原 unshift 烤串 `${t.removed}${tag}${t.removedEnd}` 已废除，切语言同步翻转
const log = ref<string[]>([])

function remove(tag: string) {
  const i = tags.value.indexOf(tag)
  if (i >= 0) tags.value.splice(i, 1)
  log.value.unshift(tag)
  if (log.value.length > 3) log.value.pop()
}
</script>
<template>
  <div class="chip-demo">
    <div class="chip-demo__row">
      <TransitionGroup name="chip-pop" tag="span" class="chip-demo__row">
        <AeroChip v-for="tp in tags" :key="tp" closable @close="remove(tp)">{{ tp }}</AeroChip>
      </TransitionGroup>
      <AeroChip active>{{ t['chip.selectedChip'] }}</AeroChip>
      <AeroChip>{{ t['chip.uncloseable'] }}</AeroChip>
    </div>
    <p v-if="log.length" class="chip-demo__log">
      <span v-for="(l, li) in log" :key="li" class="chip-demo__log-item">{{ t['chip.removed'] }}{{ l }}{{ t['chip.removedEnd'] }}</span>
    </p>
    <AeroButton v-if="tags.length < all.length" type="ghost" size="sm" @click="tags = [...all]; log = []">{{ t['chip.reset'] }}</AeroButton>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/chip/demo/basic.vue

