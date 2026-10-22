<script setup lang="ts">
/**
 * AeroSearch 搜索框 —— 模糊搜索（子序列匹配 + 命中排序）与结果列表召回
 * 键盘操作：↑↓ 切换、Enter 选中、Esc 关闭；命中片段 <mark> 高亮
 */
import { computed, ref, watch } from 'vue'
import { AeroIcon } from '../../icon'
import { useLocale } from '../../../locale'

// i18n：placeholder/空结果/「其他」组名/清除 aria 走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { search: searchLabels } = useLocale()

export interface AeroSearchOption {
  /** 唯一键 */
  value: string | number
  /** 展示文本（主行恒定，参与匹配） */
  label: string
  /** 功能描述（参与匹配），query 非空时作副行小字 dimmed 显示；不承载分组 */
  description?: string
  /** 分类组标题（仅 groupBy 指向本字段时渲染为组标题；不参与匹配，缺省 = 不分组平铺） */
  group?: string
}

const props = withDefaults(
  defineProps<{
    /** 候选数据源 */
    options: AeroSearchOption[]
    placeholder?: string
    /** 召回上限（按匹配度排序后截断） */
    limit?: number
    /** 空结果提示（缺省取词包 search.empty） */
    emptyText?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 分组键：提供后结果列表按该字段分组渲染（组内保持匹配度序） */
    groupBy?: 'description' | (keyof AeroSearchOption & string)
    /**
     * 是否渲染 description 副行（默认 false）
     * false：结果项仅主行 label（任何状态下无副行；描述仍参与匹配召回）
     * true：携 description 的结果项渲染独立副行（小字 dimmed，description 命中位 mark 高亮）
     */
    showOptionDesc?: boolean
  }>(),
  {
    placeholder: undefined,
    limit: 12,
    emptyText: undefined,
    disabled: false,
    showOptionDesc: false,
  },
)

const placeholderText = computed(() => props.placeholder ?? searchLabels.value.placeholder)
const emptyTextValue = computed(() => props.emptyText ?? searchLabels.value.empty)

const emit = defineEmits<{
  (e: 'select', opt: AeroSearchOption): void
  (e: 'search', q: string, hits: AeroSearchOption[]): void
  (e: 'clear'): void
}>()

const open = ref(false)
const focusIdx = ref(0)
const listRef = ref<HTMLElement | null>(null)
/** 内部自管理查询词（组件级搜索场景无外部 v-model 需求） */
const query = ref('')

/* —— 模糊匹配：子序列打分（连续命中/词首加权），返回命中字符下标 ——
   命中权重：连续命中 +2、词首命中 +3、普通 +1；
   归一化 score/len(query) 作序，并按文本长度轻微降权，
   避免短 query 误排长文本 */
function fuzzyMatch(q: string, text: string): { score: number; hits: number[] } | null {
  const sq = q.toLowerCase()
  const st = text.toLowerCase()
  if (!sq) return { score: 0, hits: [] }
  let score = 0
  const hits: number[] = []
  let prev = -2
  for (let qi = 0; qi < sq.length; qi++) {
    const ch = sq[qi]
    let found = -1
    // 优先在上一命中附近窗口内找（近距更可能属同一词，得分更高）
    const nearEnd = Math.min(st.length, prev + 4)
    for (let k = Math.max(0, prev + 1); k < nearEnd; k++) {
      if (st[k] === ch) { found = k; break }
    }
    if (found < 0) {
      for (let k = nearEnd; k < st.length; k++) {
        if (st[k] === ch) { found = k; break }
      }
    }
    if (found < 0) return null // 子序列不连续 → 不召回
    let w = 1
    if (found === prev + 1) w = 2
    if (found === 0 || /[\s\-_/.]/.test(st[found - 1] ?? '')) w = 3
    score += w
    hits.push(found)
    prev = found
  }
  const penalty = Math.min(1, st.length / 24 / sq.length)
  return { score: (score / sq.length) * (1 - penalty * 0.3), hits }
}

