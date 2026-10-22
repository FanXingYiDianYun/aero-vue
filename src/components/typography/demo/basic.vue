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

<style scoped lang="scss">
.type-demo {
  width: 100%;
}

.type-row {
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 2px solid var(--ui-line);
  flex-wrap: wrap;

  &:last-child { border-bottom: 0; }

  .spec {
    font-family: var(--ui-font-mono);
    font-size: 12px;
    color: var(--ui-ink-3);
    min-width: 170px;
  }
}

.inline-els {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  .t-link {
    color: var(--ui-brand-ink);
    font-weight: 700;

    &:hover { text-decoration: underline; }
  }
}

.hl-row {
  display: flex;
  gap: 12px 34px;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
}

.hl-demo {
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
}

// 覆写内联字号：Typography 的 highlight/sticker 在 25px 字号下还原 demo 观感
:deep(.hl-word-demo) {
  font-size: 25px;
  font-weight: 900;
}

:deep(.hl-box-demo) {
  font-size: 16px;
}

/* 行内元素（kbd/code/mark/em）观感由 demo 站全局单源 .pg-prose（style.scss）承担，
   本组件 scoped 块不再并行定义 */
</style>
