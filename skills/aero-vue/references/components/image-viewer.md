# AeroImageViewer（image-viewer）

分组：DataDisplay 数据展示
中文名：图片查看

具名导入：

```ts
import { AeroImageViewer } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | boolean | — |
| `urlList` | string[] | — |
| `initial` | number | 0 |

## events
| event | payload |
|---|---|
| `update:modelValue` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroImageViewer, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 按钮文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const open = ref(false)
/* 内联 SVG 占位图：demo 与截图/回归不依赖外部图床，离线可复现 */
function poster(n: number, bg: string, mark: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="${bg}"/>
    <g fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2">
      ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="500"/>`).join('')}
      ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="800" y2="${i * 100}"/>`).join('')}
    </g>
    <circle cx="400" cy="250" r="150" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="6"/>
    <circle cx="655" cy="105" r="34" fill="#ff7a3d"/>
    <text x="400" y="272" font-family="monospace" font-size="104" font-weight="700" fill="rgba(255,255,255,.92)" text-anchor="middle">${mark}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
const urls = [poster(1, '#25506e', '01'), poster(2, '#3d4a7a', '02'), poster(3, '#1f6146', '03')]
</script>
<template>
  <div>
    <AeroButton type="outline" @click="open = true">{{ t['imageViewer.openBtn'] }}</AeroButton>
    <AeroImageViewer v-model="open" :url-list="urls" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/image-viewer/demo/basic.vue

