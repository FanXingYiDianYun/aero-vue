<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRafScroll } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：页内导航 aria 走词包（ConfigProvider locale 注入）
const { anchor: anchorLabels } = useLocale()

export interface AnchorItem {
  key: string
  label: string
}

const props = withDefaults(
  defineProps<{
    items: AnchorItem[]
    /** 滚动容器选择器（默认 window） */
    container?: string
    /** 高亮判定额外上偏移（容器顶部起的判定线，默认 20px） */
    offset?: number
  }>(),
  { offset: 20 },
)

const active = ref(props.items[0]?.key)

/**
 * 滚动 spy：rAF 采样「各锚点顶边是否越过容器判定线」。
 * 容器内滚动时 rect.top 为视口坐标，需以容器 rect.top 为基准换算，
 * 旧实现把视口坐标直接当容器内偏移（96px 远超 320px 容器可视区），
 * 永远命中不到后节；本实现按容器基准判定，scroll + resize + 内容高度变化均可跟随。
 */
let target: HTMLElement | Window = window

function getSampledTarget() {
  return target
}

const scroller = useRafScroll(getSampledTarget, sample)

function sample() {
  const t = target
  const base = t === window ? 0 : (t as HTMLElement).getBoundingClientRect().top
  const line = base + props.offset + 1
  let current = props.items[0]?.key ?? ''
  for (const it of props.items) {
    const el = document.getElementById(it.key)
    if (el && el.getBoundingClientRect().top <= line) current = it.key
  }
  // 兜底：滚动容器已到底（末节内容较短、顶边仍在判定线上方）时，
  // 强制高亮末节，避免竖线停在倒数第二节
  if (t instanceof Element) {
    if (t.scrollTop + t.clientHeight >= t.scrollHeight - 2) {
      current = props.items[props.items.length - 1]?.key ?? current
    }
  }
  active.value = current
}

function bind() {
  target = window
  if (props.container) {
    const c = document.querySelector(props.container) as HTMLElement | null
    if (c) target = c
  }
  scroller.stop()
  scroller.start()
  sample()
}

const onResize = () => sample()

onMounted(() => {
  bind()
  window.addEventListener('resize', onResize, { passive: true })
})
onBeforeUnmount(() => {
  scroller.stop()
  window.removeEventListener('resize', onResize)
})

// 容器选择器响应式：切换时重新绑定监听并立即采样
watch(
  () => props.container,
  bind,
)

function jump(k: string) {
  document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // smooth 滚动结束后补采一次，确保末节跳转后高亮即跟随
  setTimeout(sample, 420)
}
</script>

<template>
  <nav class="aero-anchor" :aria-label="anchorLabels.navAria">
    <a
      v-for="it in items"
      :key="it.key"
      class="aero-anchor__item"
      :class="{ 'is-active': it.key === active }"
      :href="`#${it.key}`"
      @click.prevent="jump(it.key)"
    >{{ it.label }}</a>
  </nav>
</template>

<style scoped lang="scss">
.aero-anchor {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 2px solid var(--ui-line);

  &__item {
    padding: 9px 0 9px 18px;
    font-size: 14px;
    color: var(--ui-ink-2);
    border-left: 2px solid transparent;
    margin-left: -2px;
    transition: 0.25s;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      color: var(--ui-brand-ink);
    }
    &.is-active {
      color: var(--ui-brand-ink);
      border-left-color: var(--ui-brand);
      font-weight: 700;
    }
  }
}
</style>
