<script setup lang="ts">
/**
 * SwipeDeck 拖动卡片组 —— 复刻 demo .p-deck
 * 顶卡可拖（跟随指针 + rotate + stamp 章随位移显隐），>110px 释放飞出；
 * 飞出后按 loop 决定回队尾或销毁；外部增删 cards 走 FLIP 插入动画。
 */
import { onMounted, ref, watch } from 'vue'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：印章「部署/回滚」与状态缺省「健康」走词包（ConfigProvider locale 注入）
const { swipeDeck: swipeLabels } = useLocale()

export interface AeroSwipeCard {
  /** 应用名（用于事件回执） */
  name: string
  /** 头像文案 */
  avatar?: string
  /** 头像配板 1-6 */
  avatarTone?: 1 | 2 | 3 | 4 | 5 | 6
  /** 状态徽章：ok/warn/err */
  status?: 'ok' | 'warn' | 'err'
  /** 状态文本 */
  statusText?: string
  /** mono 行数据 */
  rows?: Array<[string, string]>
  /** 底部说明 */
  foot?: string
}

const props = withDefaults(
  defineProps<{
    cards: AeroSwipeCard[]
    /**
     * 循环模式：true（默认）划掉的卡回队尾，牌组保持恒定；
     * false 则划掉即销毁，牌组逐张减少直至清空（触发 emptied）
     */
    loop?: boolean
    /**
     * 素面模式（对齐 PrimeVue unstyled 惯例）：
     * true 时去除默认卡片排版（头像/名称/徽章/mono/CTA），
     * 插槽内容即卡片，样式全由使用者定；false（默认）渲染完整卡片
     */
    bare?: boolean
  }>(),
  { loop: true, bare: false },
)

const emit = defineEmits<{
  (e: 'deploy', card: AeroSwipeCard): void
  (e: 'rollback', card: AeroSwipeCard): void
  /** loop=false 且牌组清空时触发 */
  (e: 'emptied'): void
}>()

const root = ref<HTMLElement>()
const order = ref<AeroSwipeCard[]>([])
const pos = ref<Record<string, number>>({})

function layout() {
  order.value.forEach((c, idx) => {
    pos.value[c.name] = idx
  })
}

let cur: HTMLElement | null = null
let x0 = 0
let y0 = 0
let prevIds: string[] = []

function keyOf(c: AeroSwipeCard) { return c.name }

/**
 * 外部动态增删：保留既有牌序，新卡追加尾部并播放 FLIP 插入动画
 * （先以偏移+透明落位，下一帧回弹归位）
 */
watch(
  () => props.cards.map((c) => c.name).join(','),
  (ids) => {
    const list = ids ? props.cards.slice() : []
    const changed = list.length !== prevIds.length || list.some((c, i) => c.name !== prevIds[i])
    prevIds = list.map((c) => c.name)
    if (!changed) return
    const keep = order.value.filter((c) => list.some((l) => l.name === c.name))
    const added = list.filter((l) => !keep.some((k) => k.name === l.name))
    order.value = [...keep, ...added]
    layout()
    if (added.length) {
      requestAnimationFrame(() => {
        added.forEach((c) => {
          const el = root.value?.querySelector<HTMLElement>(`.aero-sdeck__card[data-name="${c.name}"]`)
          if (!el) return
          el.style.transition = 'none'
          el.style.transform = 'translateY(42px) scale(0.92)'
          el.style.opacity = '0'
          requestAnimationFrame(() => {
            el.style.transition = 'transform .45s var(--ui-spring), opacity .4s'
            el.style.transform = ''
            el.style.opacity = ''
            setTimeout(() => el.style.removeProperty('transition'), 460)
          })
        })
      })
    }
  },
  { immediate: true },
)

// 外部卡片对象被替换而 name 集合不变（如 locale 切换换文案）时，
// 按键合并以 order 现有键集合为准（牌序保留），逐键从最新 props 同名项刷新
// locale 绑定字段（文案/rows/状态等全字段）；
// 键集合不一致（增删/loop=false 销毁）由上方 name 签名 watch（immediate，
// keep+added）负责，本守卫 keySet 不一致时不动 order（只处理同 key 文案刷新）；
// 无 drag 守卫（拖拽不改文案同步语义）。
watch(
  () => JSON.stringify(props.cards),
  () => {
    const orderNames = order.value.map((c) => c.name)
    const propNames = props.cards.map((c) => c.name)
    const sameKeySet =
      orderNames.length === propNames.length &&
      orderNames.every((k) => propNames.includes(k))
    if (!sameKeySet) return
    order.value = orderNames.map((k) => props.cards.find((l) => l.name === k)!)
  },
)

