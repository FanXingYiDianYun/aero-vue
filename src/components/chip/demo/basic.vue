<script setup lang="ts">
import { ref } from 'vue'
import { AeroChip, AeroButton, useLocale } from 'aero-vue'
// chip 文案/日志/重置原硬编码中文 → 走词包 demo 组（chip 数据 Vue 3/TS 保留）
const { demo } = useLocale()
const t = demo

const all = ['Vue 3', 'TypeScript', 'Vite', 'SCSS']
const tags = ref([...all])
// 日志只存被移除的 tag（locale 无关键），文案渲染期拼词包求值——
// 原 unshift 烤串 `${t.removed}${tag}${t.removedEnd}` 已废除，切语言同步翻转
const log = ref<string[]>([])

function remove(tag: string) {
  const i = tags.value.indexOf(tag)
  if (i >= 0) tags.value.splice(i, 1)
  log.value.unshift(tag)
  if (log.value.length > 3) log.value.pop()
}
</script>

<template>
  <div class="chip-demo">
    <div class="chip-demo__row">
      <TransitionGroup name="chip-pop" tag="span" class="chip-demo__row">
        <AeroChip v-for="tp in tags" :key="tp" closable @close="remove(tp)">{{ tp }}</AeroChip>
      </TransitionGroup>
      <AeroChip active>{{ t['chip.selectedChip'] }}</AeroChip>
      <AeroChip>{{ t['chip.uncloseable'] }}</AeroChip>
    </div>
    <p v-if="log.length" class="chip-demo__log">
      <span v-for="(l, li) in log" :key="li" class="chip-demo__log-item">{{ t['chip.removed'] }}{{ l }}{{ t['chip.removedEnd'] }}</span>
    </p>
    <AeroButton v-if="tags.length < all.length" type="ghost" size="sm" @click="tags = [...all]; log = []">{{ t['chip.reset'] }}</AeroButton>
  </div>
</template>

<style scoped>
.chip-demo { display: flex; flex-direction: column; gap: 12px; }
.chip-demo__row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.chip-demo__log { display: flex; gap: 8px; margin: 0; flex-wrap: wrap; }
.chip-demo__log-item {
  font-family: var(--ui-font-mono);
  font-size: 12px;
  color: var(--ui-brand-ink);
  background: var(--ui-bg-tint);
  border-radius: 8px;
  padding: 2px 9px;
}
.chip-demo__reset {
  align-self: flex-start;
  border: 2px solid var(--ui-line-2);
  border-radius: 10px;
  background: var(--ui-card);
  color: var(--ui-ink-2);
  font-size: 12.5px;
  font-weight: 700;
  padding: 5px 13px;
  cursor: pointer;
  transition: .2s var(--ui-spring);
}
.chip-demo__reset:hover { border-color: var(--ui-brand); color: var(--ui-brand-ink); transform: translateY(-1px); }

/* 关闭/新增过渡：弹入弹出 + 邻位平移（demo chip 签名交互的 spring 曲线）
 move 补位走 MotionPresets token（--ui-dur-mid/--ui-spring），
 prefers-reduced-motion 由 tokens 全局 .01ms 断路（FLIP 自动禁用） */
.chip-pop-enter-active { transition: opacity .3s var(--ui-spring), transform .3s var(--ui-spring); }
.chip-pop-leave-active { transition: opacity .25s var(--ui-ease), transform .25s var(--ui-ease); display: inline-flex; }
.chip-pop-move { transition: transform var(--ui-dur-mid) var(--ui-spring); }
.chip-pop-enter-from { opacity: 0; transform: translateY(8px) scale(.7); }
.chip-pop-leave-to { opacity: 0; transform: scale(.6) rotate(6deg); }
</style>
