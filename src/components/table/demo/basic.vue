<script setup lang="ts">
import { computed } from 'vue'
import { AeroTable } from 'aero-vue'
import { AeroBadge } from 'aero-vue'
import type { AeroTableColumn } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const cols: AeroTableColumn[] = [
  { key: 'pkg', title: 'Package', mono: true },
  { key: 'desc', title: 'Description' },
  { key: 'ver', title: 'Version', mono: true },
  { key: 'status', title: 'Status' },
]

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const rows = computed(() => [
  { pkg: 'aero-vue', desc: t.value['table.vueDesc'], ver: '0.1.0', st: 'stable' },
  { pkg: 'vite', desc: t.value['table.buildTool'], ver: '5.2.0', st: 'beta' },
  { pkg: 'sass', desc: t.value['table.preprocessor'], ver: '1.77.0', st: 'stable' },
])
</script>

<template>
  <AeroTable :columns="cols" :data="rows">
    <template #status="{ row }">
      <AeroBadge :type="row.st === 'stable' ? 'ok' : 'warn'" dot>{{ row.st }}</AeroBadge>
    </template>
  </AeroTable>
</template>
