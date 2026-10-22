# AeroConfigProvider（config-provider）

分组：Others 配置/增强
中文名：配置注入

具名导入：

```ts
import { AeroConfigProvider } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `theme` | 'light'|'dark' | — |
| `preset` | Preset | — |
| `namespace` | string | — |
| `locale` | 'zh-cn'|'en-us' | 'zh-cn' |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroConfigProvider, AeroBadge, useLocale } from 'aero-vue'
// demo 空壳修复——前后对比可见：默认（无包裹）vs provider 注入（dark + violet）
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div class="cp-demo">
    <div class="cp-demo__panel">
      <b class="cp-demo__label">{{ t['configProvider.default'] }}</b>
      <AeroBadge type="soft" dot>{{ t['configProvider.badge'] }}</AeroBadge>
    </div>
    <AeroConfigProvider theme="dark" preset="violet">
      <div class="cp-demo__panel">
        <b class="cp-demo__label">{{ t['configProvider.injected'] }}</b>
        <AeroBadge type="soft" dot>{{ t['configProvider.badge'] }}</AeroBadge>
      </div>
    </AeroConfigProvider>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/config-provider/demo/basic.vue

