<script setup lang="ts">
/**
 * MobileCarousel 移动端 Banner 轮播 —— 复刻 demo .m-car
 * 拖拽切页（rubber-band 边界）+ 自动播放 + 进度条 + 圆点导航
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：圆点「第 N 页」aria 走词包（ConfigProvider locale 注入，复用 carousel 组）
const { carousel: carouselLabels } = useLocale()

export interface AeroMobileCarouselSlide {
  /** 大标题（En 字轴） */
  en: string
  /** 中文副题 */
  zh: string
  /** 底部胶囊文案 */
  chip?: string
  /** 主题: a=brand / b=ink / c=tint */
  tone?: 'a' | 'b' | 'c'
  /** 装饰圆环（相对 slide 定位的 [宽,高,top,right,bottom,left]px，至少给 w/h） */
  rings?: Array<{ w: number; h: number; top?: string; right?: string; bottom?: string; left?: string }>
}

const props = withDefaults(
  defineProps<{
    slides: AeroMobileCarouselSlide[]
    /** 自动播放间隔 ms，0 关闭 */
    interval?: number
  }>(),
  { interval: 4200 },
)

const emit = defineEmits<{ (e: 'change', index: number): void }>()

const root = ref<HTMLElement>()
const track = ref<HTMLElement>()
const prog = ref<HTMLElement>()
const idx = ref(0)
const cur = ref(0)
const drag = ref(false)

let i = 0
let auto: ReturnType<typeof setInterval> | null = null
let x0 = 0
let dx = 0
const N = () => props.slides.length

const vpw = () => (root.value?.querySelector('.aero-mcar__vp') as HTMLElement)?.clientWidth ?? 0

function setX(px: number) {
  if (track.value) track.value.style.transform = `translateX(${px}px)`
}

function restart() {
  if (auto) clearInterval(auto)
  if (!props.interval) return
  if (prog.value) {
    prog.value.getAnimations().forEach((a) => a.cancel())
    prog.value.animate([{ width: '0%' }, { width: '100%' }], { duration: props.interval, iterations: 1 })
  }
  auto = setInterval(() => go(i + 1), props.interval)
}

function go(n: number, anim = true) {
  const total = N()
  if (!total) return
  i = ((n % total) + total) % total
  if (!anim) track.value?.classList.add('notrX')
  setX(-i * vpw())
  if (!anim) requestAnimationFrame(() => requestAnimationFrame(() => track.value?.classList.remove('notrX')))
  cur.value = i
  idx.value = i
  emit('change', i)
  restart()
}

function pauseAuto() {
  if (auto) clearInterval(auto)
  auto = null
  prog.value?.getAnimations().forEach((a) => a.pause())
}

function onDragMove(e: PointerEvent) {
  dx = e.clientX - x0
  // 位移 >5px 才判拖拽（与 carousel 同模式自查；单击时 drag 全程 false，不误挂 grab 态）
  if (!drag.value && Math.abs(dx) > 5) track.value?.classList.add('drag')
  let t = -i * vpw() + dx
  if (t > 0) t *= 0.32 // 左边界 rubber band
  const min = -((N() - 1) * vpw())
  if (t < min) t = min + (t - min) * 0.32
  setX(t)
}

