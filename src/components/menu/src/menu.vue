<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue'
import AeroPopover from '../../popover/src/popover.vue'

export interface MenuItem {
  key: string
  label: string
  href?: string
  /** 可选 icon（Vue 组件，<component :is> 渲染；18×18/currentColor/flex:none） */
  icon?: Component
  /** 可选分组名（同组连续渲染一个分组标题；折叠态标题渲染为分隔线） */
  group?: string
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    modelValue?: string
    /** 水平（导航 pill）/ 垂直（侧栏） */
    mode?: 'horizontal' | 'vertical'
    /** 侧栏宽度（vertical 模式，px 或 CSS 值） */
    width?: number | string
    /** 折叠态（纯样式态，不改业务逻辑；支持 v-model:collapsed） */
    collapsed?: boolean
  }>(),
  { mode: 'horizontal', collapsed: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', item: MenuItem): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'update:collapsed', v: boolean): void
}>()

function pick(it: MenuItem) {
  emit('update:modelValue', it.key)
  emit('select', it)
}

/** 键盘可达：方向键在菜单项间切换（horizontal: ←→，vertical: ↑↓；WAI-ARIA menu 模式） */
function onKeyNav(e: KeyboardEvent) {
  const horiz = props.mode === 'horizontal'
  if (!((horiz && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) || (!horiz && (e.key === 'ArrowUp' || e.key === 'ArrowDown')))) return
  e.preventDefault()
  const n = props.items.length
  if (!n) return
  const i = activeIndex.value < 0 ? 0 : activeIndex.value
  let next = i
  if (horiz) next = e.key === 'ArrowRight' ? (i + 1) % n : (i - 1 + n) % n
  else next = e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n
  const item = props.items[next]
  if (item) pick(item)
}

const activeIndex = computed(() => props.items.findIndex((i) => i.key === props.modelValue))

/* 分组切分——同 group 连续的项归一组；group 未设的项各自成「无标题」组（不出标题） */
const groups = computed(() => {
  const out: { name?: string; items: MenuItem[] }[] = []
  for (const it of props.items) {
    const last = out[out.length - 1]
    if (it.group && last && last.name === it.group) last.items.push(it)
    else out.push({ name: it.group, items: [it] })
  }
  return out
})

/* —— 水平 pill 墨条实测定位（保留原 Segmented 同款方案，杜绝百分比步进溢出）——
   N3 vertical 重设计不再用墨条，horizontal 档保留旧视觉向后兼容 */
const root = ref<HTMLElement>()
const inkStyle = ref<{ left: string; width: string }>({ left: '0px', width: '0px' })

function sync() {
  const el = root.value
  if (!el) return
  if (props.mode === 'horizontal' || props.collapsed) return // 折叠态/垂直无墨条
  const a = el.querySelectorAll<HTMLElement>('.aero-menu__item')[activeIndex.value]
  if (a) inkStyle.value = { left: a.offsetLeft + 'px', width: a.offsetWidth + 'px' }
  else inkStyle.value = { left: '0px', width: '0px' }
}

/* —— vertical 共享滑动指示条（单个绝对定位元素，transform 平移定位）——
 几何：3×16 圆角 2 品牌色；x = 项左缘 - 8（对齐 N3 原 ::before 视觉位），
 y = offsetTop + (项高 - 16)/2（展开 h36 → +10；折叠 40×40 → +12，按实测几何自适应）。
 active 切换走 transform 过渡；首次挂载 / resize / collapsed 切换为即时定位
 （瞬时禁用过渡，防追赶容器 0.25s 宽度过动画）。 */
const indicatorStyle = ref<Record<string, string> | null>(null)

function syncIndicator(instant: boolean) {
  const el = root.value
  if (!el || props.mode !== 'vertical') return
  const a = activeIndex.value >= 0 ? el.querySelectorAll<HTMLElement>('.aero-menu__item')[activeIndex.value] : null
  if (!a) { indicatorStyle.value = null; return }
  const t = `translate(${a.offsetLeft - 8}px, ${a.offsetTop + (a.offsetHeight - 16) / 2}px)`
  if (instant) {
    indicatorStyle.value = { transform: t, transition: 'none' }
    // 双 rAF 确保「无过渡」帧已提交，再恢复过渡属性
    const raf = () => requestAnimationFrame(() => { indicatorStyle.value = { transform: t } })
    if (typeof requestAnimationFrame === 'function') raf()
    else indicatorStyle.value = { transform: t }
  } else {
    indicatorStyle.value = { transform: t }
  }
}

