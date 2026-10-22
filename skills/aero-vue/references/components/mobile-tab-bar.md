# AeroMobileTabBar（mobile-tab-bar）

分组：Mobile 移动端
中文名：底部标签栏

具名导入：

```ts
import { AeroMobileTabBar } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | AeroMobileTabItem[] | — |
| `modelValue` | number | 0 |

## events
| event | payload |
|---|---|
| `change` | number |
| `update:modelValue` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroMobileTabBar, useLocale } from 'aero-vue'
// 底部标签 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const act = ref(0)
</script>
<template>
  <div style="width: 300px">
    <AeroMobileTabBar
      v-model="act"
      :items="[
        { icon: 'home', label: t['mobileTabBar.home'] },
        { icon: 'rocket', label: t['mobileTabBar.deploy'] },
        { icon: 'activity', label: t['mobileTabBar.monitor'] },
        { icon: 'user', label: t['mobileTabBar.my'] },
      ]"
    />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/mobile-tab-bar/demo/basic.vue

