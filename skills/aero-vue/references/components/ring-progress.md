# AeroRingProgress（ring-progress）

分组：DataDisplay 数据展示
中文名：环形进度

具名导入：

```ts
import { AeroRingProgress } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `percent` | number | — |
| `label` | string | '' |
| `sublabel` | string | '' |
| `size` | number | 130 |
| `stroke` | number | 11 |
| `width` | number | 130 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroRingProgress } from 'aero-vue'
import { AeroSlider } from 'aero-vue'

const p = ref(72)
</script>
<template>
  <div style="display: flex; gap: 20px; align-items: center">
    <AeroRingProgress :percent="p" sublabel="CPU LOAD" />
    <!-- 控制滑块统一用项目 Slider 组件（替代原生 input[type=range]） -->
    <AeroSlider v-model="p" :min="0" :max="100" :show-scale="false" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/ring-progress/demo/basic.vue

