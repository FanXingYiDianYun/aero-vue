# AeroInputTag（input-tag）

分组：Form 表单
中文名：标签输入

具名导入：

```ts
import { AeroInputTag } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string[] | — |
| `max` | number | — |
| `placeholder` | string | 输入后回车 |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | string[] |
| `change` | string[] |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroInputTag, useLocale } from 'aero-vue'
// placeholder/当前标签原硬编码中文 → 走词包 demo 组（tags 数据保留）
const { demo } = useLocale()
const t = demo

const tags = ref<string[]>(['vue', 'vite'])
</script>
<template>
  <div style="max-width: 360px">
    <AeroInputTag v-model="tags" :placeholder="t['inputTag.placeholder']" :max="6" />
    <p style="font-size: 12.5px; color: var(--ui-ink-3); margin-top: 8px">{{ t['inputTag.current'] }}{{ tags.join(' / ') }}</p>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/input-tag/demo/basic.vue

