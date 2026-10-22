# AeroTree（tree）

分组：DataDisplay 数据展示
中文名：树

具名导入：

```ts
import { AeroTree } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `data` | AeroTreeNode[] | — |
| `expanded` | string[] | — |
| `checked` | string[] | — |
| `activeKey` | string | — |
| `checkable` | boolean | false |
| `defaultExpandAll` | boolean | false |
| `includeParents` | boolean | false |

## events
| event | payload |
|---|---|
| `update:expanded` | string[] |
| `update:checked` | string[] |
| `select` | AeroTreeNode |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroTree, AeroSwitch } from 'aero-vue'
import type { AeroTreeNode } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const expanded = ref(['src', 'components'])
const checked = ref<string[]>(['styles'])
const active = ref('')
// includeParents 实时切换（false=仅叶 / true=全集含父）
const includeParents = ref(false)

const data: AeroTreeNode[] = [
  {
    key: 'src',
    label: 'src/',
    children: [
      {
        key: 'components',
        label: 'components/',
        children: [
          { key: 'button', label: 'button/' },
          { key: 'form', label: 'form/' },
          { key: 'tree', label: 'tree/' },
        ],
      },
      { key: 'composables', label: 'composables/' },
      { key: 'styles', label: 'styles/' },
      { key: 'index.ts', label: 'index.ts' },
    ],
  },
  {
    key: 'dist',
    label: 'dist/',
    children: [{ key: 'aero-ui.js', label: 'aero-ui.js' }, { key: 'styles.css', label: 'styles.css' }],
  },
]

function onChecked(v: string[]) {
  checked.value = v
}
</script>
<template>
  <div class="tree-demo">
    <div class="tree-demo__ctrl">
      <AeroSwitch v-model="includeParents">{{ t['tree.includeParents'] }}</AeroSwitch>
    </div>
    <div style="max-width: 340px">
      <AeroTree
        :data="data"
        v-model:expanded="expanded"
        v-model:checked="checked"
        v-model:active-key="active"
        checkable
        :include-parents="includeParents"
      />
    </div>
    <p class="tree-demo__val">{{ t['tree.checked'] }}{{ checked.length }}{{ t['tree.checkedEnd'] }}{{ checked.join(', ') || '—' }}</p>
    <p class="tree-demo__hint">{{ t['tree.hint'] }}</p>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/tree/demo/basic.vue

