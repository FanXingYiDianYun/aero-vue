<script setup lang="ts">
/**
 * AeroAnnounce 顶部通知横幅 —— 复刻 demo .announce
 * 深底横幅 + sparkles 图标 + 文案插槽 + 链接 + 关闭钮；
 * 关闭走 max-height + opacity 过渡（320ms），而非 v-if 瞬删，避免整页内容上跳。
 *
 * 关闭语义（本次修复「关了一次以后再也不出现」）：
 * - 默认关闭为「会话级」——不写 localStorage，刷新后横幅重新出现；
 * - 仅当显式传入 storageKey 才做持久记忆（且关闭时可被 v-model:open 重新打开，
 *   重开会自动清除该 key，保证可逆）；
 * - 支持 v-model:open 由外部完全接管显隐，便于页面提供「重新显示」入口。
 *
 * actionHref —— action 槽外层 <a> 的链接目标。
 * 提供 → 真实链接（href=actionHref + target="_blank" + rel="noopener noreferrer"，
 * 点击新标签打开）；未提供 → 现行为（href="#" + click preventDefault，零回归）。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { iconPaths, type AeroIconName } from '../../icon/src/paths'
import { useLocale } from '../../../locale'

// i18n：关闭钮 aria 走词包（ConfigProvider locale 注入）
const { announce: announceLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 通知类型图标（默认 sparkles） */
    icon?: AeroIconName
    /** 持久化 key（仅显式传入才记忆关闭态；默认不记忆，刷新后重新出现） */
    storageKey?: string
    /** 关闭时是否播放收起过渡（默认 true） */
    animated?: boolean
    /** 受控显隐（传入则外部完全接管，忽略 storageKey 初始化） */
    open?: boolean
    /** 跑马灯开关：false 完全禁用（文字溢出直接截断）；
        true 时自适应——仅当内容装不下（会换行/溢出）时才触发跑马灯，
        内容够宽时保持静态 */
    marquee?: boolean
    /** action 槽外层 <a> 的链接目标。
 * 提供 → 渲染真实 <a href + target="_blank" + rel="noopener noreferrer">（点击新标签打开）；
 * 未提供 → 现行为（href="#" + @click.prevent，零回归） */
    actionHref?: string
  }>(),
  { icon: 'sparkles', storageKey: '', animated: true, open: undefined, marquee: true, actionHref: undefined },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'closed'): void
  (e: 'update:open', v: boolean): void
}>()

const controlled = props.open !== undefined
const open = ref(
  controlled
    ? (props.open as boolean)
    : !(props.storageKey && localStorage.getItem(props.storageKey) === '1'),
)

// 受控模式：跟随外部 open
if (controlled) {
  watch(
    () => props.open,
    (v) => {
      if (v !== undefined) open.value = v
    },
  )
}

function close() {
  open.value = false
  // 仅显式传入 storageKey 才持久记忆（默认会话级，刷新可重现）
  if (props.storageKey) localStorage.setItem(props.storageKey, '1')
  emit('close')
  emit('update:open', false)
  if (props.animated) setTimeout(() => emit('closed'), 320)
  else emit('closed')
}

function reopen() {
  open.value = true
  if (props.storageKey) localStorage.removeItem(props.storageKey)
  emit('update:open', true)
}

// —— 跑马灯检测：marquee=true 时，仅当内容总宽超视口（会换行/溢出）才触发横向滚动 ——
const trackRef = ref<HTMLElement>()
const bodyRef = ref<HTMLElement>()
const needsMarquee = ref(false)
/** 动画周期（s）：一个循环 = 组宽 + 组间 gap（40px），匀速 80px/s，下限 6s */
const marqueeDur = ref(18)
/** 组间分隔间距（px），与 CSS __track gap 保持一致，参与循环周期计算 */
const MARQUEE_GAP = 40
/** 复制段份数（共 1+2=3 组）：第二圈重置瞬间视口正停在第二复制段中部，
    第三段尚未进入视口，循环回跳视觉不断（2 组时第二段尾端回跳突兀） */
const DUP_COUNT = 2

