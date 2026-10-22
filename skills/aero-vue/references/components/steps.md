# AeroSteps（steps）

分组：Navigation 导航
中文名：步骤条

具名导入：

```ts
import { AeroSteps } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `items` | StepItem[] | — |
| `current` | number | 0 |

## events
| event | payload |
|---|---|
| `change` | number |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroSteps, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 步骤标题/按钮/当前步骤文案原硬编码中文 → 走词包 demo 组（desc 为命令，保留）
const { demo } = useLocale()
const t = demo

const cur = ref(1)
// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const items = computed(() => [
  { title: t.value['steps.create'], desc: 'pnpm init' },
  { title: t.value['steps.install'], desc: 'pnpm add aero-vue' },
  { title: t.value['steps.build'], desc: 'pnpm build' },
  { title: t.value['steps.publish'], desc: 'npm publish' },
])
</script>
<template>
  <div class="steps-demo">
    <AeroSteps :items="items" :current="cur" @change="cur = $event" />
    <div class="steps-demo__ops">
      <AeroButton size="sm" type="outline" :disabled="cur === 0" @click="cur--">{{ t['steps.prev'] }}</AeroButton>
      <AeroButton size="sm" type="primary" :disabled="cur === items.length - 1" @click="cur++">{{ t['steps.next'] }}</AeroButton>
      <span class="steps-demo__val">{{ t['steps.current'] }} {{ cur + 1 }} / {{ items.length }}</span>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/steps/demo/basic.vue

