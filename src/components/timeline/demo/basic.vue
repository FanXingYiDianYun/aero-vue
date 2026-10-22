<script setup lang="ts">
import { AeroTimeline } from 'aero-vue'
import type { AeroTimelineItem } from 'aero-vue'
// demo 文案走词包 demo 组
import { computed } from 'vue'
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const items = computed<AeroTimelineItem[]>(() => [
  { icon: 'git-commit', date: '2026-09-01', chip: 'INIT', title: t.value['timeline.item1'], desc: t.value['timeline.item1Desc'] },
  { icon: 'code', date: '2026-09-05', chip: 'DEV', title: t.value['timeline.item2'], desc: t.value['timeline.item2Desc'] },
  { icon: 'rocket', date: '2026-09-13', chip: 'NEXT', title: t.value['timeline.item3'], desc: t.value['timeline.item3Desc'] },
])
</script>

<template>
  <AeroTimeline :items="items" />
</template>
