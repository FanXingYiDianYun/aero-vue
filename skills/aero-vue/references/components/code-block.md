# AeroCodeBlock（code-block）

分组：DataDisplay 数据展示
中文名：代码块

具名导入：

```ts
import { AeroCodeBlock } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `code` | string | — |
| `lang` | string | '' |
| `title` | string | '' |
| `highlight` | boolean | true |
| `lineNumbers` | boolean | true |
| `copyable` | boolean | true |
| `flush` | boolean | false |
| `collapsible` | boolean | false |
| `open` | boolean | true |

## events
| event | payload |
|---|---|
| `update:open` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroCodeBlock } from 'aero-vue'

const code = `import { AeroButton, AeroUI } from 'aero-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(AeroUI)
`

// 折叠显隐（v-model:open 受控）；标题栏右侧展开/收起钮
const open = ref(true)
</script>
<template>
  <AeroCodeBlock
    v-model:open="open"
    :code="code"
    lang="TS"
    title="main.ts"
    collapsible
    style="max-width: 480px"
  />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/code-block/demo/basic.vue

