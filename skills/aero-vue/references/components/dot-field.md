# AeroDotField（dot-field）

分组：Others 配置/增强
中文名：点阵背景

具名导入：

```ts
import { AeroDotField } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `shape` | 'dot'|'x'|'diamond'|'ring' | 'dot' |
| `density` | number | 26 |
| `flow` | boolean | false |
| `speed` | number | 1 |
| `color` | string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroDotField, useLocale } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
import { AeroTypography } from 'aero-vue'
import { AeroSegmented } from 'aero-vue'
// 面板文案/开关 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const flow = ref(true)
const shape = ref<'dot' | 'x' | 'diamond' | 'ring'>('diamond')
const shapes = ['dot', 'x', 'diamond', 'ring'] as const
const shapeOptions = shapes.map((s) => ({ label: s, value: s }))
</script>
<template>
  <!-- 容器脱离舞台 flex 流（绝对定位），让 DotField 的 inset:0 以它为基准铺满 -->
  <div class="df-stage">
    <AeroDotField :shape="shape" :flow="flow" :density="24" />
    <!-- 控制条移到左下角，别挡住极光扫过的整片区域 -->
    <div class="df-panel">
      <AeroTypography level="body">{{ t['dotField.title'] }}</AeroTypography>
      <div class="df-panel__row">
        <AeroSwitch v-model="flow">{{ t['dotField.flow'] }}</AeroSwitch>
        <AeroSegmented v-model="shape" :options="shapeOptions" />
      </div>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/dot-field/demo/basic.vue

