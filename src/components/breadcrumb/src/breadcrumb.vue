<script setup lang="ts">
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：面包屑 aria 走词包（ConfigProvider locale 注入）
const { breadcrumb: breadcrumbLabels } = useLocale()

export interface BreadcrumbItem {
  label: string
  href?: string
}

defineProps<{
  /** 面包屑条目列表（末项为当前页，非末项带 href 时渲染为链接） */
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="aero-crumb" :aria-label="breadcrumbLabels.navAria">
    <template v-for="(it, i) in items" :key="i">
      <a v-if="it.href && i < items.length - 1" class="aero-crumb__link" :href="it.href">{{ it.label }}</a>
      <span v-else class="aero-crumb__cur" :aria-current="i === items.length - 1 ? 'page' : undefined">{{ it.label }}</span>
      <svg v-if="i < items.length - 1" class="aero-crumb__sep" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, k) in iconPaths['chevron-right']" :key="k" :d="d" />
      </svg>
    </template>
  </nav>
</template>

<style scoped lang="scss">
.aero-crumb {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--ui-ink-3);
  flex-wrap: wrap;

  &__link {
    color: var(--ui-brand-ink);
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  &__cur {
    color: var(--ui-ink);
    font-weight: 500;
  }
  &__sep {
    opacity: 0.6;
  }
}
</style>
