# AeroButtonGroup（button-group）

分组：Basic 基础
中文名：按钮组

具名导入：

```ts
import { AeroButtonGroup } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `vertical` | boolean | false |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroButtonGroup, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 按钮组文字原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 18px">
    <AeroButtonGroup>
      <AeroButton type="outline" size="sm">{{ t['buttonGroup.day'] }}</AeroButton>
      <AeroButton type="outline" size="sm">{{ t['buttonGroup.week'] }}</AeroButton>
      <AeroButton type="outline" size="sm">{{ t['buttonGroup.month'] }}</AeroButton>
    </AeroButtonGroup>
    <AeroButtonGroup vertical>
      <AeroButton type="primary" size="sm">{{ t['buttonGroup.add'] }}</AeroButton>
      <AeroButton type="ghost" size="sm">{{ t['buttonGroup.edit'] }}</AeroButton>
    </AeroButtonGroup>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/button-group/demo/basic.vue

