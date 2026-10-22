# AeroSlideGo（slide-go）

分组：Mobile 移动端
中文名：滑动解锁

具名导入：

```ts
import { AeroSlideGo } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `text` | string | '滑动部署' |
| `doneText` | string | '部署完成' |
| `autoReset` | boolean | false |
| `width` | number|string | — |

## events
| event | payload |
|---|---|
| `done` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroSlideGo, AeroToast, useLocale } from 'aero-vue'
// toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

function onDone() {
  AeroToast.success(t.value['slideGo.done'], { title: t.value['slideGo.title'] })
}
</script>
<template>
  <AeroSlideGo :width="280" @done="onDone" />
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/slide-go/demo/basic.vue

