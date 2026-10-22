<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { highlightLine } from './highlight'
import { useLocale } from '../../../locale'

const props = withDefaults(
  defineProps<{
    /** 源码文本 */
    code: string
    /** 语言标签（显示于右上角） */
    lang?: string
    /** 窗口标题 */
    title?: string
    /** 是否高亮（关闭则纯文本） */
    highlight?: boolean
    /** 显示行号 */
    lineNumbers?: boolean
    /** 显示复制按钮 */
    copyable?: boolean
    /** 嵌入态：去掉自身圆角/边框/投影，直接贴合父容器（用于 .pg-codeview
        折叠面板等已有外壳的场景，消除"浅卡壳套深面板"的双重边框堆叠） */
    flush?: boolean
    /** 可折叠：标题栏右侧追加展开/收起钮，代码区 grid 0fr↔1fr 高度过渡
        （与 Collapse / TreeSelect 同源动效）；显隐由 v-model 受控或自管理 */
    collapsible?: boolean
    /** 折叠显隐（v-model）；未传入时内部自管理，默认展开 */
    open?: boolean
  }>(),
  { lang: '', title: '', highlight: true, lineNumbers: true, copyable: true, flush: false, collapsible: false, open: undefined },
)

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
}>()

// 受控 v-model:open；未传入时内置自管理（折叠钮点击直接 toggle）
const openRef = ref(props.open ?? true)
if (props.open !== undefined) {
  watch(() => props.open, (v) => { openRef.value = v as boolean })
}
function toggleOpen() {
  openRef.value = !openRef.value
  emit('update:open', openRef.value)
}

// 复制反馈 1.8s + useLocale 文案（中文"已复制" / 英文"Copied"）
const { code: codeLabels } = useLocale()
const copyState = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined
watch(copyState, (v) => {
  if (v) {
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copyState.value = false }, 1800)
  }
})

const lines = computed(() => props.code.replace(/\n$/, '').split('\n'))

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const rendered = computed(() =>
  lines.value.map((ln) => (props.highlight ? highlightLine(ln) : escape(ln))),
)

async function onCopy() {
  /* clipboard API 仅在安全上下文（https/localhost）可用——以
 http://IP:5173 访问时 navigator.clipboard === undefined，writeText 抛
 TypeError 进旧 catch 静默 → 「点复制无任何作用」。修复：主路 clipboard.
 writeText；不可用/reject 回退隐藏 textarea + execCommand('copy')
 （同步在 click handler 栈内执行，不依赖用户手势转生）；两路都失败
 console.warn 且**不显示已复制**（禁止撒谎）。零新依赖。 */
  if (await copyToClipboard(props.code)) {
    copyState.value = true
    return
  }
  console.warn('[aero-code-block] copy failed: clipboard API unavailable and execCommand fallback did not succeed')
}

/** 双路复制：navigator.clipboard.writeText 优先，异常/缺失回退
    textarea+execCommand；任一路成功返回 true */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    /* 非安全上下文（TypeError）或权限 reject → 走回退 */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  // 移出可视区但保持可选中（display:none 的元素选不上）
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.top = '-9999px'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  ta.setSelectionRange(0, ta.value.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  } finally {
    document.body.removeChild(ta)
  }
  return ok
}
</script>

