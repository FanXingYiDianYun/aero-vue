# AeroProgress（progress）

分组：DataDisplay 数据展示
中文名：进度条

具名导入：

```ts
import { AeroProgress } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `percent` | number | — |
| `shimmer` | boolean | true |
| `status` | 'normal'|'success'|'error' | 'normal' |
| `showText` | boolean | true |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroProgress } from 'aero-vue'
import { AeroSlider } from 'aero-vue'

const p = ref(66)
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 320px">
    <AeroProgress :percent="p" />
    <AeroProgress :percent="100" status="success" :shimmer="false" />
    <AeroProgress :percent="32" status="error" :shimmer="false" />
    <!-- 控制滑块统一用项目 Slider 组件（替代原生 input[type=range]） -->
    <AeroSlider v-model="p" :min="0" :max="100" :show-scale="false" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/progress/demo/basic.vue

