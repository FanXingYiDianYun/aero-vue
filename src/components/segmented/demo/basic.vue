<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroSegmented, useLocale } from 'aero-vue'
// 分段选项/说明文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const m = ref('month')
const view = ref('list')

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const views = computed<Record<string, string>>(() => ({
  list: t.value['segmented.listDesc'],
  grid: t.value['segmented.gridDesc'],
  kanban: t.value['segmented.kanbanDesc'],
}))
</script>

<template>
  <div class="seg-demo">
    <div class="seg-demo__row">
      <AeroSegmented
        v-model="m"
        :options="[
          { label: t['segmented.monthly'], value: 'month' },
          { label: t['segmented.yearly'], value: 'year' },
        ]"
      />
      <span class="seg-demo__hint">{{ t['segmented.billing'] }}{{ m === 'month' ? t['segmented.monthly'] : t['segmented.yearly'] }}</span>
    </div>
    <div class="seg-demo__row">
      <AeroSegmented
        v-model="view"
        :options="[
          { label: t['segmented.list'], value: 'list' },
          { label: t['segmented.grid'], value: 'grid' },
          { label: t['segmented.kanban'], value: 'kanban' },
        ]"
      />
      <span class="seg-demo__hint">{{ t['segmented.viewLabel'] }}{{ view }}</span>
    </div>
    <div class="seg-demo__panel">{{ views[view] }}</div>  </div>
</template>

<style scoped>
.seg-demo { display: flex; flex-direction: column; gap: 14px; }
.seg-demo__row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.seg-demo__hint { font-family: var(--ui-font-mono); font-size: 12.5px; color: var(--ui-ink-3); }
.seg-demo__panel {
  padding: 14px 16px;
  border: 2px dashed var(--ui-line-2);
  border-radius: 12px;
  font-size: 13.5px;
  color: var(--ui-ink-2);
  background: var(--ui-bg-soft);
  animation: seg-pop .3s var(--ui-spring);
}
@keyframes seg-pop { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
</style>
