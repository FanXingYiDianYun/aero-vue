# AeroRate（rate）

分组：Form 表单
中文名：评分

具名导入：

```ts
import { AeroRate } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | number | 0 |
| `count` | number | 5 |
| `disabled` | boolean | false |
| `animate` | boolean | true |
| `confetti` | boolean | true |
| `allowDecimal` | boolean | false |
| `allowReselect` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | number |
| `change` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroRate, AeroSwitch, useLocale } from 'aero-vue'
// 评分标签原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const v = ref(3)
// 小数评级开关——词包 rate.*（useLocale demo 组 zh/en 同源）
const decimal = ref(false)
// 允许重选开关——allowReselect=false（默认）首评后锁定，true 可反复改
const allowReselect = ref(false)
const display = computed(() => (decimal.value ? v.value.toFixed(1) : String(v.value)))
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex-wrap: wrap">
      <AeroSwitch v-model="decimal" :aria-label="t['rate.decimalToggle']" />
      <span style="font-size: 12.5px; color: var(--ui-ink-3)">{{ t['rate.decimalToggle'] }}</span>
      <AeroSwitch v-model="allowReselect" :aria-label="t['rate.allowReselect']" />
      <span style="font-size: 12.5px; color: var(--ui-ink-3)">{{ t['rate.allowReselect'] }}</span>
    </div>
    <AeroRate v-model="v" :allow-decimal="decimal" :allow-reselect="allowReselect" />
    <span style="font-size: 12.5px; color: var(--ui-ink-3)">{{ t['rate.current'] }}{{ display }}</span>
    <span style="font-size: 12px; color: var(--ui-ink-3); min-width: 0">{{ t['rate.decimalHint'] }}</span>
    <AeroRate :model-value="4" disabled />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/rate/demo/basic.vue

