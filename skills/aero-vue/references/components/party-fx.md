# useParty()（party-fx）

分组：Others 配置/增强
中文名：礼花特效

组合式函数，经包主入口引入：

```ts
import { useParty } from 'aero-vue'
```

## props
（无 props 表——组合式/配置型组件，见示例）


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroButton, useLocale } from 'aero-vue'
import { party } from 'aero-vue'
// 按钮/说明原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
    <AeroButton type="primary" @click="party($event.clientX, $event.clientY)">{{ t['partyFx.btn'] }}</AeroButton>
    <span style="font-size:13px;color:var(--ui-ink-3)">{{ t['partyFx.note'] }}</span>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/party-fx/demo/basic.vue

