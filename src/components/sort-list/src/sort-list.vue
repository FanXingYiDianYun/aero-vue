<script setup lang="ts">
/**
 * SortList 指针跟随拖动排序 —— 复刻 demo #sortList（v3 方案）
 * 拖动时把 item 挂到 body（fixed 定位，不受 phone transform 影响），
 * 占位符 phBlink 闪烁提示落点，其余项 FLIP 过渡。
 */
import { ref, watch } from 'vue'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：拖柄「拖我」文案走词包（ConfigProvider locale 注入）
const { sortList: sortListLabels } = useLocale()

export interface AeroSortItem {
  /** 主文案 */
  name: string
  /** 右侧 mono 说明 */
  meta?: string
  /** 唯一 key */
  key?: string
}

const props = defineProps<{
  items: AeroSortItem[]
  /** 列表宽度（px 或 CSS 值） */
  width?: number | string
}>()

const emit = defineEmits<{ (e: 'sorted', order: AeroSortItem[]): void }>()

const list = ref<HTMLElement>()
const inner = ref<AeroSortItem[]>(props.items.slice())

let drag: HTMLElement | null = null
let ph: HTMLElement | null = null
let grabX = 0
let grabY = 0
let startX = 0

function flip(fn: () => void) {
  if (!list.value || !drag) { fn(); return }
  const kids = [...list.value.children].filter((k) => k !== drag && k !== ph) as HTMLElement[]
  const before = kids.map((k) => k.getBoundingClientRect().top)
  fn()
  kids.forEach((k, i) => {
    const d = before[i] - k.getBoundingClientRect().top
    if (Math.abs(d) > 0.5) {
      k.style.transition = 'none'
      k.style.transform = `translateY(${d}px)`
      requestAnimationFrame(() => {
        k.style.transition = 'transform .3s cubic-bezier(.3,1.3,.4,1)'
        k.style.transform = ''
      })
      setTimeout(() => {
        k.style.removeProperty('transition')
        k.style.removeProperty('transform')
      }, 340)
    }
  })
}

function onDown(e: PointerEvent) {
  if (!list.value) return
  const it = (e.target as HTMLElement).closest<HTMLElement>('.aero-sort__item')
  if (!it || !(e.target as HTMLElement).closest('.aero-sort__handle')) return
  drag = it
  const r = it.getBoundingClientRect()
  grabX = e.clientX - r.left
  grabY = e.clientY - r.top
  startX = e.clientX
  ph = document.createElement('div')
  ph.className = 'aero-sort__ph'
  ph.style.height = r.height + 'px'
  list.value.insertBefore(ph, it)
  it.classList.add('dragging')
  it.style.width = r.width + 'px'
  it.style.position = 'fixed'
  it.style.left = r.left + 'px'
  it.style.top = r.top + 'px'
  // 拖拽项浮层 z-index = --ui-z-drag（900）：低于 toast（1400）/modal（1300）/pop（1200）
  // 通知类永远在最上：toast 永不被拖拽项遮挡
  it.style.zIndex = getComputedStyle(document.documentElement).getPropertyValue('--ui-z-drag').trim() || '900'
  it.style.margin = '0'
  it.style.transform = 'rotate(2deg) scale(1.04)'
  document.body.appendChild(it)
  startDrag(list.value, e)
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）
const { startDrag } = usePointerDrag(onMove, { onEnd: end })

function onMove(e: PointerEvent) {
  if (!drag || !list.value) return
  const wob = Math.max(-10, Math.min(10, (e.clientX - startX) * 0.08))
  drag.style.left = e.clientX - grabX + wob + 'px'
  drag.style.top = e.clientY - grabY + 'px'
  const items = [...list.value.querySelectorAll<HTMLElement>('.aero-sort__item')]
  let refEl: HTMLElement | null = null
  for (const o of items) {
    const rr = o.getBoundingClientRect()
    if (e.clientY < rr.top + rr.height / 2) { refEl = o; break }
  }
  flip(() => {
    if (!ph || !list.value) return
    if (refEl && refEl !== drag) {
      if (refEl !== ph.nextSibling) list.value.insertBefore(ph, refEl)
    } else if (list.value.lastElementChild !== ph) {
      list.value.appendChild(ph)
    }
  })
}

function end() {
  if (!drag || !list.value) return
  const it = drag
  drag = null
  const r1 = it.getBoundingClientRect()
  if (ph) { ph.replaceWith(it); ph = null }
  it.classList.remove('dragging')
  ;['width', 'position', 'left', 'top', 'zIndex', 'margin', 'transform'].forEach((p) => it.style.removeProperty(p))
  const r2 = it.getBoundingClientRect()
  const dx = r1.left - r2.left
  const dy = r1.top - r2.top
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
    it.style.transition = 'none'
    it.style.transform = `translate(${dx}px, ${dy}px)`
    requestAnimationFrame(() => {
      it.style.transition = 'transform .34s cubic-bezier(.3,1.3,.4,1)'
      it.style.transform = ''
      setTimeout(() => {
        it.style.removeProperty('transition')
        it.style.removeProperty('transform')
      }, 380)
    })
  }
  // 同步数据顺序
  const names = [...list.value.querySelectorAll<HTMLElement>('.aero-sort__item')].map((el) => el.dataset.key ?? '')
  inner.value = names.map((k) => inner.value.find((i) => (i.key ?? i.name) === k)).filter(Boolean) as AeroSortItem[]
  emit('sorted', inner.value.slice())
}

