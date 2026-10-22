<script setup lang="ts">
import { computed, ref, TransitionGroup } from 'vue'
import { iconPaths } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：双面板标题缺省文案 + 移动钮 aria 走词包（ConfigProvider locale 注入；titles prop 显式传入仍覆盖）
const { transfer: trLabels } = useLocale()

export interface TransferItem {
  key: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    data: TransferItem[]
    /** 目标侧 key 列表 */
    modelValue: string[]
    titles?: [string, string]
    disabled?: boolean
  }>(),
  { titles: undefined, disabled: false },
)

/** 面板标题：显式 titles prop > 词包（zh「来源/目标」/ en「Source/Target」） */
const sourceTitle = computed(() => props.titles?.[0] ?? trLabels.value.source)
const targetTitle = computed(() => props.titles?.[1] ?? trLabels.value.target)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
  (e: 'change', v: string[]): void
}>()

const leftChecked = ref<string[]>([])
const rightChecked = ref<string[]>([])

const source = computed(() => props.data.filter((d) => !props.modelValue.includes(d.key)))
const target = computed(() =>
  props.modelValue
    .map((k) => props.data.find((d) => d.key === k))
    .filter((d): d is TransferItem => !!d),
)

function toggle(list: 'l' | 'r', key: string, disabled?: boolean) {
  if (props.disabled || disabled) return
  const arr = list === 'l' ? leftChecked : rightChecked
  const i = arr.value.indexOf(key)
  if (i >= 0) arr.value.splice(i, 1)
  else arr.value.push(key)
}

function toRight() {
  if (props.disabled || !leftChecked.value.length) return
  const merged = [...props.modelValue, ...leftChecked.value]
  emit('update:modelValue', merged)
  emit('change', merged)
  leftChecked.value = []
}
function toLeft() {
  if (props.disabled || !rightChecked.value.length) return
  const merged = props.modelValue.filter((k) => !rightChecked.value.includes(k))
  emit('update:modelValue', merged)
  emit('change', merged)
  rightChecked.value = []
}
</script>

