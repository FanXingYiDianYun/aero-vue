# AeroCascader（cascader）

分组：Form 表单
中文名：级联选择

具名导入：

```ts
import { AeroCascader } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | string[] | — |
| `options` | CascaderOption[] | — |
| `placeholder` | string | 请选择 |
| `disabled` | boolean | false |

## events
| event | payload |
|---|---|
| `update:modelValue` | string[] |
| `change` | string[], labels |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroCascader, useLocale } from 'aero-vue'
// placeholder/空态原硬编码中文 → 走词包 demo 组（文件树 label 为英文数据，保留）
const { demo } = useLocale()
const t = demo

const path = ref<string[]>([])

const options = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [
          { value: 'button', label: 'button', children: [{ value: 'btn-vue', label: 'button.vue' }, { value: 'btn-ts', label: 'button.types.ts' }] },
          { value: 'form', label: 'form', children: [{ value: 'input', label: 'input.vue' }] },
        ],
      },
      {
        value: 'styles',
        label: 'styles',
        children: [
          { value: 'tokens', label: 'tokens.scss' },
          { value: 'theme', label: 'theme.scss', children: [{ value: 'dark', label: '_dark.scss' }] },
        ],
      },
      { value: 'composables', label: 'composables', children: [{ value: 'popup', label: 'use-popup.ts' }] },
    ],
  },
  {
    value: 'dist',
    label: 'dist',
    children: [
      { value: 'es', label: 'aero-ui.js' },
      { value: 'umd', label: 'aero-ui.umd.cjs' },
    ],
  },
  {
    value: 'docs',
    label: 'docs',
    children: [
      { value: 'guide', label: 'guide.md' },
      { value: 'api', label: 'api.md' },
    ],
  },
]
</script>
<template>
  <div class="cas-demo">
    <div style="max-width: 320px">
      <AeroCascader v-model="path" :options="options" :placeholder="t['cascader.placeholder']" />
    </div>
    <p class="cas-demo__val">{{ path.join('/') || t['cascader.empty'] }}</p>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/cascader/demo/basic.vue

