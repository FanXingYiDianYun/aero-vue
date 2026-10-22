# AeroParallaxBox（parallax-box）

分组：Others 配置/增强
中文名：视差漂浮几何

具名导入：

```ts
import { AeroParallaxBox } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `height` | number | 250 |
| `hint` | string | — |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroParallaxBox } from 'aero-vue'
</script>
<template>
  <AeroParallaxBox style="flex: 1; min-width: 300px">
    <!-- six floating geometries (brand colors), replicated from the demo -->
    <svg width="34" height="34" viewBox="0 0 34 34">
      <path d="M17 2 20 14 32 17 20 20 17 32 14 20 2 17 14 14Z" :fill="'var(--ui-brand)'" />
    </svg>
    <svg width="26" height="26" viewBox="0 0 26 26">
      <rect x="3" y="3" width="20" height="20" rx="5" fill="none" :stroke="'var(--ui-ink)'" stroke-width="3" />
    </svg>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" fill="none" :stroke="'var(--ui-line-2)'" stroke-width="7" />
    </svg>
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M12 2v20M2 12h20" :stroke="'var(--ui-brand)'" stroke-width="4.5" stroke-linecap="round" />
    </svg>
    <svg width="22" height="22" viewBox="0 0 22 22">
      <path d="M11 2 21 20H1Z" fill="none" :stroke="'var(--ui-ink)'" stroke-width="3" stroke-linejoin="round" />
    </svg>
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="7" :fill="'var(--ui-brand)'" />
    </svg>
  </AeroParallaxBox>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/parallax-box/demo/basic.vue

