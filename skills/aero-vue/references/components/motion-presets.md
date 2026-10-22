# AeroMotionPresets（motion-presets）

分组：Others 配置/增强
中文名：动效预设

具名导入：

```ts
import { AeroMotionPresets } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `name` | 'pulse'|'bounce'|'shake'|'wiggle'|'float'|'spin' | — |
| `animated` | boolean | false |
| `duration` | string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroMotionPresets, useLocale } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
import { useMotion } from 'aero-vue'
import type { MotionName } from 'aero-vue'
// 开关 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const names: MotionName[] = ['pulse', 'bounce', 'shake', 'wiggle', 'float', 'spin']
// 全局动效门控：开关联动 html[data-motion]，影响全库循环动画（GPU 断路方案）
const { state, setEnabled } = useMotion()
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <AeroSwitch :model-value="state.enabled" @update:model-value="(v) => setEnabled(v)">{{ t['motionPresets.enableLabel'] }}</AeroSwitch>
    <div style="display: flex; gap: 14px; flex-wrap: wrap">
      <AeroMotionPresets v-for="n in names" :key="n" :name="n" :animated="state.enabled" />
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/motion-presets/demo/basic.vue