function checkMarquee() {
  if (!props.marquee) {
    needsMarquee.value = false
    return
  }
  const track = trackRef.value
  if (!track) return
  // 临时 nowrap + 不裁切测量第一遍组自然宽，避免 is-marquee 下 offsetWidth 被压缩
  const prevWrap = track.style.whiteSpace
  const prevOverflow = track.style.overflow
  track.style.whiteSpace = 'nowrap'
  track.style.overflow = 'visible'
  const group = track.querySelector('.aero-announce__group') as HTMLElement | null
  const groupW = group ? group.scrollWidth : 0
  const viewW = track.clientWidth
  track.style.whiteSpace = prevWrap
  track.style.overflow = prevOverflow
  needsMarquee.value = groupW > viewW + 2
  if (needsMarquee.value) {
    // 位移量 = 组宽 + 组间 gap（一个真实内容周期，与复制份数无关）：
    // track 是 flex:1（盒宽 = 容器宽），若用百分比 -50% 平移的是盒宽的一半
    // 而非内容周期，循环重置点与复制段错位 → 每圈闪一帧「重复帧跳变」。
    track.style.setProperty('--mq-period', `${groupW + MARQUEE_GAP}px`)
    // 周期 = (组宽 + gap) / 80px/s：keyframes to 是「一个周期」位移，
    // 多复制份（3 组）只决定重置瞬间视口处于哪一段，时长与位移不变，
    // 但重置时视口正停在第二复制段中部，第三段尚未入视 → 回跳不可见
    marqueeDur.value = Math.max(6, (groupW + MARQUEE_GAP) / 80)
  }
}

onMounted(async () => {
  await nextTick()
  checkMarquee()
  window.addEventListener('resize', checkMarquee)
  // 库级修复：对文案节点挂 ResizeObserver，内容/窗口尺寸变化即重判溢出，
  // 响应「切换长文案后跑马灯不生效」——旧实现仅在挂载/resize 时跑，不响应内容变化
  if (typeof ResizeObserver !== 'undefined' && bodyRef.value) {
    const ro = new ResizeObserver(() => checkMarquee())
    ro.observe(bodyRef.value)
    ;(bodyRef.value as any).__ro = ro
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMarquee)
  const ro = (bodyRef.value as any)?.__ro as ResizeObserver | undefined
  if (ro) { ro.disconnect(); delete (bodyRef.value as any).__ro }
})

watch(open, async (v) => {
  if (v) {
    await nextTick()
    checkMarquee()
  }
})

watch(() => props.marquee, checkMarquee)

// 暴露重开方法给父组件（v-model 之外的便捷入口）
defineExpose({ close, reopen })
</script>

