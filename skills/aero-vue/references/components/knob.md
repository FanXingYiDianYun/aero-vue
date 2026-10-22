# AeroKnob（knob）

分组：Mobile 移动端
中文名：拖动旋钮

具名导入：

```ts
import { AeroKnob } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | number | 8 |
| `min/max/step` | number | 0/16/1 |
| `unit` | string | 'CORES' |

## events
| event | payload |
|---|---|
| `change` | number |
| `update:modelValue` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroKnob, useLocale } from 'aero-vue'
// 标签/单位原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const v = ref(8)
const info = computed(() => `${v.value} / 16 ${t.value['knob.vcpu']}`)
const cost = computed(() => `¥${(v.value * 0.102).toFixed(2)} ${t.value['knob.perHour']}`)
</script>
<template>
  <div style="display: flex; align-items: center; gap: 22px; user-select: none">
    <AeroKnob v-model="v" />
    <div class="knob-side">
      <span class="ks">{{ t['knob.currentQuota'] }}</span>
      <span class="kv">{{ info }}</span>
      <span class="ks">{{ t['knob.estimatedCost'] }}</span>
      <span class="kv">{{ cost }}</span>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/knob/demo/basic.vue

