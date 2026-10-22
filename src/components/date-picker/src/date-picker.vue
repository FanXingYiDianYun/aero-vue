<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useClickOutside } from '../../../composables'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：面板标题/月份/周历表头/翻页 aria/「现在」走词包（ConfigProvider locale 注入）
const { datePicker: datePickerLabels, common: commonLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 'YYYY-MM-DD' */
    modelValue?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: undefined, disabled: false },
)

const placeholderText = computed(() => props.placeholder ?? datePickerLabels.value.placeholder)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}>()

const root = ref<HTMLElement>()
const open = ref(false)
useClickOutside(
  () => root.value,
  () => (open.value = false),
)

const today = new Date()
const view = ref({ y: today.getFullYear(), m: today.getMonth() })

/** 面板模式：day 日历 / month 年-月网格 / year 年份网格 */
const mode = ref<'day' | 'month' | 'year'>('day')

const selected = computed(() => props.modelValue ?? '')

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function fmt(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

const weeks = computed(() => {
  const { y, m } = view.value
  const first = new Date(y, m, 1)
  const days = new Date(y, m + 1, 0).getDate()
  const startBlank = (first.getDay() + 6) % 7 // 周一起始
  const cells: { d: number; iso: string; out: boolean }[] = []
  for (let i = 0; i < startBlank; i++) cells.push({ d: 0, iso: '', out: true })
  for (let d = 1; d <= days; d++) cells.push({ d, iso: fmt(y, m, d), out: false })
  while (cells.length % 7) cells.push({ d: 0, iso: '', out: true })
  return cells
})

/** 年份网格：当前视图年前后各 6 年，共 12 格（快速跨越 10 年） */
const yearCells = computed(() => {
  const base = view.value.y - 6
  return Array.from({ length: 12 }, (_, i) => base + i)
})

const yearTitle = computed(() => `${yearCells.value[0]} – ${yearCells.value[11]}`)

function isToday(iso: string) {
  return iso === fmt(today.getFullYear(), today.getMonth(), today.getDate())
}

function pick(iso: string) {
  emit('update:modelValue', iso)
  emit('change', iso)
  open.value = false
}

/** 快捷键：回到今天 */
function pickNow() {
  const now = new Date()
  view.value = { y: now.getFullYear(), m: now.getMonth() }
  pick(fmt(now.getFullYear(), now.getMonth(), now.getDate()))
}

function prevMonth() {
  const v = { ...view.value }
  v.m--
  if (v.m < 0) (v.m = 11), v.y--
  view.value = v
}
function nextMonth() {
  const v = { ...view.value }
  v.m++
  if (v.m > 11) (v.m = 0), v.y++
  view.value = v
}

/** 月份网格翻页 = 年份步进 */
function prevYearPage() {
  view.value = { ...view.value, y: view.value.y - 12 }
}
function nextYearPage() {
  view.value = { ...view.value, y: view.value.y + 12 }
}

function pickMonth(m: number) {
  view.value = { ...view.value, m }
  mode.value = 'day'
}
function pickYear(y: number) {
  view.value = { ...view.value, y }
  mode.value = 'month'
}

const title = computed(() =>
  mode.value === 'day' || mode.value === 'month'
    ? datePickerLabels.value.title(mode.value, view.value.y, view.value.m + 1)
    : yearTitle.value,
)
const MONTHS = computed(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => datePickerLabels.value.monthName(m)))
/** 周历表头（周一起始）：weekday(0..6) */
const WEEKDAYS = computed(() => [0, 1, 2, 3, 4, 5, 6].map((i) => datePickerLabels.value.weekday(i)))
</script>

