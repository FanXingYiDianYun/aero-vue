# AeroBadge（badge）

分组：DataDisplay 数据展示
中文名：徽章

具名导入：

```ts
import { AeroBadge } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `type` | 'solid'|'soft'|'line'|'dark'|'ok'|'warn'|'err' | 'soft' |
| `dot` | boolean | false |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { AeroBadge, AeroInput, useLocale } from 'aero-vue'
// hint/场景文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// 初始值/默认值来自词包——用户未改过（dirty=false）时，语言切换复位为当前语言默认
const custom = ref(t.value['badge.defaultText'])
const dirty = ref(false)
watch(custom, (v) => { dirty.value = v !== t.value['badge.defaultText'] })
watch(
  () => t.value['badge.defaultText'],
  (v) => {
    if (!dirty.value) custom.value = v
  },
)
const types = ['solid', 'soft', 'line', 'dark', 'ok', 'warn', 'err'] as const
</script>
<template>
  <div class="badge-demo">
    <div class="badge-demo__row">
      <AeroBadge v-for="tp in types" :key="tp" :type="tp" :dot="tp === 'ok' || tp === 'err'">{{ tp }}</AeroBadge>
    </div>
    <div class="badge-demo__row">
      <span class="hint-mono">{{ t['badge.customLabel'] }}</span>
      <AeroBadge type="solid">{{ custom }}</AeroBadge>
      <AeroInput v-model="custom" :width="150" :maxlength="14" />
    </div>
    <div class="badge-demo__row">
      <span class="hint-mono">{{ t['badge.dotLabel'] }}</span>
      <AeroBadge type="ok" dot>{{ t['badge.buildPass'] }}</AeroBadge>
      <AeroBadge type="warn" dot>{{ t['badge.degraded'] }}</AeroBadge>
      <AeroBadge type="err" dot>{{ t['badge.deployFail'] }}</AeroBadge>
    </div>
    <div class="badge-demo__row">
      <span class="hint-mono">{{ t['badge.comboLabel'] }}</span>
      <AeroBadge type="soft">Beta</AeroBadge>
      <AeroBadge type="line">v0.1.0</AeroBadge>
      <AeroBadge type="dark">OSS</AeroBadge>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/badge/demo/basic.vue

