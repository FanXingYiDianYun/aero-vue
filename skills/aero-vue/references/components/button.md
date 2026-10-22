# AeroButton（button）

分组：Basic 基础
中文名：按钮

具名导入：

```ts
import { AeroButton } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `type` | 'primary'|'outline'|'ghost'|'danger'|'dark' | 'primary' |
| `size` | 'sm'|'md'|'lg' | 'md' |
| `disabled` | boolean | false |
| `loading` | boolean | false |
| `block` | boolean | false |
| `iconOnly` | boolean | false |
| `ripple` | boolean | true |
| `nativeType` | 'button'|'submit'|'reset' | 'button' |

## events
| event | payload |
|---|---|
| `click` | MouseEvent |
| `focus` | FocusEvent |
| `blur` | FocusEvent |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroButton, AeroIcon, useLocale } from 'aero-vue'
// 按钮文字原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const loading = ref(false)
function simulate() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>
<template>
  <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center">
    <AeroButton type="primary">{{ t['button.primary'] }}</AeroButton>
    <AeroButton type="outline">{{ t['button.secondary'] }}</AeroButton>
    <AeroButton type="ghost">{{ t['button.ghost'] }}</AeroButton>
    <AeroButton type="danger">{{ t['button.danger'] }}</AeroButton>
    <AeroButton type="dark">{{ t['button.dark'] }}</AeroButton>
    <AeroButton type="primary" size="sm">Small</AeroButton>
    <AeroButton type="primary" size="lg">Large</AeroButton>
    <AeroButton :loading="loading" @click="simulate">{{ t['button.clickLoad'] }}</AeroButton>
    <AeroButton type="primary" disabled>{{ t['button.disabled'] }}</AeroButton>
    <AeroButton type="outline" icon-only>
      <template #icon><AeroIcon name="zap" /></template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/button/demo/basic.vue