function onDragEnd() {
  drag.value = false
  track.value?.classList.remove('drag')
  if (dx < -45) go(i + 1)
  else if (dx > 45) go(i - 1)
  else go(i)
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）
const { startDrag } = usePointerDrag(onDragMove, { onEnd: onDragEnd })

function onDown(e: PointerEvent) {
  // 不在 pointerdown 即挂 grab 态——位移阈值门控见 onDragMove
  drag.value = false
  x0 = e.clientX
  dx = 0
  startDrag(track.value, e)
  pauseAuto()
}

function onEnter() {
  pauseAuto()
}

function onLeave() {
  if (drag.value) return
  restart()
}

function onResize() {
  if (!track.value) return
  track.value.classList.add('notrX')
  setX(-i * vpw())
  requestAnimationFrame(() => track.value?.classList.remove('notrX'))
}

onMounted(() => go(0, false))
onBeforeUnmount(() => { if (auto) clearInterval(auto) })
</script>

<template>
  <div ref="root" class="aero-mcar" @pointerenter="onEnter" @pointerleave="onLeave">
    <div class="aero-mcar__vp">
      <div
        ref="track"
        class="aero-mcar__track"
        :class="{ drag }"
        @pointerdown="onDown"
      >
        <div v-for="(s, n) in slides" :key="n" class="aero-mcar__slide" :class="`aero-mcar__slide--${s.tone ?? 'a'}`">
          <span
            v-for="(r, ri) in s.rings ?? []"
            :key="ri"
            class="aero-mcar__ring"
            :style="{ width: r.w + 'px', height: r.h + 'px', top: r.top, right: r.right, bottom: r.bottom, left: r.left }"
          />
          <span class="aero-mcar__en">{{ s.en }}</span>
          <span class="aero-mcar__zh">{{ s.zh }}</span>
          <span v-if="s.chip" class="aero-mcar__chip">{{ s.chip }}</span>
        </div>
      </div>
    </div>
    <div class="aero-mcar__dots">
      <button
        v-for="(_, n) in slides"
        :key="n"
        class="aero-mcar__dot"
        :class="{ on: n === idx }"
        :aria-label="carouselLabels.pageAria(n + 1)"
        @click="go(n)"
      />
    </div>
    <div v-if="interval" class="aero-mcar__prog"><i ref="prog" /></div>
  </div>
</template>

<style scoped lang="scss">
.aero-mcar {
  box-sizing: border-box;
  margin: 8px 16px 0;
  position: relative;

  /* 作为 flex item（.pg-stage display:flex / phone 内嵌）min-width:0 允许收缩到
 「宿主宽 − 32px margin」，避免 16px 固定 margin 把元素撑出窄宿主右缘；
 组件宽度完全由宿主容器决定（无固定宽度下限） */
  min-width: 0;

  &__vp {
    overflow: hidden;
    border-radius: 19px;
    border: 2px solid var(--ui-line);
  }

  &__track {
    display: flex;
    transition: transform 0.45s var(--ui-ease);
    cursor: grab;
    touch-action: pan-y;

    &.drag {
      transition: none;
      cursor: grabbing;
    }

    &.notrX {
      transition: none !important;
    }
  }

  &__slide {
    box-sizing: border-box;
    flex: 0 0 100%;
    aspect-ratio: 16 / 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 2px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    user-select: none;

    &--a { background: var(--ui-brand); color: var(--ui-on-brand); }
    &--b { background: var(--ui-ink); color: var(--ui-brand); }
    &--c { background: var(--ui-bg-tint); color: var(--ui-brand-ink); }
  }

  &__ring {
    position: absolute;
    border-radius: 50%;
    border: 2.5px solid currentColor;
    opacity: 0.22;
  }

  &__en {
    font-family: var(--ui-font-en);
    font-weight: 700;
    font-size: 24px;
    line-height: 1.1;
    position: relative;
    z-index: 1;
  }

  &__zh {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.85;
    position: relative;
    z-index: 1;
    margin-bottom: 6px;
  }

  &__chip {
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    border: 2px solid currentColor;
    border-radius: 99px;
    padding: 3px 11px;
    position: relative;
    z-index: 1;
    margin-top: 4px;
  }

  &__dots {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-top: 11px;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 99px;
    background: var(--ui-line-2);
    border: 0;
    padding: 0;
    transition: 0.3s;
    cursor: pointer;

    &.on {
      width: 20px;
      background: var(--ui-brand);
    }
  }

  &__prog {
    height: 3px;
    border-radius: 99px;
    background: var(--ui-line);
    margin: 10px 2px 0;
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--ui-brand);
    }
  }
}
</style>
