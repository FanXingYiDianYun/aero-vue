# AeroAffix（affix）

分组：Navigation 导航
中文名：固钉

具名导入：

```ts
import { AeroAffix } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `offsetTop` | number | 0 |
| `top` | number | 76 |
| `target` | () => HTMLElement|Window | window |
| `anchor` | () => HTMLElement|null|undefined | — |
| `gutter` | number | 8 |

## events
| event | payload |
|---|---|
| `change` | boolean |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { AeroAffix, AeroButton, useLocale } from 'aero-vue'
// 提示/按钮/占位文案原硬编码中文 → 走词包 demo 组，随 ConfigProvider locale 翻转
const { demo } = useLocale()
const t = demo

function pgMain() {
  return document.querySelector('.pg-main') as HTMLElement | null
}

/* 吸附基准 = 顶部菜单条底边：Announce 横幅展开/收起时菜单整体下移或回升，
   Affix 自动跟随其下缘（无需按横幅状态硬编码 top 值） */
function navAnchor() {
  return document.querySelector('.pg-nav') as HTMLElement | null
}
</script>
<template>
  <div style="height: 900px">
    <p style="color: var(--ui-ink-3); font-size: 13px">
      {{ t['affix.hint'] }}
    </p>
    <AeroAffix :offset-top="40" :target="pgMain" :anchor="navAnchor" :gutter="8">
      <AeroButton type="primary" size="sm">{{ t['affix.stickyBtn'] }}</AeroButton>
    </AeroAffix>
    <div style="height: 700px; background: var(--ui-bg-soft); border: 2px dashed var(--ui-line-2); border-radius: 14px; margin-top: 16px; display: flex; align-items: center; justify-content: center; color: var(--ui-ink-3); font-size: 13px">
      {{ t['affix.placeholder'] }}
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/affix/demo/basic.vue

