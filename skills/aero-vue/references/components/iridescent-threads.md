# AeroIridescentThreads（iridescent-threads）

分组：Others 配置/增强
中文名：虹彩丝线

具名导入：

```ts
import { AeroIridescentThreads } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `count` | number | 7 |
| `cycle` | number | 32 |
| `hueShift` | number | 0 |
| `opacity` | number | 1 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroIridescentThreads, AeroSwitch, AeroTypography, useLocale } from 'aero-vue'
// 面板文案/开关 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const hueShift = ref(0)
/** 开关控制是否启相位漂移（switch 要 boolean，hueShift 保留 number 供组件消费） */
const driftOn = ref(false)
</script>
<template>
  <div class="it-stage">
    <AeroIridescentThreads :count="7" :cycle="32" :hue-shift="driftOn ? hueShift : 0" />
    <div class="it-panel">
      <AeroTypography level="body">{{ t['iridescent.desc'] }}</AeroTypography>
      <div class="it-panel__row">
        <AeroSwitch v-model="driftOn">{{ t['iridescent.hueDrift'] }}</AeroSwitch>
      </div>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/iridescent-threads/demo/basic.vue

