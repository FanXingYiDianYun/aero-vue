<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useLocale } from '../../../locale'

// i18n：跳过/下一步/完成按钮文案走词包（ConfigProvider locale 注入）
const { tour: tourLabels } = useLocale()

export interface TourStep {
  /** 目标元素选择器 */
  target: string
  title: string
  desc?: string
}

const props = defineProps<{
  steps: TourStep[]
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'finish'): void
}>()

const idx = ref(0)
const box = ref({ left: 0, top: 0, width: 0, height: 0 })
const tipStyle = ref({ left: '12px', top: '12px' })

const step = computed(() => props.steps[idx.value])

/* 滚动锁 + 屏外目标：
   真实滚动容器与 BackTop getTarget 同源：window 可滚 →
   document.scrollingElement（移动端整页滚动），否则首个
   overflow-y ∈ {auto,scroll} 且内容溢出的 main/.pg-main（桌面布局）。
   不新建第四套宽度判断。
   锁 = overflow:hidden（桌面 .pg-main 锁下 MCP 实测：wheel 不动、编程
   scrollTop 仍有效（锁住后编程滚动仍有效）；document
   容器（移动端）overflow:hidden 引擎实测不阻 wheel/touch/键盘（MCP 实测
   html+body 双锁后 wheel 仍可滚）→ 叠 wheel/touchmove/翻页键事件拦截
   （passive:false preventDefault），程序 scrollIntoView 不经这些事件放行。
   关闭/完成/卸载恢复原 inline overflow 值。
   屏外目标：scrollIntoView({block:center})（reduced-motion 直跳），滚动结束
   （scrollend 或 400ms 兜底）后重测；遮罩 fixed 全屏层但高亮框/气泡位置
   每次重测视口坐标跟随文档位移（不钉死初始坐标），resize 亦重算。 */

function currentContainer(): HTMLElement {
  const de = document.documentElement
  const winScrollable =
    de.scrollHeight > de.clientHeight + 1 || document.body.scrollHeight > document.body.clientHeight + 1
  if (winScrollable) return de
  // 与 BackTop getTarget 同源候选（main / .pg-main）
  const cands = Array.from(document.querySelectorAll('main, .pg-main')) as HTMLElement[]
  for (const c of cands) {
    const cs = getComputedStyle(c)
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && c.scrollHeight > c.clientHeight + 1) return c
  }
  return de
}

let lockEl: HTMLElement | null = null
let savedOverflow = ''
let savedBodyOverflow = ''
/** 拦截用户滚动（wheel/touchmove），放行程序 scrollIntoView
    （锁住后编程滚动仍有效） */