<template>
  <div class="aero-announce" :class="{ 'is-open': open, 'is-anim': animated }" role="status">
    <div class="aero-announce__in">
      <div ref="trackRef" class="aero-announce__track" :class="{ 'is-marquee': needsMarquee }" :style="needsMarquee ? { animationDuration: marqueeDur + 's' } : undefined">
        <!-- 原文（第一遍）：跑马灯时整组（含 icon）一起滚动，避免 icon 原地不动被文字横穿 -->
        <div class="aero-announce__group">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="aero-announce__ic">
            <path v-for="(d, i) in iconPaths[icon] ?? []" :key="i" :d="d" />
          </svg>
          <div ref="bodyRef" class="aero-announce__body">
            <b v-if="$slots.title">
              <slot name="title" />
            </b>
            <div class="aero-announce__text"><slot /></div>
            <a
              v-if="$slots.action"
              class="aero-announce__act"
              :href="actionHref ?? '#'"
              :target="actionHref ? '_blank' : undefined"
              :rel="actionHref ? 'noopener noreferrer' : undefined"
              @click="actionHref ? undefined : ($event as Event).preventDefault()"
            >
              <slot name="action" />
            </a>
          </div>
        </div>
        <!-- 复制段 ×2 仅跑马灯态渲染（静态态只渲染第一组，消除桌面/宽视口下
             「0.5 复制段 - 居中完整组 - 0.5 复制段」的两侧露头）；
             跑马灯位移一个周期（组宽+gap）后循环重置，重置瞬间组2 已滑出、
             组3 尚未入视，视口正停在组2 中部 → 回跳不可见 -->
        <template v-if="needsMarquee">
          <template v-for="n in DUP_COUNT" :key="n">
            <div class="aero-announce__group" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="aero-announce__ic">
                <path v-for="(d, i) in iconPaths[icon] ?? []" :key="i" :d="d" />
              </svg>
              <div class="aero-announce__body">
                <b v-if="$slots.title">
                  <slot name="title" />
                </b>
                <div class="aero-announce__text"><slot /></div>
                <a
                  v-if="$slots.action"
                  class="aero-announce__act"
                  :href="actionHref ?? '#'"
                  :target="actionHref ? '_blank' : undefined"
                  :rel="actionHref ? 'noopener noreferrer' : undefined"
                  @click="actionHref ? undefined : ($event as Event).preventDefault()"
                >
                  <slot name="action" />
                </a>
              </div>
            </div>
          </template>
        </template>
      </div>
      <button class="aero-announce__close" type="button" :aria-label="announceLabels.closeAria" @click="close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-announce {
  box-sizing: border-box;
  /* 品牌色相深底：亮/暗主题统一由 --ui-brand 派生，避免硬编码藏蓝；
     深底上文字/链接/关闭钮统一使用 --ui-on-ink（白），与原值 rgb(255,255,255) 等价 */
  background: color-mix(in srgb, var(--ui-brand) 14%, #0a1420);
  color: var(--ui-on-ink);
  position: relative;
  overflow: hidden;

  &__in {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 16px;
    max-width: 1180px;
    margin: 0 auto;
    position: relative; /* 关闭钮绝对定位锚点 */
    overflow: hidden; /* 跑马灯裁切边界 */
    color: inherit; /* 继承 .aero-announce 白字，确保深底横幅可读 */
  }

  /* 跑马灯轨道：原文 + 复制段 ×2（共 3 组）横排，整轨滚动；
     track gap 40px 分隔各组（避免图标紧贴链接），
     justify-content:center 保证静态（非跑马灯）态组块水平居中；
     gap 参与循环周期计算（位移/时长 = 组宽 + gap，与复制份数无关） */
  &__track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px; /* 组间分隔间距（避免 icon 紧贴前组链接），参与周期计算 */
    flex: 1;
    min-width: 0;
    overflow: visible; /* 复制段在视口外，由 __in 统一裁切 */
  }
  &__group {
    display: flex;
    align-items: center;
    gap: 11px;
    flex: none; /* 不压缩，保持自然宽度 */
    min-width: 0;
  }

  &__ic {
    color: var(--ui-brand);
    flex: none;
  }

  &__body {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 13.5px;
    min-width: 0;
    b {
      font-family: var(--ui-font-en);
      font-size: 13px;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .aero-announce__text {
      color: var(--ui-on-ink-2);
      line-height: 1.5;
      min-width: 0;
      /* 深底横幅上浅灰白副文本色（token --ui-on-ink-2 = #CDE0EA，与 baseline rgb(207,224,234) 等价） */
    }
  }

  /* 跑马灯态：轨道匀速向左，一个循环位移 = 组宽 + gap（40px），
     复制段（第二遍）+ gap 恰好接上第一遍滑出位置，循环重置无跳变；
     首帧即有内容（translateX(0) 时组1在视口内），无空白闪回；
     左右缘 mask 渐隐由 __in 承担（跑马灯态下加 mask 类） */
  &__track.is-marquee {
    animation: aero-announce-marquee var(--marquee-dur, 18s) linear infinite;
    &:hover {
      animation-play-state: paused;
    }
    .aero-announce__body {
      flex-wrap: nowrap;
    }
    .aero-announce__text {
      white-space: nowrap;
    }
  }

  &__act {
    /* 深底横幅上的链接强调：纯白高亮 + hover 下划线自左向右展开动效；
       品牌色 cyan 在深藏蓝底上对比偏弱（用户反馈"颜色仍不对"），改白色更清晰。
       color:inherit 覆盖插槽内嵌 <a> 的默认品牌色/--ui-brand-ink 穿透 */
    color: var(--ui-on-ink);
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    position: relative;
    /* 插槽内嵌 a 继承外层颜色（:deep 突破 scoped 边界，覆盖浏览器默认 link 色） */
    :deep(a) {
      color: inherit;
      text-decoration: none;
      &:hover { color: inherit; }
    }
    /* 下划线动效：默认从左侧 0 宽展开，hover 时向右填满，品牌色细线 */
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 1.5px;
      background: var(--ui-brand);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.28s var(--ui-ease);
    }
    &:hover {
      &::after {
        transform: scaleX(1);
      }
    }
  }

  &__close {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: 0;
    color: var(--ui-on-ink-3);
    padding: 5px;
    display: flex;
    cursor: pointer;
    border-radius: 7px;
    transition: 0.2s;
    &:hover {
      color: var(--ui-on-ink);
      background: color-mix(in srgb, var(--ui-on-ink) 10%, transparent);
    }
  }

  /* 收起过渡：max-height + opacity + margin 一起收，内容平滑上移不跳变 */
  &.is-anim {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
    padding: 0;
    transition: max-height 0.3s var(--ui-ease), opacity 0.24s var(--ui-ease);
    overflow: hidden;
  }
  &.is-anim.is-open {
    max-height: 240px;
    opacity: 1;
  }

  :global(html[data-theme='dark']) & {
    background: color-mix(in srgb, var(--ui-brand) 18%, #0d1a28);
  }
}

/* 跑马灯 keyframes：
   0%   → 组1 在初始位（内容已在视口内，首帧无空白）
   100% → 向左平移「一个循环周期 = 组宽 + gap」（--mq-period 由 JS 实测写入）：
     复制段恰好接上组1滑出位置，循环重置时视觉无缝。
   注意不可用 translateX(-50%)——百分比按 track 盒宽（flex:1=容器宽）计，
   与内容周期不一致，每圈重置点错位即产生用户所见「重复帧闪屏」 */
@keyframes aero-announce-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-1 * var(--mq-period, 50%)));
  }
}
</style>