function syncAll(instant: boolean) {
  sync()
  syncIndicator(instant)
}

let ro: ResizeObserver | null = null

let prevCollapsed = props.collapsed

watch([activeIndex, () => props.items.length, () => props.collapsed], () =>
  nextTick(() => {
    // 仅「折叠⇄展开切换那一帧」：容器宽度 0.25s 渐变中，指示条即时定位
    // （不带自身过渡，防追赶宽度过动画）；折叠态内 / 展开态内的 active 切换
    // 恢复 CSS transition 平滑滑动
    const instant = props.collapsed !== prevCollapsed
    prevCollapsed = props.collapsed
    syncAll(instant)
  }),
)

onMounted(() => {
  nextTick(() => syncAll(true))
  ro = new ResizeObserver(() => syncAll(true))
  if (root.value) ro.observe(root.value)
})
onBeforeUnmount(() => ro?.disconnect())

// collapsed 为纯样式态，由外部（demo 层 Button）经 v-model:collapsed 控制；
// 组件声明 emit('update:collapsed') 使 v-model:collapsed 语法可用，自身不改 collapsed。
</script>

<template>
  <nav
    ref="root"
    class="aero-menu"
    :class="[`is-${mode}`, collapsed && mode === 'vertical' ? 'is-collapsed' : null]"
    role="menu"
    :style="mode === 'vertical' ? { width: collapsed ? '64px' : typeof width === 'number' ? width + 'px' : width || '240px', transition: 'width .25s cubic-bezier(.4,0,.2,1)' } : undefined"
    tabindex="0"
    @focus="(e) => emit('focus', e)"
    @blur="(e) => emit('blur', e)"
    @keydown="onKeyNav"
  >
    <!-- 侧栏重设计——vertical 走分组结构 + icon + 折叠态；horizontal 保留原 pill 形态 -->
    <template v-if="mode === 'horizontal'">
      <span class="aero-menu__ink" :style="inkStyle" />
      <a
        v-for="it in items"
        :key="it.key"
        class="aero-menu__item"
        :class="{ 'is-active': it.key === modelValue }"
        :href="it.href"
        role="menuitem"
        @click.prevent="pick(it)"
      ><component :is="it.icon" v-if="it.icon" class="aero-menu__icon" /><span>{{ it.label }}</span></a>
    </template>
    <template v-else>
      <!-- 共享滑动指示条（3×16 圆角 2 品牌色，transform 平移；aria-hidden） -->
      <span v-if="indicatorStyle" class="aero-menu__indicator" :style="indicatorStyle" aria-hidden="true" />
      <template v-for="g in groups" :key="g.name ?? '__ungrouped__'">
        <!-- 分组标题；折叠态渲染为 1px 分隔线 -->
        <div
          v-if="g.name"
          class="aero-menu__group"
          :class="{ 'is-line': collapsed }"
        >{{ g.name }}</div>
        <template v-for="it in g.items" :key="it.key">
          <!-- 折叠态 item 40×40 居中、文字隐藏，hover 用库内 AeroPopover（placement right）显菜单名 -->
          <AeroPopover v-if="collapsed" trigger="hover" placement="right" :title="it.label">
            <a
              class="aero-menu__item is-v is-col"
              :class="{ 'is-active': it.key === modelValue }"
              :href="it.href"
              role="menuitem"
              @click.prevent="pick(it)"
            >
              <component :is="it.icon" v-if="it.icon" class="aero-menu__icon" />
              <span class="aero-menu__label">{{ it.label }}</span>
            </a>
          </AeroPopover>
          <a
            v-else
            class="aero-menu__item is-v"
            :class="{ 'is-active': it.key === modelValue }"
            :href="it.href"
            role="menuitem"
            @click.prevent="pick(it)"
          >
            <component :is="it.icon" v-if="it.icon" class="aero-menu__icon" />
            <span class="aero-menu__label">{{ it.label }}</span>
          </a>
        </template>
      </template>
    </template>
  </nav>
</template>