const hits = computed(() => {
  const q = query.value.trim()
  if (!q) return props.options.map((o) => ({ opt: o, score: 0, labelHits: [] as number[], descHits: [] as number[] }))
  const matched = props.options
    .map((o) => {
      // 主副行翻转：label/description 各自子序列命中位独立记录；
      // 召回 = 任一字段命中；主行恒 label、副行恒 description（显示面翻转，匹配算法 fuzzyMatch 本体不动）
      const lm = String(o.label) ? fuzzyMatch(q, String(o.label)) : null
      const dm = o.description ? fuzzyMatch(q, String(o.description)) : null
      const m = lm ?? dm
      if (!m) return null
      return { opt: o, score: m.score, labelHits: lm ? lm.hits : [], descHits: dm ? dm.hits : [] }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
  matched.sort((a, b) => b.score - a.score || String(a.opt.label).localeCompare(String(b.opt.label)))
  return matched.slice(0, props.limit)
})

/* 展示列表：查询非空时按匹配召回；空查询时直接按原序展示前 limit 项（召回全量）
   C4 主副行翻转：主行 = label 恒定（label 命中位 mark）；副行 = description（query 非空且
   选项携 description 时统一显示小字 dimmed，description 命中位 mark）；query 空 = 仅主行 */
const shown = computed(() => {
  const q = query.value.trim()
  if (!q) return props.options.slice(0, props.limit).map((o) => ({ opt: o, main: String(o.label), sub: '' as string, labelHits: [] as number[], descHits: [] as number[] }))
  return hits.value.map((h) => ({ ...h, main: String(h.opt.label), sub: h.opt.description ? String(h.opt.description) : '' }))
})

function scrollTo(idx: number) {
  requestAnimationFrame(() => {
    // 分组渲染下 li 序号与 shown 序号不一致，按数据键定位
    const target = shown.value[idx]
    if (!target) return
    const el = listRef.value?.querySelector<HTMLElement>(`[data-key="${target.opt.value}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusIdx.value = (focusIdx.value + 1) % Math.max(1, shown.value.length)
    scrollTo(focusIdx.value)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusIdx.value = (focusIdx.value - 1 + shown.value.length) % Math.max(1, shown.value.length)
    scrollTo(focusIdx.value)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const h = shown.value[focusIdx.value]
    if (h) select(h)
  } else if (e.key === 'Escape') {
    open.value = false
    ;(e.target as HTMLInputElement).blur()
  }
}

function select(h: { opt: AeroSearchOption }) {
  emit('select', h.opt)
  open.value = false
  query.value = ''
}

function clear() {
  query.value = ''
  focusIdx.value = 0
  emit('clear')
}

watch(query, (q) => {
  focusIdx.value = 0
  open.value = q.trim().length > 0
  emit('search', q.trim(), hits.value.map((h) => h.opt))
})

/* —— 分组：按 groupBy 字段聚合（组间按各组最高匹配度降序，组内保持序） —— */
const isGrouped = computed(() => !!props.groupBy)
const otherGroup = computed(() => searchLabels.value.other)
const grouped = computed<Array<[string, typeof shown.value]>>(() => {
  if (!isGrouped.value || !shown.value.length) return []
  const m = new Map<string, typeof shown.value>()
  const other = otherGroup.value
  for (const h of shown.value) {
    const k =
      props.groupBy === 'description'
        ? (h.opt.description ? String(h.opt.description) : other)
        : String(h.opt[props.groupBy as keyof AeroSearchOption] ?? other)
    ;(m.get(k) ?? m.set(k, []).get(k)!).push(h)
  }
  return [...m.entries()]
})

/** 命中片段 <mark> 高亮渲染（v-html 前必须转义，防注入）
    高亮走品牌主题色：mark 用 --ui-brand 实心底 + 反白文字，随用户预设/自定义品牌色联动 */
function highlight(text: string, hits: number[]) {
  let out = ''
  let last = 0
  for (const i of hits) {
    if (i < last || i >= text.length) continue
    out += escapeHtml(text.slice(last, i)) + '<mark>' + escapeHtml(text[i]) + '</mark>'
    last = i + 1
  }
  out += escapeHtml(text.slice(last))
  return out
}
/** 主行 = label 恒定（label 命中位 mark） */
function renderLabel(h: (typeof shown.value)[number]) {
  return highlight(h.main, h.labelHits)
}
/** 副行 = description（小字 dimmed，description 命中位 mark；query 非空且选项携 description 时显示） */
function renderSub(h: (typeof shown.value)[number]) {
  return highlight(h.sub, h.descHits)
}
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>

<template>
  <div class="aero-search" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <div class="aero-search__box">
      <AeroIcon name="search" :size="16" class="aero-search__icon" />
      <input
        class="aero-search__input"
        :value="query"
        :placeholder="placeholderText"
        :disabled="disabled"
        autocomplete="off"
        spellcheck="false"
        @input="query = ($event.target as HTMLInputElement).value"
        @focus="open = true"
        @keydown="onKeydown"
      />
      <button
        v-if="query && !disabled"
        type="button"
        class="aero-search__clear"
        :aria-label="searchLabels.clearAria"
        @mousedown.stop
        @click="clear"
      >
        <AeroIcon name="x" :size="13" />
      </button>
    </div>

    <transition name="aero-search">
      <ul v-if="open" ref="listRef" class="aero-search__list">
        <template v-if="isGrouped">
          <template v-for="[g, items] in grouped" :key="g">
            <li class="aero-search__group">{{ g }}</li>
            <li
              v-for="h in items"
              :key="String(h.opt.value)"
              :data-key="String(h.opt.value)"
              class="aero-search__item"
              :class="{ 'is-focus': shown.indexOf(h) === focusIdx }"
              @mouseenter="focusIdx = shown.indexOf(h)"
              @click="select(h)"
            >
              <span v-html="renderLabel(h)" />
              <span v-if="showOptionDesc && h.sub" class="aero-search__sub" v-html="renderSub(h)"></span>
            </li>
          </template>
        </template>
        <template v-else>
          <li
            v-for="(h, i) in shown"
            :key="String(h.opt.value)"
            :data-key="String(h.opt.value)"
            class="aero-search__item"
            :class="{ 'is-focus': i === focusIdx }"
            @mouseenter="focusIdx = i"
            @click="select(h)"
          >
            <span v-html="renderLabel(h)" />
            <span v-if="showOptionDesc && h.sub" class="aero-search__sub" v-html="renderSub(h)"></span>
          </li>
        </template>
        <li v-if="shown.length === 0" class="aero-search__empty">{{ emptyTextValue }}</li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-search {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__box {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 2px solid var(--ui-line-2);
    border-radius: 99px;
    padding: 7px 14px;
    background: var(--ui-card);
    color: var(--ui-ink-3);
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  &.is-open &__box {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &__input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: none;
    font-family: var(--ui-font);
    font-size: 14px;
    color: var(--ui-ink);
  }
  &__input::placeholder {
    color: var(--ui-ink-3);
  }
  &__clear {
    flex: none;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: var(--ui-bg-soft);
    color: var(--ui-ink-2);
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: var(--ui-brand);
      color: var(--ui-card);
    }
  }

  &__list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: calc(var(--ui-z-tip) + 1);
    margin: 0;
    padding: 6px;
    list-style: none;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    box-shadow: var(--ui-shadow-lg);
    max-height: 320px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__group {
    padding: 8px 10px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ui-ink-3);
  }

  &__item {
    padding: 9px 12px;
    border-radius: 9px;
    font-size: 14px;
    color: var(--ui-ink);
    cursor: pointer;
    line-height: 1.5;
    mark {
      /* 品牌主题色高亮：--ui-brand 实心底（默认 84% 透出柔和、随预设/自定义品牌色联动，
         替代浏览器默认黄底）；文字保持继承色（--ui-ink）不强制反白，
         深蓝预设下暗底反白字可读性差，继承色与高亮底色始终同主题 */
      background: color-mix(in srgb, var(--ui-brand) 84%, transparent);
      font-weight: 700;
      border-radius: 3px;
      padding: 0 1px;
      text-decoration: none;
    }
    &:hover,
    &.is-focus {
      /* 键盘导航高亮（↑↓）：视觉态与鼠标 hover 同款（分组/非分组两分支通用） */
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
      .aero-search__sub {
        color: var(--ui-ink-2);
      }
    }

    /* C4 主副行翻转副行：description 小字 dimmed 说明行（主行恒 label；query 非空且
       选项携 description 时统一显示，description 命中位 mark 高亮）。规格：块级独立行
       / font-size 0.8em（≤0.85em，相对主行 14px）/ opacity 0.7（dimmed）/ margin-top 2px
       （≥2px，与主行视觉分离）——只复用既有 --ui-* 变量，零新设计令牌；
       li 级 is-focus/hover 背景整项覆盖副行（无需副行单独高亮态） */
    &__sub {
      display: block;
      margin-top: 2px;
      font-size: 0.8em;
      opacity: 0.7;
      color: var(--ui-ink-3);
    }
  }

  &__empty {
    padding: 18px 12px;
    text-align: center;
    font-size: 13px;
    color: var(--ui-ink-3);
  }
}

.aero-search-enter-active,
.aero-search-leave-active {
  transition: opacity 0.18s, transform 0.18s;
}
.aero-search-enter-from,
.aero-search-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
