<script setup lang="ts">
import { useLocale } from '../../../locale'
import type { AeroTableColumn } from './table.types'

// i18n：空数据缺省文案走词包（ConfigProvider locale 注入；emptyText prop 显式传入仍覆盖）
const { table: tableLabels } = useLocale()

defineProps<{
  /** 列定义（标题/取数 key/宽度/是否等宽字体） */
  columns: AeroTableColumn[]
  /** 数据行 */
  data: Record<string, any>[]
  /** 空数据提示文案（缺省走词包 table.empty） */
  emptyText?: string
}>()
</script>

<template>
  <div class="aero-table">
    <table class="aero-table__inner">
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key" :style="c.width ? { width: c.width } : undefined">
            {{ c.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data.length">
          <td :colspan="columns.length" class="aero-table__empty">{{ emptyText ?? tableLabels.empty }}</td>
        </tr>
        <tr v-for="(row, i) in data" :key="i">
          <td
            v-for="c in columns"
            :key="c.key"
            :class="{ 'is-mono': c.mono }"
          >
            <slot :name="c.key" :row="row" :index="i">{{ row[c.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.aero-table {
  box-sizing: border-box;
  width: 100%;
  overflow-x: auto;
  border: 2px solid var(--ui-line);
  border-radius: 16px;
  background: var(--ui-card);

  &__inner {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.8px;
    min-width: 620px;
  }
  th {
    text-align: left;
    padding: 13px 18px;
    background: var(--ui-bg-soft);
    font-size: 12.5px;
    letter-spacing: 0.06em;
    color: var(--ui-ink-2);
    border-bottom: 2px solid var(--ui-line);
    font-family: var(--ui-font-en);
    text-transform: uppercase;
    white-space: nowrap;
  }
  td {
    padding: 13px 18px;
    border-bottom: 2px solid var(--ui-line);
    &.is-mono {
      font-family: var(--ui-font-mono);
      color: var(--ui-brand-ink);
      font-weight: 600;
    }
  }
  tr:last-child td {
    border-bottom: 0;
  }
  tbody tr {
    transition: background 0.2s;
    &:hover {
      background: var(--ui-bg-soft);
    }
  }
  &__empty {
    text-align: center;
    color: var(--ui-ink-3);
    padding: 34px 0 !important;
    font-size: 13.5px;
  }
}
</style>