<style scoped lang="scss">
.aero-menu {
  box-sizing: border-box;
  &.is-horizontal {
    display: inline-flex;
    position: relative;
    background: var(--ui-bg-soft);
    border: 2px solid var(--ui-line);
    border-radius: var(--ui-radius-pill);
    padding: 4px;
    gap: 2px;

    .aero-menu__item {
      padding: 8px 16px;
      border-radius: var(--ui-radius-pill);
      font-size: 13.5px;
      font-weight: 600;
      color: var(--ui-ink-2);
      position: relative;
      z-index: 1;
      text-decoration: none;
      transition: color 0.25s, background 0.2s, transform 0.2s;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      &:hover {
        color: var(--ui-brand-ink);
        transform: translateY(-1px);
      }
    }
    .aero-menu__icon {
      width: 18px;
      height: 18px;
      flex: none;
      color: currentColor;
    }
    .aero-menu__item.is-active {
      color: var(--ui-bg);
      &::before {
        content: '';
        display: inline-block;
        width: 7px;
        height: 7px;
        background: var(--ui-brand);
        border-radius: 50%;
        margin-right: 7px;
        vertical-align: 1px;
      }
    }
  }

  /* —— N3 侧栏重设计（vertical 整体替换旧 2px 左边框+墨条 的 Anchor 撞样形态）—— */
  &.is-vertical {
    display: flex;
    flex-direction: column;
    position: relative; /* 共享指示条 absolute 定位参照（item offsetLeft/Top 同坐标系） */
    background: var(--ui-surface);
    border-right: 1px solid color-mix(in srgb, var(--ui-ink) 12%, var(--ui-line));
    overflow: hidden;
    box-sizing: border-box;

    .aero-menu__item {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 36px;
      margin: 2px 8px;
      padding: 0 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: color-mix(in srgb, var(--ui-ink) 75%, transparent);
      position: relative;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.18s, color 0.18s;

      &.is-active {
        background: color-mix(in srgb, var(--ui-brand) 12%, transparent);
        color: var(--ui-brand);
      }
      &:hover {
        background: color-mix(in srgb, var(--ui-ink) 6%, transparent);
        color: var(--ui-ink);
      }
      &.is-active:hover {
        background: color-mix(in srgb, var(--ui-brand) 12%, transparent);
        color: var(--ui-brand);
      }
    }

    .aero-menu__icon {
      width: 18px;
      height: 18px;
      flex: none;
      color: currentColor;
      &.aero-menu__icon {
        stroke: currentColor;
        fill: none;
      }
    }

    /* 共享滑动指示条——绝对定位单元素 + transform 平移；
 过渡用既有 MotionPresets token（--ui-dur-mid / --ui-spring，不新造）；
 reduced-motion 由 tokens 全局 .01ms 断路自动失效 */
    .aero-menu__indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 16px;
      border-radius: 2px;
      background: var(--ui-brand);
      transition: transform var(--ui-dur-mid) var(--ui-spring);
      will-change: transform;
      pointer-events: none;
    }

    .aero-menu__group {
      font-size: 11px;
      letter-spacing: 0.05em;
      font-weight: 700;
      text-transform: uppercase;
      color: color-mix(in srgb, var(--ui-ink) 45%, transparent);
      padding: 0 20px;
      margin: 16px 0 6px;
      white-space: nowrap;
      overflow: hidden;
      font-size: 11px;
      letter-spacing: 0.05em;
      font-weight: 700;
      text-transform: uppercase;
      /* 折叠态标题淡入淡出（opacity 过渡；h0/线形态为属性切换不参与过渡） */
      transition: opacity var(--ui-dur-mid) var(--ui-ease);
      &.is-line {
        opacity: 0;
        height: 0;
        padding: 0;
        margin: 8px 12px;
        border-top: 1px solid color-mix(in srgb, var(--ui-ink) 12%, var(--ui-line));
      }
    }

    .aero-menu__label {
      /* 折叠/展开项文字 opacity 0↔1（display:none 不可过渡） */
      transition: opacity var(--ui-dur-fast) var(--ui-ease);
    }

    /* 折叠态 item：40×40 居中、文字隐藏（hover 浮出菜单名由库内 AeroPopover 承担）；
       label 出流（absolute 占位不出 flex 计算）→ icon 居中几何零变化，
       opacity 0 淡出；容器 overflow:hidden 裁剪出流文字 */
    .aero-menu__item.is-col {
      width: 40px;
      height: 40px;
      margin: 2px auto;
      padding: 0;
      justify-content: center;
      & .aero-menu__label {
        position: absolute;
        left: 100%;
        opacity: 0;
        pointer-events: none;
      }
    }
  }
}
</style>
