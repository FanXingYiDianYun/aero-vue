# AeroAvatarGroup（avatar-group）

分组：DataDisplay 数据展示
中文名：头像组

具名导入：

```ts
import { AeroAvatarGroup } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `total` | number | — |
| `max` | number | 5 |
| `size` | number|string | 44 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroAvatarGroup } from 'aero-vue'
import { AeroAvatar } from 'aero-vue'
</script>
<template>
  <div style="display: flex; gap: 24px; align-items: center">
    <AeroAvatarGroup :total="8" :max="5">
      <AeroAvatar :tone="1">AY</AeroAvatar>
      <AeroAvatar :tone="2">ZK</AeroAvatar>
      <AeroAvatar :tone="3">A3</AeroAvatar>
      <AeroAvatar :tone="4">Q4</AeroAvatar>
      <AeroAvatar :tone="5">W5</AeroAvatar>
    </AeroAvatarGroup>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/avatar-group/demo/basic.vue

