<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: Record<string, any>
    items: { key: string; label: string; span?: number }[]
    /** 每行列数 */
    column?: number
    bordered?: boolean
    title?: string
  }>(),
  { column: 3, bordered: true },
)

const rows = computed(() => {
  const rows: { key: string; label: string; span: number }[][] = []
  let row: { key: string; label: string; span: number }[] = []
  let used = 0
  for (const it of props.items) {
    const span = Math.min(it.span ?? 1, props.column)
    if (used + span > props.column) {
      rows.push(row)
      row = []
      used = 0
    }
    row.push({ ...it, span })
    used += span
  }
  if (row.length) rows.push(row)
  return rows
})
</script>

<template>
  <div class="aero-desc">
    <h4 v-if="title" class="aero-desc__title">{{ title }}</h4>
    <div class="aero-desc__table" :style="{ '--cols': column }">
      <template v-for="(row, r) in rows" :key="r">
        <template v-for="cell in row" :key="cell.key">
          <div class="aero-desc__label" :style="{ gridColumn: `span 1` }">{{ cell.label }}</div>
          <div
            class="aero-desc__value"
            :style="{ gridColumn: `span ${cell.span * 2 - 1}` }"
          >
            <slot :name="cell.key" :row="data">{{ data[cell.key] ?? '—' }}</slot>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-desc {
  box-sizing: border-box;
  &__title {
    margin: 0 0 12px;
    font-size: 16px;
    color: var(--ui-ink);
  }

  &__table {
    display: grid;
    grid-template-columns: repeat(calc(var(--cols) * 2), 1fr);
    border: 2px solid var(--ui-line);
    border-radius: var(--ui-radius);
    overflow: hidden;
    background: var(--ui-card);
  }

  &__label,
  &__value {
    padding: 11px 14px;
    font-size: 13.5px;
    border-bottom: 2px solid var(--ui-line);
  }
  &__label {
    background: var(--ui-bg-soft);
    color: var(--ui-ink-2);
    font-weight: 700;
    border-right: 2px dashed var(--ui-line);
  }
  &__value {
    color: var(--ui-ink);
  }
  // 末行去掉底线
  &__table div:nth-last-child(1),
  &__table div:nth-last-child(2) {
    border-bottom: 0;
  }
}
</style>