defineExpose({ order: inner })

// locale 切换改 items 文案（name/meta 变、key 集合不变）时同步 inner：
// 按键合并以 inner 现有键集合为准（顺序保持用户拖动序），
// 逐键从最新 props 同名项刷新 locale 绑定字段；键集合不一致才整体重置。
// 拖动期间（drag 非空）不同步，避免与 FLIP 占位冲突。
watch(
  () => props.items.map((i) => i.name + '|' + (i.meta ?? '')).join('|'),
  () => {
    if (drag) return
    const innerKeys = inner.value.map((i) => i.key ?? i.name)
    const propKeys = props.items.map((i) => i.key ?? i.name)
    const sameKeySet =
      innerKeys.length === propKeys.length &&
      innerKeys.every((k) => propKeys.includes(k)) &&
      propKeys.every((k) => innerKeys.includes(k))
    if (!sameKeySet) {
      // 键集合不一致（增删项）→ 整体重置
      inner.value = props.items.slice()
      return
    }
    // 按键合并：顺序保持 inner（用户序），逐键刷新同名项文案
    inner.value = innerKeys.map((k) => props.items.find((i) => (i.key ?? i.name) === k)!)
  },
)
</script>

<template>
  <div
    ref="list"
    class="aero-sort"
    :style="width ? { width: typeof width === 'number' ? width + 'px' : width } : undefined"
    @pointerdown="onDown"
  >
    <div
      v-for="it in inner"
      :key="it.key ?? it.name"
      class="aero-sort__item"
      :data-key="it.key ?? it.name"
    >
      <span class="aero-sort__handle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <circle cx="9" cy="5" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="9" cy="19" r="1.6" />
          <circle cx="15" cy="5" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="15" cy="19" r="1.6" />
        </svg>
        <em>{{ sortListLabels.handle }}</em>
      </span>
      <span class="aero-sort__name">{{ it.name }}</span>
      <span v-if="it.meta" class="aero-sort__meta">{{ it.meta }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-sort {
  box-sizing: border-box;
  margin: 6px 16px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  user-select: none;

  &__item {
    display: flex;
    align-items: center;
    gap: 11px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 15px;
    padding: 10px 12px;
    transition: transform 0.25s var(--ui-spring), box-shadow 0.25s, opacity 0.25s;
    touch-action: pan-y;

    &:hover { border-color: var(--ui-brand); }

    &.dragging {
      cursor: grabbing !important;
      box-shadow: 10px 10px 0 var(--ui-brand);
      opacity: 0.97;
    }
  }

  &__handle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--ui-bg-tint);
    border: 2px solid var(--ui-line-2);
    border-radius: 10px;
    padding: 5px 9px;
    color: var(--ui-brand-ink);
    cursor: grab;
    flex: none;
    transition: 0.22s var(--ui-spring);
    touch-action: none;

    em {
      font-style: normal;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
    }

    &:active { cursor: grabbing; }
  }

  &__item:hover &__handle {
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    border-color: var(--ui-ink);
    transform: rotate(-4deg);
  }

  &__name {
    font-size: 13.5px;
    font-weight: 700;
    flex: 1;
  }

  &__meta {
    font-family: var(--ui-font-mono);
    font-size: 11px;
    color: var(--ui-ink-3);
  }

  &__ph {
    border: 2px dashed var(--ui-brand);
    border-radius: 15px;
    background: var(--ui-bg-tint);
    animation: aero-sort-phblink 1.1s infinite;
  }
}
</style>

<style lang="scss">
/* 拖动中的 item 挂在 body 上，需全局样式（非 scoped） */
.aero-sort__item.dragging {
  cursor: grabbing !important;
  box-shadow: 10px 10px 0 var(--ui-brand);
  opacity: 0.97;
}
@keyframes aero-sort-phblink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
</style>
