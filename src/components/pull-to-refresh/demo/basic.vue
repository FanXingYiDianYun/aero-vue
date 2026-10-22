<script setup lang="ts">
import { computed } from 'vue'
import { AeroPullToRefresh, AeroToast, useLocale } from 'aero-vue'
import type { AeroPtrItem } from 'aero-vue'
// 列表条目/toast 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const items = computed<AeroPtrItem[]>(() => [
  { icon: 'rocket', title: t.value['pullToRefresh.item1'], desc: t.value['pullToRefresh.item1Desc'], time: '2m' },
  { icon: 'git-branch', title: t.value['pullToRefresh.item2'], desc: t.value['pullToRefresh.item2Desc'], time: '18m' },
  { icon: 'trending-up', title: t.value['pullToRefresh.item3'], desc: t.value['pullToRefresh.item3Desc'], time: '1h' },
  { icon: 'rotate-ccw', title: t.value['pullToRefresh.item4'], desc: '3d20af1 → 91bc0e7', time: '3h' },
  { icon: 'key-round', title: t.value['pullToRefresh.item5'], desc: t.value['pullToRefresh.item5Desc'], time: '5h' },
])
</script>

<template>
  <AeroPullToRefresh :items="items" :width="280" :height="200" @refresh="AeroToast.success(t['pullToRefresh.done'])" />
</template>