<template>
  <div ref="root" class="aero-date" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button class="aero-date__btn" type="button" @click="open = !open">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in iconPaths['calendar']" :key="i" :d="d" />
      </svg>
      <span :class="{ 'is-ph': !selected }">{{ selected || placeholderText }}</span>
    </button>
    <transition name="aero-date">
      <div v-if="open" class="aero-date__panel">
        <header class="aero-date__head">
          <button type="button" :aria-label="mode === 'day' ? datePickerLabels.prevMonth : mode === 'month' ? datePickerLabels.prevYear : datePickerLabels.prevDecade" @click="mode === 'day' ? prevMonth() : mode === 'month' ? prevYearPage() : prevYearPage()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths['chevron-left']" :key="i" :d="d" />
            </svg>
          </button>
          <b class="aero-date__title" @click="mode = mode === 'day' ? 'month' : 'year'">{{ title }}</b>
          <button type="button" :aria-label="mode === 'day' ? datePickerLabels.nextMonth : mode === 'month' ? datePickerLabels.nextYear : datePickerLabels.nextDecade" @click="mode === 'day' ? nextMonth() : mode === 'month' ? nextYearPage() : nextYearPage()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths['chevron-right']" :key="i" :d="d" />
            </svg>
          </button>
        </header>

        <!-- 日历（日） -->
        <div v-if="mode === 'day'" class="aero-date__grid">
          <span v-for="w in WEEKDAYS" :key="w" class="aero-date__w">{{ w }}</span>
          <template v-for="(c, i) in weeks" :key="i">
            <span v-if="c.out" class="aero-date__cell is-out" />
            <button
              v-else
              class="aero-date__cell"
              :class="{ 'is-sel': c.iso === selected, 'is-today': isToday(c.iso) }"
              type="button"
              @click="pick(c.iso)"
            >
              {{ c.d }}
            </button>
          </template>
        </div>

        <!-- 月份网格 -->
        <div v-else-if="mode === 'month'" class="aero-date__grid aero-date__grid--month">
          <button
            v-for="(mo, i) in MONTHS"
            :key="mo"
            class="aero-date__cell aero-date__cell--wide"
            :class="{ 'is-sel': i === view.m }"
            type="button"
            @click="pickMonth(i)"
          >
            {{ mo }}
          </button>
        </div>

        <!-- 年份网格 -->
        <div v-else class="aero-date__grid aero-date__grid--year">
          <button
            v-for="y in yearCells"
            :key="y"
            class="aero-date__cell aero-date__cell--wide"
            :class="{ 'is-sel': y === view.y, 'is-today': y === today.getFullYear() }"
            type="button"
            @click="pickYear(y)"
          >
            {{ y }}
          </button>
        </div>

        <footer class="aero-date__foot">
          <button class="aero-date__now" type="button" @click="pickNow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in iconPaths['clock']" :key="i" :d="d" />
            </svg>
            {{ commonLabels.now }}
          </button>
        </footer>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.aero-date {
  box-sizing: border-box;
  position: relative;
  width: 100%;

  &__btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: var(--ui-radius-md);
    padding: 11px 14px;
    font-size: 14.5px;
    font-family: var(--ui-font-mono);
    font-weight: 600;
    color: var(--ui-ink);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.25s, box-shadow 0.25s;
    .is-ph {
      color: var(--ui-ink-3);
      font-weight: 400;
      font-family: inherit;
    }
    svg {
      color: var(--ui-ink-3);
      flex: none;
    }
    &:hover {
      border-color: var(--ui-brand);
    }
  }
  &.is-open &__btn {
    border-color: var(--ui-brand);
    box-shadow: var(--ui-focus-ring);
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &__panel {
    box-sizing: border-box;
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: calc(var(--ui-z-pop) - 70);
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 14px;
    padding: 12px;
    box-shadow: var(--ui-shadow-md);
    transform-origin: top left;
    width: 252px;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    b {
      font-size: 13.5px;
      color: var(--ui-ink);
      font-family: var(--ui-font-en);
    }
    /* 深色实底切换钮（demo ink 底 + bg 文案的强对比小件） */
    button {
      width: 28px;
      height: 28px;
      border-radius: 9px;
      border: 2px solid var(--ui-ink);
      background: var(--ui-ink);
      color: var(--ui-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.2s var(--ui-spring);
      &:hover {
        background: var(--ui-brand);
        border-color: var(--ui-ink);
        color: var(--ui-on-brand);
        transform: translateY(-1px);
        box-shadow: 2px 2px 0 var(--ui-ink);
      }
      &:active {
        transform: scale(0.92);
      }
    }
  }
  &__title {
    cursor: pointer;
    padding: 3px 9px;
    border-radius: 8px;
    transition: 0.2s;
    &:hover {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;

    &--month,
    &--year {
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      padding: 2px 0 4px;
    }
  }
  &__w {
    text-align: center;
    font-size: 11.5px;
    font-weight: 700;
    color: var(--ui-ink-3);
    padding: 4px 0;
  }
  &__cell {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: none;
    border-radius: 8px;
    font-size: 13px;
    font-family: var(--ui-font-mono);
    color: var(--ui-ink);
    cursor: pointer;
    transition: 0.15s;
    font-weight: 600;
    &.is-out {
      pointer-events: none;
    }
    &:hover {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
    &.is-today {
      border: 2px solid var(--ui-brand);
      color: var(--ui-brand-ink);
    }
    &.is-sel {
      background: var(--ui-brand);
      color: var(--ui-on-brand);
      box-shadow: 1.5px 1.5px 0 var(--ui-ink);
      transform: rotate(-2deg);
    }

    &--wide {
      aspect-ratio: auto;
      padding: 9px 0;
      font-size: 13px;
    }
  }

  &__foot {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 2px solid var(--ui-line);
    display: flex;
    justify-content: flex-end;
  }

  &__now {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 2px solid var(--ui-line-2);
    border-radius: 99px;
    background: var(--ui-bg-soft);
    color: var(--ui-ink-2);
    font-size: 12.5px;
    font-weight: 700;
    font-family: inherit;
    padding: 4px 13px;
    cursor: pointer;
    transition: 0.2s var(--ui-spring);

    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
      transform: translateY(-1px);
      box-shadow: 2px 2px 0 var(--ui-bg-tint);
    }
  }
}

.aero-date-enter-active,
.aero-date-leave-active {
  transition: opacity 0.26s var(--ui-spring), transform 0.26s var(--ui-spring);
}
.aero-date-enter-from,
.aero-date-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