function onDown(e: PointerEvent) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('.aero-sdeck__card')
  if (!el) return
  // 仅顶层卡可拖（通过 pos 映射判断 data-pos=0）
  if (el.dataset.pos !== '0') return
  cur = el
  x0 = e.clientX
  y0 = e.clientY
  el.classList.add('drag')
  startDrag(el, e)
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）
const { startDrag } = usePointerDrag(onMove, { onEnd: release })

function onMove(e: PointerEvent) {
  if (!cur) return
  const dx = e.clientX - x0
  const dy = (e.clientY - y0) * 0.3
  cur.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 16}deg)`
  cur.style.setProperty('--go', Math.min(1, Math.max(0, dx / 90)).toString())
  cur.style.setProperty('--back', Math.min(1, Math.max(0, -dx / 90)).toString())
}

function currentMatrix(el: HTMLElement): number {
  const tr = getComputedStyle(el).transform
  return tr && tr !== 'none' ? new DOMMatrixReadOnly(tr).m41 : 0
}

function release() {
  if (!cur) return
  const c = cur
  cur = null
  c.classList.remove('drag')
  const dx = currentMatrix(c)
  if (dx > 110) fly(c, 1)
  else if (dx < -110) fly(c, -1)
  else {
    c.style.transition = 'transform .4s cubic-bezier(.2,1.4,.3,1)'
    c.style.transform = ''
    c.style.setProperty('--go', '0')
    c.style.setProperty('--back', '0')
    setTimeout(() => c.style.removeProperty('transition'), 420)
  }
}

function fly(el: HTMLElement, dir: 1 | -1) {
  const name = el.dataset.name ?? ''
  const card = order.value.find((c) => c.name === name)
  el.style.transition = 'transform .5s cubic-bezier(.2,.7,.3,1), opacity .45s'
  el.style.transform = `translate(${dir * 560}px, -60px) rotate(${dir * 26}deg)`
  el.style.opacity = '0'
  if (dir > 0) emit('deploy', card ?? ({ name } as AeroSwipeCard))
  else emit('rollback', card ?? ({ name } as AeroSwipeCard))
  setTimeout(() => {
    if (props.loop) {
      // 循环补位：划掉的卡回队尾，牌组恒定
      order.value.push(order.value.shift()!)
    } else {
      // 销毁：移除该卡，空则触发 emptied
      order.value.splice(order.value.findIndex((c) => c.name === name), 1)
      if (order.value.length === 0) emit('emptied')
    }
    layout()
    // 重置飞出卡的残留样式
    nextTickReset()
  }, 480)
}

function nextTickReset() {
  requestAnimationFrame(() => {
    root.value?.querySelectorAll<HTMLElement>('.aero-sdeck__card').forEach((el) => {
      el.style.removeProperty('transition')
      el.style.removeProperty('transform')
      el.style.removeProperty('opacity')
      el.style.removeProperty('--go')
      el.style.removeProperty('--back')
    })
  })
}

function act(dir: 1 | -1) {
  const top = root.value?.querySelector<HTMLElement>('.aero-sdeck__card[data-pos="0"]')
  if (top) fly(top, dir)
}

onMounted(() => {
  order.value = props.cards.slice()
  layout()
})
</script>

<template>
  <div
    ref="root"
    class="aero-sdeck"
    @pointerdown="onDown"
  >
    <div
      v-for="c in order"
      :key="keyOf(c)"
      class="aero-sdeck__card"
      :class="{ top: pos[c.name] === 0, 'is-bare': bare }"
      :data-pos="pos[c.name]"
      :data-name="c.name"
      :style="{ zIndex: 10 - pos[c.name] }"
    >
      <span v-if="!bare" class="aero-sdeck__stamp aero-sdeck__stamp--go">{{ swipeLabels.go }}</span>
      <span v-if="!bare" class="aero-sdeck__stamp aero-sdeck__stamp--back">{{ swipeLabels.back }}</span>
      <slot :card="c">
        <div v-if="!bare" class="aero-sdeck__top">
          <span class="aero-sdeck__avatar" :class="`aero-sdeck__avatar--t${c.avatarTone ?? 2}`">{{ c.avatar ?? c.name[0]?.toUpperCase() }}</span>
          <div>
            <div class="aero-sdeck__name">{{ c.name }}</div>
            <span class="aero-sdeck__badge" :class="`aero-sdeck__badge--${c.status ?? 'ok'}`">
              <i />{{ c.statusText ?? swipeLabels.ok }}
            </span>
          </div>
        </div>
        <template v-if="!bare">
          <div v-for="(r, i) in c.rows" :key="i" class="aero-sdeck__mono">
            <span>{{ r[0] }}</span><span>{{ r[1] }}</span>
          </div>
          <div class="aero-sdeck__cta">
            <span>{{ c.foot }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M3 12h.01M8 12h.01M13 12h.01M18 12h.01" transform="rotate(90 12 12)" />
            </svg>
          </div>
        </template>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-sdeck {
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin: 12px 18px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;

  &__card {
    position: absolute;
    width: 100%;
    max-width: 264px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line);
    border-radius: 21px;
    padding: 20px;
    box-shadow: 6px 6px 0 var(--ui-bg-tint);
    transition: transform 0.45s var(--ui-spring), opacity 0.4s;
    user-select: none;
    touch-action: pan-y;
    cursor: default;

    &[data-pos='1'] { transform: translateY(16px) scale(0.93); opacity: 0.85; }
    &[data-pos='2'] { transform: translateY(30px) scale(0.86); opacity: 0.6; }

    &.top { cursor: grab; }

    &.drag {
      transition: none;
      cursor: grabbing;
      box-shadow: 14px 14px 0 var(--ui-bg-tint);
    }
  }

  &__stamp {
    position: absolute;
    top: 20px;
    padding: 4px 14px;
    border-radius: 10px;
    font-weight: 900;
    font-size: 15px;
    letter-spacing: 0.12em;
    border: 3px solid currentColor;
    opacity: 0;
    pointer-events: none;

    &--go {
      right: 16px;
      color: var(--ui-ok);
      transform: rotate(-10deg);
      opacity: var(--go, 0);
    }

    &--back {
      left: 16px;
      color: var(--ui-err);
      transform: rotate(10deg);
      opacity: var(--back, 0);
    }
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    font-size: 13px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-family: var(--ui-font-en);
    flex: none;

    &--t1 { background: var(--ui-av-1-bg); color: var(--ui-av-1-tx); }
    &--t2 { background: var(--ui-brand); color: var(--ui-on-brand); }
    &--t3 { background: var(--ui-av-3-bg); color: var(--ui-av-3-tx); }
    &--t4 { background: var(--ui-av-4-bg); color: var(--ui-av-4-tx); }
    &--t5 { background: var(--ui-av-5-bg); color: var(--ui-av-5-tx); }
    &--t6 { background: var(--ui-av-6-bg); color: var(--ui-av-6-tx); }
  }

  &__name {
    font-family: var(--ui-font-mono);
    font-weight: 700;
    font-size: 15px;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 9px;
    border-radius: 99px;
    box-shadow: 0 0 0 2px var(--ui-card);

    i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }

    &--ok {
      background: color-mix(in srgb, var(--ui-ok) 16%, transparent);
      color: var(--ui-ok);
    }
    &--warn {
      background: color-mix(in srgb, var(--ui-warn) 18%, transparent);
      color: var(--ui-warn);
    }
    &--err {
      background: color-mix(in srgb, var(--ui-err) 15%, transparent);
      color: var(--ui-err);
    }
  }

  &__mono {
    font-family: var(--ui-font-mono);
    font-size: 12px;
    color: var(--ui-ink-3);
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom: 2px dashed var(--ui-line);

    &:last-of-type { border-bottom: 0; }
  }

  &__cta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    font-size: 12.5px;
    color: var(--ui-ink-2);
  }
}
</style>