<template>
  <div class="aero-transfer" :class="{ 'is-disabled': disabled }">
    <div class="aero-transfer__panel">
      <header class="aero-transfer__head">
        {{ sourceTitle }}<b>{{ source.length }}</b>
      </header>
      <TransitionGroup tag="ul" name="aero-transfer" class="aero-transfer__list">
        <li
          v-for="it in source"
          :key="it.key"
          :class="{ 'is-checked': leftChecked.includes(it.key), 'is-off': it.disabled }"
          @click="toggle('l', it.key, it.disabled)"
        >
          <i class="aero-transfer__box" />
          {{ it.label }}
        </li>
      </TransitionGroup>
    </div>

    <div class="aero-transfer__ops">
      <button type="button" :disabled="!leftChecked.length || disabled" :aria-label="trLabels.toRightAria" @click="toRight">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['chevron-right']" :key="i" :d="d" />
        </svg>
      </button>
      <button type="button" :disabled="!rightChecked.length || disabled" :aria-label="trLabels.toLeftAria" @click="toLeft">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in iconPaths['chevron-left']" :key="i" :d="d" />
        </svg>
      </button>
    </div>

    <div class="aero-transfer__panel">
      <header class="aero-transfer__head">
        {{ targetTitle }}<b>{{ target.length }}</b>
      </header>
      <TransitionGroup tag="ul" name="aero-transfer" class="aero-transfer__list">
        <li
          v-for="it in target"
          :key="it.key"
          :class="{ 'is-checked': rightChecked.includes(it.key) }"
          @click="toggle('r', it.key)"
        >
          <i class="aero-transfer__box" />
          {{ it.label }}
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-transfer {
  box-sizing: border-box;
  display: flex;
  gap: 12px;
  align-items: center;
  /* 组件本身不得撑破视口（页面侧 demo 限宽另有 margin 规则） */
  max-width: 100%;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__panel {
    box-sizing: border-box;
    width: 190px;
    border: 2px solid var(--ui-line);
    border-radius: var(--ui-radius);
    background: var(--ui-card);
    overflow: hidden;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 700;
    color: var(--ui-ink-2);
    background: var(--ui-bg-soft);
    border-bottom: 2px solid var(--ui-line);
    b {
      font-family: var(--ui-font-mono);
      background: var(--ui-bg-tint);
      border: 2px solid var(--ui-line-2);
      border-radius: 99px;
      padding: 0 9px;
      font-size: 12px;
      color: var(--ui-brand-ink);
    }
  }
  &__list {
    list-style: none;
    margin: 0;
    padding: 8px;
    /* 面板高度稳定：min-height 与 max-height 同值（220px 内容区），
       选项穿梭增减时面板不随内容塌缩/长高，页面不抖动 */
    min-height: 204px;
    max-height: 220px;
    overflow-y: auto;
    /* 横向永不需滚动：列表项为块级（width:auto 已含 padding 填满内容盒），
       但 enter/leave 动画的 translateX(±14px) 会瞬时撑出水平溢出 → X 滚动条闪现。
       overflow-x 设为 hidden 后，overflow-y:auto 在计算样式中保持可见且改为
       "始终预留槽位"的经典规则：Y 条不再随内容增减出现/消失，X/Y 双双杜绝闪现 */
    overflow-x: hidden;
    position: relative; /* leave-active 绝对定位基准 */
    li {
      display: block;
      padding: 8px 10px;
      margin-top: 2px; /* 原 flex gap:2px → 块级相邻间距等价 */
      border-radius: 9px;
      font-size: 13.5px;
      line-height: 20px;
      color: var(--ui-ink);
      cursor: pointer;
      transition: 0.15s;
      &:first-child {
        margin-top: 0;
      }
      &:hover {
        background: var(--ui-bg-soft);
      }
      &.is-checked {
        background: var(--ui-bg-tint);
        color: var(--ui-brand-ink);
        font-weight: 700;
        .aero-transfer__box {
          background: var(--ui-brand);
          border-color: var(--ui-brand);
        }
      }
      &.is-off {
        opacity: 0.4;
        pointer-events: none;
      }
    }
  }
  /* 复选框与 AeroCheckbox 同款视觉（20px 圆角 7px + 内块 spring 弹入） */
  &__box {
    width: 20px;
    height: 20px;
    border: 2px solid var(--ui-line-2);
    border-radius: 7px;
    background: var(--ui-card);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    margin-right: 10px; /* 原 flex gap:10px → 内联布局等价 */
    transition: 0.2s;

    &::after {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: var(--ui-on-brand);
      transform: scale(0);
      transition: 0.25s var(--ui-spring);
    }
  }

  li.is-checked &__box {
    background: var(--ui-brand);
    border-color: var(--ui-brand);

    &::after {
      transform: scale(1);
    }
  }

  &__ops {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: none;
    button {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      border: 2px solid var(--ui-line);
      background: var(--ui-card);
      color: var(--ui-ink-2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.2s;
      &:hover:not(:disabled) {
        border-color: var(--ui-brand);
        color: var(--ui-brand-ink);
        transform: translateX(2px);
      }
      &:disabled {
        opacity: 0.35;
        cursor: default;
      }
      &:last-child:hover:not(:disabled) {
        transform: translateX(-2px);
      }
    }
  }

  /* ≤480px 双面板定宽 190px 合计 440px 撑破 390px 视口（出现横向 scrollOverflow）→
 面板改 flex:1 等分，桌面（>480px）像素不变（媒体查询隔离） */
  @media (max-width: 480px) {
    gap: 8px;
    .aero-transfer__panel {
      width: auto;
      flex: 1;
      min-width: 0;
    }
    .aero-transfer__ops {
      button { width: 30px; height: 30px; }
    }
  }
}

/* 穿梭框项过渡（TransitionGroup name="aero-transfer"）：
   enter（新增项）滑入 + 淡入；leave（移除项）滑出 + 淡出；
   move 让余下项平滑归位（FLIP 由 Vue 内置 transform 完成），
   配合 __list min-height 稳定，面板高度不抖动 */
/* 滑入/滑出统一用内缩的 opacity + scaleX（origin 指向运动方向）实现：
   - 不再使用 translateX(±14px)——位移会把元素整体推出内容盒右缘/左缘，
     瞬时撑大 scrollWidth → X 滚动条闪现一帧；scaleX 从盒边缘向内收缩，
     边界恒不超出 ul padding box，overflow-x:hidden 仅作冗余保险保留。
   - leave-active 绝对定位后 left/right:0 使 width 重算为内容盒宽（170），
     与 static 时一致，无溢出。 */
/* 滑入/滑出统一用内缩的 opacity + scaleX（origin 指向运动方向）实现：
   - 不再使用 translateX(±14px)——位移会把元素整体推出内容盒右缘/左缘，
     瞬时撑大 scrollWidth → X 滚动条闪现一帧；scaleX 从盒边缘向内收缩，
     边界恒不超出 ul padding box，overflow-x:hidden 仅作冗余保险保留。
   - leave-active 绝对定位后显式 width = auto（块级默认填满内容盒），
     与 static 时一致，无溢出。 */
.aero-transfer-enter-active,
.aero-transfer-leave-active {
  /* --ul-scroll-top：leave-active 的 top 换算需要 ul 实时滚动偏移；
     scroll 事件自更新，无需 JS 介入 */
  transition:
    transform 0.24s var(--ui-ease),
    opacity 0.2s var(--ui-ease);
}
.aero-transfer-enter-from {
  opacity: 0;
  transform: scaleX(0.88);
  transform-origin: right center; /* 新项自右侧"卷入"，方向感与原 translateX(+14) 等价 */
}
.aero-transfer-leave-active {
  position: absolute;
  /* Vue TransitionGroup 在元素脱流前把其视口 rect.top 写入 --leave-top。
     本 ul 的 position:relative 使绝对定位子元素 top 原点对齐其 border box 顶边，
     而该边框为 0 → border/padding/content 盒顶共点，故直接用 var(--leave-top) 即可。
     left/right 内缩回 ul padding（8px）→ width 重算 = 内容盒宽，无横向溢出。 */
  top: var(--leave-top, 0);
  left: 8px;
  right: 8px;
}
.aero-transfer-leave-to {
  opacity: 0;
  transform: scaleX(0.88);
  transform-origin: left center; /* 旧项向左侧"卷出"，方向感与原 translateX(-14) 等价 */
}
.aero-transfer-move {
  transition: transform 0.26s var(--ui-ease);
}
</style>
