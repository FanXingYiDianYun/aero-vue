# AeroSpace（space）

分组：Basic 基础
中文名：间距

具名导入：

```ts
import { AeroSpace } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `gap` | number | 14 |
| `direction` | 'horizontal'|'vertical' | 'horizontal' |
| `justify` | string | — |
| `align` | string | — |
| `wrap` | boolean | true |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroSpace, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 按钮/占位/日志文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const clicks = ref<string[]>([])
const gap = ref(12)

function onClick(label: string) {
  clicks.value.unshift(label)
  if (clicks.value.length > 6) clicks.value.pop()
}
</script>
<template>
  <AeroSpace direction="vertical" :gap="18">
    <AeroSpace :gap="gap">
      <AeroButton type="primary" size="sm" @click="onClick('Primary')">{{ t['space.clickPrimary'] }}</AeroButton>
      <AeroButton type="outline" size="sm" @click="onClick('Outline')">{{ t['space.clickOutline'] }}</AeroButton>
      <AeroButton type="ghost" size="sm" @click="onClick('Ghost')">{{ t['space.clickGhost'] }}</AeroButton>
    </AeroSpace>
    <AeroSpace :gap="10" align="center">
      <span class="hint-mono">gap:</span>
      <AeroButton type="outline" size="sm" @click="gap = gap === 12 ? 32 : 12">
        {{ gap === 12 ? t['space.to32'] : t['space.to12'] }}
      </AeroButton>
    </AeroSpace>
    <AeroSpace :gap="24" justify="between">
      <span>{{ t['space.leftEnd'] }}</span>
      <span>{{ t['space.rightEnd'] }}</span>
    </AeroSpace>
    <AeroSpace direction="vertical" :gap="6">
      <span>{{ t['space.vertA'] }}</span>
      <span>{{ t['space.vertB'] }}</span>
    </AeroSpace>
    <div v-if="clicks.length" class="click-log">
      <span class="hint-mono">{{ t['space.lastClick'] }}</span>
      <span v-for="(c, i) in clicks" :key="i" class="click-item">{{ c }}</span>
    </div>
  </AeroSpace>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/space/demo/basic.vue

