# AeroSwitch（switch）

分组：Form 表单
中文名：开关

具名导入：

```ts
import { AeroSwitch } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | boolean | — |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `change` | boolean |
| `focus` | FocusEvent |
| `blur` | FocusEvent |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroSwitch } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const on = ref(true)
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <AeroSwitch v-model="on">{{ t['switch.followSystem'] }}</AeroSwitch>
    <AeroSwitch :model-value="!on">{{ t['switch.inverted'] }}</AeroSwitch>
    <AeroSwitch disabled>{{ t['switch.disabled'] }}</AeroSwitch>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/switch/demo/basic.vue

