<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroTreeSelect } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const v = ref('button')

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const data = computed(() => [
  {
    key: 'basic',
    label: t.value['treeSelect.groupBasic'],
    children: [
      { key: 'button', label: t.value['treeSelect.optButton'] },
      { key: 'icon', label: t.value['treeSelect.optIcon'] },
      { key: 'typography', label: t.value['treeSelect.optTypography'] },
      { key: 'divider', label: t.value['treeSelect.optDivider'] },
    ],
  },
  {
    key: 'form',
    label: t.value['treeSelect.groupForm'],
    children: [
      { key: 'input', label: t.value['treeSelect.optInput'] },
      { key: 'select', label: t.value['treeSelect.optSelect'] },
      { key: 'datepicker', label: t.value['treeSelect.optDatepicker'] },
      { key: 'upload', label: t.value['treeSelect.optUpload'] },
    ],
  },
  {
    key: 'data',
    label: t.value['treeSelect.groupData'],
    children: [
      { key: 'table', label: t.value['treeSelect.optTable'] },
      { key: 'timeline', label: t.value['treeSelect.optTimeline'] },
      { key: 'statistic', label: t.value['treeSelect.optStatistic'] },
    ],
  },
  {
    key: 'feedback',
    label: t.value['treeSelect.groupFeedback'],
    children: [
      { key: 'toast', label: t.value['treeSelect.optToast'] },
      { key: 'dialog', label: t.value['treeSelect.optDialog'] },
    ],
  },
])
</script>

<template>
  <div class="ts-demo">
    <div style="max-width: 380px">
      <AeroTreeSelect v-model="v" :data="data" :placeholder="t['treeSelect.placeholder']" />
    </div>
    <p class="ts-demo__val">{{ t['treeSelect.current'] }} {{ v || t['treeSelect.none'] }}</p>
  </div>
</template>

<style scoped>
.ts-demo { display: flex; flex-direction: column; gap: 10px; }
.ts-demo__val { font-size: 12.5px; color: var(--ui-ink-3); font-family: var(--ui-font-mono); }
</style>
