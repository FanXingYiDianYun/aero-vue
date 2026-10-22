<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AeroCarouselSlide } from './carousel.types'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：圆点「第 N 页」aria 走词包（ConfigProvider locale 注入）
const { carousel: carouselLabels } = useLocale()

defineSlots<{
  /** 自定义幻灯渲染（slotProps: slide + index）；提供后覆盖默认数据驱动渲染 */
  default?: (props: { slide: AeroCarouselSlide; index: number }) => any
}>()

const props = withDefaults(
  defineProps<{
    slides: AeroCarouselSlide[]
    /** 自动播放间隔 ms（0 关闭） */
    interval?: number
  }>(),
  { interval: 4200 },
)

const emit = defineEmits<{
  /** 索引变化（自动播放/拖拽/手动切换均触发）；参数 (prev, next) 为 0 基索引 */
  (e: 'change', prev: number, next: number): void
}>()

const idx = ref(0)
const drag = ref(false)
const dragX = ref(0)
const startX = ref(0)
const trackRef = ref<HTMLElement>()

const count = computed(() => props.slides.length)
const transform = computed(() => {
  const base = `translateX(${-idx.value * 100}%)`
  if (drag.value && dragX.value) {
    return `${base} translateX(${dragX.value}px)`
  }
  return base
})

function setIdx(v: number) {
  const prev = idx.value
  idx.value = ((v % count.value) + count.value) % count.value
  if (prev !== idx.value) emit('change', prev, idx.value)
}
function next() {
  setIdx(idx.value + 1)
}
function prevSlide() {
  setIdx(idx.value - 1)
}
function go(i: number) {
  setIdx(i)
}

/** 当前索引（只读，供模板/外部同步） */
defineExpose({
  /** 切换到指定幻灯（0 基）；同 setActiveItem，EP 语义 */
  setActiveItem(i: number) {
    setIdx(i)
  },
  next,
  prev: prevSlide,
})

// 自动播放（页面隐藏时 IntersectionObserver 暂停 —— GPU 隔离方案）
let timer: ReturnType<typeof setInterval> | null = null
let visible = true

function play() {
  if (timer || !props.interval || !visible) return
  timer = setInterval(next, props.interval)
}
function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

let io: IntersectionObserver | null = null
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    visible ? play() : stop()
  })
  if (trackRef.value) io.observe(trackRef.value.parentElement!)
  play()
})
onBeforeUnmount(() => {
  stop()
  io?.disconnect()
})

// 拖拽（demo m-car 同源；骨架收敛到 usePointerDrag）
const { startDrag } = usePointerDrag(
  (e) => {
    dragX.value = e.clientX - startX.value
    // 位移 >5px 才判拖拽（视觉 grab 态此前在 pointerdown 即挂，单击会闪跳 is-drag）
    if (!drag.value && Math.abs(dragX.value) > 5) drag.value = true
  },
  {
    onEnd: () => {
      const dx = dragX.value
      drag.value = false
      dragX.value = 0
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prevSlide()
      }
      play()
    },
  },
)
function onDown(e: PointerEvent) {
  startX.value = e.clientX
  dragX.value = 0
  stop()
  startDrag(e.currentTarget as HTMLElement, e)
}
</script>

<template>
  <div class="aero-carousel">
    <div class="aero-carousel__vp" @pointerdown="onDown">
      <div ref="trackRef" class="aero-carousel__track" :class="{ 'is-drag': drag }" :style="{ transform }">
        <!-- 默认：数据驱动渲染 -->
        <template v-if="$slots.default">
          <div v-for="(s, i) in slides" :key="i" class="aero-carousel__slide is-plain" :class="`is-${s.tone ?? 'a'}`">
            <slot :slide="s" :index="i" />
          </div>
        </template>
        <template v-else>
          <div v-for="(s, i) in slides" :key="i" class="aero-carousel__slide" :class="`is-${s.tone ?? 'a'}`">
            <i class="aero-carousel__ring" />
            <b class="aero-carousel__en">{{ s.en }}</b>
            <span v-if="s.zh" class="aero-carousel__zh">{{ s.zh }}</span>
            <i v-if="s.chip" class="aero-carousel__chip">{{ s.chip }}</i>
          </div>
        </template>
      </div>
    </div>
    <div class="aero-carousel__dots">
      <button
        v-for="(s, i) in slides"
        :key="i"
        class="aero-carousel__dot"
        :class="{ 'is-on': i === idx }"
        type="button"
        :aria-label="carouselLabels.pageAria(i + 1)"
        @click="go(i)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-carousel {
  box-sizing: border-box;
  max-width: 100%;

  &__vp {
    overflow: hidden;
    border-radius: 19px;
    border: 2px solid var(--ui-line);
    touch-action: pan-y;
    cursor: grab;
    user-select: none;
  }
  &__track {
    display: flex;
    transition: transform 0.45s var(--ui-ease);
    &.is-drag {
      transition: none;
      cursor: grabbing;
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

    &.is-a {
      background: var(--ui-brand);
      color: var(--ui-on-brand);
    }
    &.is-b {
      background: var(--ui-ink);
      color: var(--ui-brand);
    }
    &.is-c {
      background: var(--ui-bg-tint);
      color: var(--ui-brand-ink);
    }
    /* slot 自定义内容：不做文案对位，交给注入方布局 */
    &.is-plain {
      justify-content: stretch;
      padding: 0;
      background: var(--ui-card);

      /* tone 仍可覆盖底色（is-a/b/c 优先级低于 is-plain 的重置，故置于其后声明） */
      &.is-a { background: var(--ui-brand); }
      &.is-b { background: var(--ui-ink); }
      &.is-c { background: var(--ui-bg-tint); }

      > :deep(*) {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
  }
  &__ring {
    box-sizing: border-box;
    position: absolute;
    top: -34px;
    right: -44px;
    width: 150px;
    height: 150px;
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
    font-style: normal;
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
    &.is-on {
      width: 20px;
      background: var(--ui-brand);
    }
  }
}
</style>
