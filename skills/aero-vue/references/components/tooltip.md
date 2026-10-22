# AeroTooltip（tooltip）

分组：Feedback 反馈
中文名：提示

具名导入：

```ts
import { AeroTooltip } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `content` | string | — |
| `placement` | 'top'|'bottom' | 'top' |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroTooltip } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; gap: 18px; align-items: center; padding: 40px 0">
    <AeroTooltip :content="t['tooltip.top']">
      <AeroButton type="outline" size="sm">{{ t['tooltip.topBtn'] }}</AeroButton>
    </AeroTooltip>
    <AeroTooltip :content="t['tooltip.bottom']" placement="bottom">
      <!-- 底部提示触发器：? 图标上标（super）+ 文字基线对齐，整体再下沉 1px 与左侧
           按钮视觉同轴；替代「图标被 -3px 顶起来」的上下错位 -->
      <span tabindex="0" style="cursor: help; color: var(--ui-brand-ink); font-weight: 700; display: inline-flex; align-items: baseline; gap: 4px; transform: translateY(1px)">
        <sup style="line-height: 1; font-weight: 800; transform: scale(0.82); transform-origin: center; display: inline-block">?</sup>
        {{ t['tooltip.bottomBtn'] }}
      </span>
    </AeroTooltip>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/tooltip/demo/basic.vue