<template>
  <div class="aero-cw" :class="{ 'is-flush': flush, 'is-collapsed': collapsible && !openRef }">
    <!-- 头部（J1 终版规格）：左 = 标题 + 语言徽标，右 = 复制 + 折叠（gap 4px）；
         整条可点（collapsible），右侧 stopPropagation 不触发折叠 -->
    <div
      class="aero-cw__bar"
      :class="{ 'is-clickable': collapsible }"
      role="button"
      :tabindex="collapsible ? 0 : undefined"
      :aria-expanded="collapsible ? openRef : undefined"
      @click="collapsible ? toggleOpen() : undefined"
      @keydown.enter="collapsible ? toggleOpen() : undefined"
      @keydown.space="collapsible ? ($event.preventDefault(), toggleOpen()) : undefined"
    >
      <div class="aero-cw__bar-left">
        <span v-if="title" class="aero-cw__title">{{ title }}</span>
        <span v-if="lang" class="aero-cw__lang">{{ lang }}</span>
      </div>
      <div class="aero-cw__bar-right" @click.stop>
        <button v-if="copyable" class="aero-cw__copy" :class="{ 'is-copied': copyState }" type="button" @click.stop="onCopy">
          <svg v-if="copyState" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 12l-5 5" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="8" y="8" width="14" height="14" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span v-if="copyState" class="aero-cw__copy-text">{{ codeLabels.copied }}</span>
        </button>
        <button
          v-if="collapsible"
          class="aero-cw__fold"
          type="button"
          :aria-expanded="openRef"
          :aria-label="openRef ? codeLabels.collapse : codeLabels.expand"
          @click="toggleOpen"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
    <!-- 代码区（J1 展开动画三层，与 viewCode 面板对齐）：
         外层 grid 0fr↔1fr（.28s cubic-bezier(.4,0,.2,1)）→
         内层 min-height:0 + overflow:hidden 常驻（禁止 overflow 切换）→
         pre opacity 0→1（.25s ease） -->
    <div class="aero-cw__code-zone">
      <div class="aero-cw__code-in">
        <pre class="aero-cw__code"><code><span
          v-for="(html, i) in rendered"
          :key="i"
          class="aero-cw__line"
        ><span v-if="lineNumbers" class="aero-cw__ln">{{ i + 1 }}</span><span class="aero-cw__lc" v-html="html" /></span></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-cw {
  box-sizing: border-box;
  /* 色系：ink 黑只属按钮家族，CodeBlock 用主题色衍生系：
     border 2px solid color-mix(in srgb, var(--ui-brand) 32%, var(--ui-line))；
     box-shadow var(--ui-shadow-sm-brand)（既有 token 4px 4px 0 brand，Button outline hover 同款）；
     radius 14px */
  position: relative;
  background: var(--ui-surface);
  border: 2px solid color-mix(in srgb, var(--ui-brand) 32%, var(--ui-line));
  box-shadow: var(--ui-shadow-sm-brand);
  border-radius: 14px;
  max-width: 100%;
  overflow: hidden;

  /* 头部：height:40px; padding:0 12px; display:flex; align-items:center; gap:8px;
 背景 --ui-surface-2（保留）；底边 2px solid var(--ui-ink)
 → 2px solid 同新边框色（brand 32% mix line）；collapsible hover brand8% 不动 */
  &__bar {
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--ui-surface-2);
    border-bottom: 2px solid color-mix(in srgb, var(--ui-brand) 32%, var(--ui-line));
    cursor: pointer;
    user-select: none;
    transition: background 0.18s ease;
    &:hover {
      background: color-mix(in srgb, var(--ui-brand) 8%, var(--ui-surface-2));
    }
    &:focus-visible {
      outline: none;
      box-shadow: var(--ui-focus-ring);
    }
  }

  /* bar 左：语言徽标（标题并存时排徽标前） */
  &__bar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }
  /* bar 右：复制与折叠按钮间 gap:4px */
  &__bar-right {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: none;
  }

  /* 文件标题：color 用 var(--ui-ink)（非 ink-3）；font-weight 600；
     字号/字体不动 */
  &__title {
    font-family: var(--ui-font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--ui-ink);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 语言徽标：bg var(--ui-brand)、color var(--ui-on-brand)、无 border；
     几何（999 胶囊 / 3px 10px / 11px / uppercase）不动 */
  &__lang {
    font-family: var(--ui-font-mono);
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ui-on-brand);
    padding: 3px 10px;
    border-radius: 99px;
    background: var(--ui-brand);
    flex: none;
  }

  /* copy/fold 幽灵钮：
 background transparent + border 1px transparent + color --ui-ink-3；
 hover bg brand12%/transparent + border brand30%/transparent + color ink；
 按压：active scale(0.94)；active bg brand16%；
 transition 含 transform 0.15s ease。
 28×28/r8/图标 16px */
  &__copy,
  &__fold {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-sizing: content-box;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid transparent;
    background: transparent;
    color: var(--ui-ink-3);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
    flex: none;
    svg {
      width: 16px;
      height: 16px;
    }
    &:hover {
      color: var(--ui-ink);
      background: color-mix(in srgb, var(--ui-brand) 12%, transparent);
      border-color: color-mix(in srgb, var(--ui-brand) 30%, transparent);
    }
    &:active {
      transform: scale(0.94);
      background: color-mix(in srgb, var(--ui-brand) 16%, transparent);
    }
  }
  /* 复制按钮默认 = 28×28 圆钮（仅图标）；copied 态 = 胶囊展开
 高 28 + padding 0 10 + 对勾 + 词包文案，color 品牌色，宽度过渡 .2s */
  /* 默认仅图标（文案 span v-if 不渲染，无隐藏溢出）；copied 态 = 胶囊展开
 高 28 + padding 0 10 + 对勾 + 词包文案，color 品牌色，宽度过渡 .2s */
  &__copy {
    white-space: nowrap;
    /* copied 胶囊同按压规则——active scale(0.94) 需 transition transform，
 与共享 __copy/__fold 规则一致（0.15s ease），其余沿用现 token */
    transition: background 0.15s ease, width 0.2s ease, color 0.2s ease, transform 0.15s ease;
    .aero-cw__copy-text {
      font-size: 12px;
      line-height: 1;
      animation: cw-copy-in 0.2s ease both;
    }
    /* copied 态钮 bg → brand、border-color → transparent（幽灵钮无实描边）；
 copy-text 与对勾 color → on-brand；胶囊展开几何/动画不动 */
    &.is-copied {
      width: auto;
      padding: 0 10px;
      background: var(--ui-brand);
      border-color: transparent;
      color: var(--ui-on-brand);
      &:hover {
        color: var(--ui-on-brand);
      }
    }
  }
  @keyframes cw-copy-in {
    from { max-width: 0; opacity: 0; }
    to { max-width: 8em; opacity: 1; }
  }
  /* 折叠 chevron open 时 rotate(180deg)（v 形图标旋 180 = ∧ 指向"收起"），
 transition transform .28s cubic-bezier(.4,0,.2,1) */
  &__fold {
    svg {
      transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
  &:not(.is-collapsed) .aero-cw__fold svg {
    transform: rotate(180deg);
  }

  /* 展开动画（J1 三层，与 viewCode 对齐）：
     外层 display:grid; grid-template-rows:0fr(默认) / 1fr(展开)；
     transition: grid-template-rows .28s cubic-bezier(.4,0,.2,1)；
     内层 min-height:0; overflow:hidden（常驻，禁止任何 overflow 切换）；
     pre 同时 opacity 0→1，transition .25s ease */
  &__code-zone {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .is-collapsed &__code-zone {
    grid-template-rows: 0fr;
  }
  &__code-in {
    min-height: 0;
    overflow: hidden;
  }
  &__code {
    opacity: 1;
    transition: opacity 0.25s ease;
  }
  .is-collapsed &__code {
    opacity: 0;
  }

  /* pre：margin:0; padding:14px 16px 16px; tab-size:2;
 overflow:auto（仅横向）; font: 13px/1.6
 等宽走 --ui-font-mono token（内置 JetBrains Mono woff2 + 完整回退栈）；
 color: var(--ui-ink); background: transparent */
  &__code {
    margin: 0;
    padding: 14px 16px 16px;
    tab-size: 2;
    overflow-x: auto;
    font-family: var(--ui-font-mono);
    font-size: 13px;
    line-height: 1.6;
    color: var(--ui-ink);
    background: transparent;
    /* UA 样式表 code{font-family:monospace} 的元素自身声明压过从 pre 继承的
 var(--ui-font-mono)——正文 code/高亮 span/行号实际落在 generic monospace。
 子元素 inherit 回 pre 的 token 值，pre/code/全部代码子元素 computed 统一以
 "JetBrains Mono" 开头（双链路不变式） */
    code {
      font-family: inherit;
    }
  }
  &__line {
    display: flex;
    width: max-content;
    min-width: 100%;
    border-radius: 3px;
    transition: background 0.1s;
    &:hover {
      background: color-mix(in srgb, var(--ui-brand) 8%, transparent);
    }
  }
  &__ln {
    flex: none;
    width: 2.8em;
    text-align: right;
    padding-right: 1.1em;
    color: var(--ui-ink-3);
    user-select: none;
    font-size: 12px;
    opacity: 0.6;
    line-height: inherit;
  }
  &__lc {
    white-space: pre;
  }

  /* 嵌入态：去圆角/边框，直接贴合父容器（J1 规格下的 flush 仅去壳，不动色值） */
  &.is-flush {
    border: 0;
    border-radius: 0;
  }

  /* 语法高亮：--ui-code-tk-* 按主题各出一组（亮底/深底，tokens.scss 定义），
     正文随 surface 明暗；v-html 节点需 :deep 穿透 */
  :deep(.tk-c) { color: var(--ui-code-tk-c); font-style: italic; }
  :deep(.tk-s) { color: var(--ui-code-tk-s); }
  :deep(.tk-k) { color: var(--ui-code-tk-k); }
  :deep(.tk-k2) { color: var(--ui-code-tk-k2); }
  :deep(.tk-f) { color: var(--ui-code-tk-f); }
  :deep(.tk-n) { color: var(--ui-code-tk-n); }
  :deep(.tk-p) { color: var(--ui-code-tk-p); }
  :deep(.tk-u) { color: var(--ui-code-tk-u); }
  :deep(.tk-ok) { color: var(--ui-code-tk-ok); font-weight: 700; }
  :deep(.tk-v) { color: var(--ui-code-tk-v); }
}
</style>
