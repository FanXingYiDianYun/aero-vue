# AeroTypography（typography）

分组：Basic 基础
中文名：排版

具名导入：

```ts
import { AeroTypography } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `level` | 'display'|'heading-en'|'title'|'body'|'caption' | 'body' |
| `tag` | string | — |
| `en` | boolean | false |
| `mono` | boolean | false |
| `highlight` | boolean | false |
| `sticker` | boolean | false |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroTypography } from 'aero-vue'
import { AeroTag } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const animKey = ref(0)
function replay() { animKey.value++ }
</script>
<template>
  <div class="type-demo" :key="animKey">
    <div class="type-row">
      <span class="spec">Display / 900 / 44px</span>
      <AeroTypography level="display">{{ t['typography.display'] }}</AeroTypography>
    </div>
    <div class="type-row">
      <span class="spec">Heading EN / 700 / 34px</span>
      <AeroTypography level="heading-en" en>Ship it. Scale it. 0→1 in 11.6s</AeroTypography>
    </div>
    <div class="type-row">
      <span class="spec">Title / 700 / 22px</span>
      <AeroTypography level="title">{{ t['typography.title'] }}</AeroTypography>
    </div>
    <div class="type-row">
      <span class="spec">Body / 400 / 15.5px</span>
      <AeroTypography level="body" style="max-width: 560px">{{ t['typography.body'] }}</AeroTypography>
    </div>
    <div class="type-row">
      <span class="spec">Inline elements</span>
      <div class="inline-els pg-prose">
        <AeroTag>TAG</AeroTag>
        <a class="t-link" href="javascript:;">{{ t['typography.link'] }}</a>
        <kbd>Ctrl</kbd> + <kbd>K</kbd>
        <b>{{ t['typography.bold'] }}</b>
        <AeroTag>aero deploy</AeroTag>
      </div>
    </div>
    <div class="type-row">
      <span class="spec">Highlight / {{ t['typography.highlight'] }}</span>
      <div class="hl-row">
        <span class="hl-demo">{{ t['typography.sendTo'] }}<AeroTypography level="title" highlight class="hl-word-demo">{{ t['typography.cloudWord'] }}</AeroTypography></span>
        <span class="hl-demo">{{ t['typography.like'] }}<AeroTypography level="title" highlight class="hl-word-demo">{{ t['typography.boltWord'] }}</AeroTypography>{{ t['typography.sameAs'] }}</span>
        <span class="hl-demo">{{ t['typography.stickerPre'] }}<AeroTypography level="title" sticker class="hl-box-demo">NEW!</AeroTypography>{{ t['typography.stickerPost'] }}</span>
        <AeroButton type="outline" size="sm" @click="replay">{{ t['typography.replay'] }}</AeroButton>
        <AeroTag :key="`replay-${animKey}`">{{ t['typography.trigger'] }} #{{ animKey }}</AeroTag>
        <AeroTag>.hl-word / .hl-box</AeroTag>
      </div>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/typography/demo/basic.vue

