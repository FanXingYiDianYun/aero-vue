<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRafScroll } from '../../../composables'

const props = withDefaults(
  defineProps<{
    /** 触发吸顶的滚动阈值 px */
    offsetTop?: number
    /** 吸附后与视口顶的间距。默认 76（sticky 导航 68px + 8px 余量）。
        未传 anchor 时的静态回退值；传了 anchor 则由其底边实时推算，
        此值仅在 anchor 尚未渲染/被卸载时兜底 */
    top?: number
    /** 吸附基准元素：吸附位 = 该元素底边 + gutter。默认为 target 滚动容器
        内的首个吸顶条（[data-affix-anchor] / position:sticky|fixed 元素），
        使 Affix 自适应顶部导航以及 Announce 通知横幅的展开与收起——
        横幅展开时基准线下移，收起后自动回升，无需业务侧改传 top */
    anchor?: () => HTMLElement | null | undefined
    /** 基准元素底边与吸附按钮之间的间距 px（默认 8） */
    gutter?: number
    /** 滚动容器（默认 window；演示页 PC 端滚动发生在 .pg-main，
        需传入该容器，否则 window.scrollY 恒 0、offsetTop 判定永不触发） */
    target?: () => HTMLElement | Window | null
  }>(),
  { offsetTop: 0, top: 76, target: undefined, anchor: undefined, gutter: 8 },
)

const emit = defineEmits<{
  (e: 'change', fixed: boolean): void
}>()

const wrap = ref<HTMLElement>()
const ph = ref<HTMLElement>()
const fixed = ref(false)
/** 动态吸附位（px，视口坐标）：随基准元素底边变化 */
const topPx = ref(props.top)

const scroller = useRafScroll(
  () => props.target?.() ?? window,
  () => sync(),
)
let ro: ResizeObserver | undefined

/**
 * 解析吸附基准元素。
 * 显式传入 anchor 时以之为准；否则在滚动容器内自动探测"吸顶条"——
 * 依次尝试 [data-affix-anchor]、position 为 sticky/fixed 的元素，
 * 均无命中则回退到滚动容器自身（视口顶）。
 * 自动探测覆盖了演示页 Announce 横幅展开/收起导致导航条下移的场景：
 * 横幅在文档流内、导航 sticky 于其下，二者共同撑起基准线下缘。
 */
function resolveAnchor(): HTMLElement | null {
  const explicit = props.anchor?.()
  if (explicit) return explicit
  const container = props.target?.()
  if (!(container instanceof HTMLElement)) return null
  const marked = container.querySelector<HTMLElement>('[data-affix-anchor]')
  if (marked) return marked
  // 逐元素找首个吸顶/固定定位的可见直接子块（即顶部菜单条）
  for (const el of Array.from(container.children)) {
    if (!(el instanceof HTMLElement)) continue
    const pos = getComputedStyle(el).position
    if (pos !== 'sticky' && pos !== 'fixed') continue
    if (el.getBoundingClientRect().height > 0) return el
  }
  return null
}

/**
 * 计算吸附位：基准元素底边 + gutter，并夹在视口内（不得高于 gutter）。
 * 基准元素随顶部横幅展开而变高/变矮时，吸附位同步跟随——这正是
 * "Affix 按钮在 Announce 展开时被导航遮挡" 的成因（原实现只认静态 top）。
 */
function syncTop() {
  const a = resolveAnchor()
  const stake = a
    ? a.getBoundingClientRect().bottom + props.gutter
    : props.top
  const next = Math.max(props.gutter, Math.round(stake))
  if (next !== topPx.value) topPx.value = next
}

function sync() {
  const el = wrap.value
  if (!el) return
  syncTop()
  const r = el.getBoundingClientRect()
  // 判定依据：el 相对滚动容器内容顶部的文档位移是否越过 offsetTop。
  // el 在容器内容中的相对位置 = r.top - containerRect.top + container.scrollTop
  // 未传 target（window 滚动）时退化为 r.top <= offsetTop + 1
  const container = props.target?.()
  let trigger: number
  if (container instanceof HTMLElement) {
    trigger = r.top - container.getBoundingClientRect().top + container.scrollTop
  } else {
    trigger = r.top
  }
  const should = trigger > props.offsetTop
  if (should !== fixed.value) {
    fixed.value = should
    // 占位保持文档流高度，避免吸附瞬移
    if (ph.value) {
      ph.value.style.height = fixed.value ? r.height + 'px' : '0'
      ph.value.style.display = fixed.value ? 'block' : 'none'
    }
    emit('change', should)
  }
}

const onResize = () => sync()

onMounted(() => {
  scroller.start()
  window.addEventListener('resize', onResize, { passive: true })
  // 基准线随顶部横幅展开/收起而变：监听 anchor 链（滚动容器 + 各吸顶子块）
  // 的尺寸变化重算吸附位。ResizeObserver 不覆盖"元素位移但尺寸不变"，
  // 故配合下方 Transition 钩子与 window resize 一并兜底。
  const observed: Element[] = []
  const container = props.target?.()
  if (container instanceof HTMLElement) observed.push(container)
  const a = resolveAnchor()
  if (a) observed.push(a)
  if (observed.length && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(onResize)
    observed.forEach((el) => ro?.observe(el))
  }
  sync()
  // 挂载时若已处于越阈值状态（如直接深链进入 affix 页、容器已滚动），
  // scroll 监听不会自动补触发，需下一帧再 sync 一次兜底
  requestAnimationFrame(sync)
  document.addEventListener('transitionrun', onResize)
  document.addEventListener('transitionend', onResize)
})
onBeforeUnmount(() => {
  scroller.stop()
  ro?.disconnect()
  ro = undefined
  window.removeEventListener('resize', onResize)
  document.removeEventListener('transitionrun', onResize)
  document.removeEventListener('transitionend', onResize)
  // 组件卸载（切页时 demo 被替换）立即解除 fixed 并清空占位，
  // 防止残留一帧的 position:fixed 按钮拦截侧栏/导航点击
  if (fixed.value) {
    fixed.value = false
    if (ph.value) {
      ph.value.style.height = '0'
      ph.value.style.display = 'none'
    }
  }
})
</script>

<template>
  <div ref="wrap" class="aero-affix">
    <div ref="ph" class="aero-affix__ph" aria-hidden="true" />
    <div class="aero-affix__inner" :class="{ 'is-fixed': fixed }" :style="{ '--affix-top': topPx + 'px' }">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-affix {
  box-sizing: border-box;
  &__ph {
    display: none;
  }

  &__inner {
    transition: transform 0.28s var(--ui-ease), box-shadow 0.28s var(--ui-ease);
    will-change: transform;

    &.is-fixed {
      position: fixed;
      top: var(--affix-top, 76px);
      left: 50%;
      /* 水平居中：与内容区视觉对齐（不再贴左缘） */
      transform: translateX(-50%) translateY(-3px);
      z-index: calc(var(--ui-z-nav) - 20);
      box-shadow: 0 8px 16px -8px rgba(12, 27, 42, 0.18);
    }
  }
}
</style>