function blockUserScroll(e: Event) {
  e.preventDefault()
}
function userScrollHandler(e: WheelEvent) {
  if (lockEl === document.documentElement) e.preventDefault()
}
/** 移动端 document 滚动盒 overflow:hidden 不阻键盘翻页（Space/Page/Home/End）→ 拦截 */
function blockPageKeys(e: KeyboardEvent) {
  if (lockEl !== document.documentElement) return
  if (e.key === ' ' || e.key === 'PageUp' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'End' || e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault()
}

function lockScroll() {
  if (lockEl) return
  lockEl = currentContainer()
  if (lockEl === document.documentElement) {
    // 移动端整页滚动：document 滚动盒 overflow:hidden 是浏览器特例，wheel/touch
    // 仍可驱动（MCP 实测 html+body overflow:hidden 后 wheel 不阻）→ 叠事件拦截
    // （wheel/touchmove passive:false preventDefault）；程序 scrollIntoView 不
    // 经 wheel/touch，放行。keyDown 翻页走 onKey 已有 Esc/Arrow 语义，补 Page*。
    savedOverflow = document.documentElement.style.overflow
    savedBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    window.addEventListener('wheel', userScrollHandler, { passive: false })
    document.addEventListener('touchmove', blockUserScroll, { passive: false })
    window.addEventListener('keydown', blockPageKeys, { passive: false })
  } else {
    // 桌面内部容器（.pg-main）：overflow:hidden 天然挡 wheel（MCP 实测
    // wheel 后 scrollTop 不动）、编程 scrollTop 仍有效——无需事件拦截。
    // 恢复用「锁前 computed 值」：overflow-y 可能由 CSS（非 inline）声明，
    // 只存 inline 会在原值为 CSS 声明时把「无声明」误恢复成 visible
    savedOverflow = getComputedStyle(lockEl).overflowY
    lockEl.style.overflowY = 'hidden'
  }
}

function unlockScroll() {
  if (!lockEl) return
  if (lockEl === document.documentElement) {
    document.documentElement.style.overflow = savedOverflow
    document.body.style.overflow = savedBodyOverflow
    window.removeEventListener('wheel', userScrollHandler)
    document.removeEventListener('touchmove', blockUserScroll)
    window.removeEventListener('keydown', blockPageKeys)
  } else {
    lockEl.style.overflowY = savedOverflow
  }
  lockEl = null
}

function updateTip() {
  const b = box.value
  const left = Math.min(Math.max(12, b.left), window.innerWidth - 300)
  const top = b.top + b.height + 14
  tipStyle.value = { left: left + 'px', top: Math.min(top, window.innerHeight - 160) + 'px' }
}

let settleTimer: ReturnType<typeof setTimeout> | undefined
let settleRaf = 0

async function locate() {
  await nextTick()
  const el = document.querySelector(step.value?.target ?? '') as HTMLElement | null
  if (!el) return
  const r = el.getBoundingClientRect()
  // 屏外目标（顶/底越出视口）→ 滚到居中后再重测（遮罩/气泡贴合滚动后 rect）
  if (r.top < 4 || r.bottom > window.innerHeight - 4) {
    scrollAndRelocate(el)
    return
  }
  box.value = { left: r.left, top: r.top, width: r.width, height: r.height }
  updateTip()
}

function scrollAndRelocate(el: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  clearTimeout(settleTimer)
  cancelAnimationFrame(settleRaf)
  settleRaf = 0
  // 滚动结束重测（scrollend / 400ms 兜底）——此引擎 scrollend 事件
  // 未实装（'scrollend' in window === false，MCP 实测），rAF 轮询代替：目标
  // 入视口且 rect 连续稳定 2 帧即重测；1.5s 兜底强制重测（终态坐标已贴合）
  if (reduce) {
    settleTimer = setTimeout(() => void locate(), 60)
    return
  }
  let lastTop = NaN
  let stable = 0
  const start = performance.now()
  const tick = () => {
    const r = el.getBoundingClientRect()
    const inView = r.top >= 4 && r.bottom <= window.innerHeight - 4
    stable = inView && Math.abs(r.top - lastTop) < 1 ? stable + 1 : 0
    lastTop = r.top
    if (stable >= 2 || performance.now() - start > 1500) {
      cancelAnimationFrame(settleRaf)
      settleRaf = 0
      void locate()
      return
    }
    settleRaf = requestAnimationFrame(tick)
  }
  settleRaf = requestAnimationFrame(tick)
}

watch(
  () => [props.modelValue, idx.value] as const,
  ([open]) => {
    if (open) {
      lockScroll()
      void locate()
    } else {
      unlockScroll()
      clearTimeout(settleTimer)
    }
  },
  { immediate: true },
)

function next() {
  if (idx.value < props.steps.length - 1) {
    idx.value++
  } else {
    close()
    emit('finish')
  }
}
function close() {
  idx.value = 0
  emit('update:modelValue', false)
}
function onKey(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
}

/** 窗口 resize 重算：屏外则重新居中滚动，否则直接重测贴合 */
function relocateOnResize() {
  if (!props.modelValue) return
  const el = document.querySelector(step.value?.target ?? '') as HTMLElement | null
  if (!el) return
  const r = el.getBoundingClientRect()
  if (r.top < 4 || r.bottom > window.innerHeight - 4) scrollAndRelocate(el)
  else {
    box.value = { left: r.left, top: r.top, width: r.width, height: r.height }
    updateTip()
  }
}

watch(
  () => props.modelValue,
  (o) => {
    if (o) {
      document.addEventListener('keydown', onKey)
      window.addEventListener('resize', relocateOnResize)
    } else {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', relocateOnResize)
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', relocateOnResize)
  unlockScroll()
  clearTimeout(settleTimer)
  cancelAnimationFrame(settleRaf)
})
</script>

<template>
  <Teleport to="body">
    <transition name="aero-tour">
      <div v-if="modelValue" class="aero-tour">
        <!-- 高亮框：fixed 全屏层内按当前目标视口坐标定位（滚动 settle 后重测贴合） -->
        <div
          class="aero-tour__hl"
          :style="{ left: box.left - 6 + 'px', top: box.top - 6 + 'px', width: box.width + 12 + 'px', height: box.height + 12 + 'px' }"
        />
        <!-- 步骤气泡 -->
        <div class="aero-tour__tip" :style="tipStyle">
          <b>{{ step?.title }}</b>
          <p v-if="step?.desc">{{ step.desc }}</p>
          <div class="aero-tour__foot">
            <span class="aero-tour__idx">{{ idx + 1 }} / {{ steps.length }}</span>
            <div class="aero-tour__btns">
              <button class="aero-tour__skip" type="button" @click="close">{{ tourLabels.skip }}</button>
              <button class="aero-tour__next" type="button" @click="next">
                {{ idx === steps.length - 1 ? tourLabels.done : tourLabels.next }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.aero-tour {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  /* z 走 modal 层（tip < pop < modal < toast）——原 calc(z-tip+20)=1020
 低于 pop 1200，规格要求遮罩与弹窗 modal 层 1300、不越 toast 1400 */
  z-index: var(--ui-z-modal);

  &__hl {
    position: absolute;
    border: 3px solid var(--ui-brand);
    border-radius: 14px;
    box-shadow: 0 0 0 4000px rgba(4, 12, 20, 0.6);
    transition: all 0.35s var(--ui-spring);
  }

  &__tip {
    position: absolute;
    width: 280px;
    background: var(--ui-card);
    border: 2px solid var(--ui-line-2);
    border-radius: 16px;
    padding: 16px 18px;
    box-shadow: var(--ui-shadow-md);
    animation: aero-tip-in 0.4s var(--ui-spring);
    b {
      font-size: 15px;
      color: var(--ui-ink);
    }
    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: var(--ui-ink-2);
      line-height: 1.65;
    }
  }
  &__foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
  }
  &__idx {
    font-family: var(--ui-font-mono);
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ui-brand-ink);
  }
  &__btns {
    display: flex;
    gap: 8px;
  }
  &__skip {
    border: 2px solid var(--ui-line-2);
    background: none;
    border-radius: 10px;
    padding: 5px 12px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ui-ink-2);
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
    }
  }
  &__next {
    border: 2px solid var(--ui-ink);
    background: var(--ui-brand);
    color: var(--ui-on-brand);
    border-radius: 10px;
    padding: 5px 14px;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: transform 0.18s var(--ui-spring), box-shadow 0.18s;
    &:hover {
      transform: translate(-1.5px, -1.5px);
      box-shadow: 2.5px 2.5px 0 var(--ui-ink);
    }
  }
}

.aero-tour-enter-active,
.aero-tour-leave-active {
  transition: opacity 0.3s;
}
.aero-tour-enter-from,
.aero-tour-leave-to {
  opacity: 0;
}
</style>

<style>
@keyframes aero-tip-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.94);
  }
}
</style>
