# AeroMobileCarousel（mobile-carousel）

分组：Mobile 移动端
中文名：轮播

具名导入：

```ts
import { AeroMobileCarousel } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `slides` | AeroMobileCarouselSlide[] | — |
| `interval` | number | 4200 |

## events
| event | payload |
|---|---|
| `change` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { AeroMobileCarousel, useLocale, type AeroMobileCarouselSlide } from 'aero-vue'
// 幻灯 zh 样张/chip 原硬编码中文 → 走词包 demo 组（en 英文数据保留）
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const slides = computed<AeroMobileCarouselSlide[]>(() => [
  { en: 'v3.0 STRATOS', zh: t.value['mobileCarousel.zh1'], chip: t.value['mobileCarousel.chip1'], tone: 'a', rings: [{ w: 150, h: 150, top: '-46px', right: '-36px' }, { w: 70, h: 70, bottom: '-18px', left: '-14px' }] },
  { en: 'EDGE · 312', zh: t.value['mobileCarousel.zh2'], chip: t.value['mobileCarousel.chip2'], tone: 'b', rings: [{ w: 120, h: 120, top: '-30px', left: '-30px' }] },
  { en: '11.6s', zh: t.value['mobileCarousel.zh3'], chip: t.value['mobileCarousel.chip3'], tone: 'c', rings: [{ w: 100, h: 100, bottom: '-24px', right: '-20px' }] },
])
</script>
<template>
  <AeroMobileCarousel :slides="slides" style="max-width: 330px" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/mobile-carousel/demo/basic.vue

