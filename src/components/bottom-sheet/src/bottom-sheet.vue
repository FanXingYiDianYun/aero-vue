<script setup lang="ts">
/**
 * BottomSheet 底部抽屉 —— 复刻 demo .sheet-zone/.sheet
 * 默认收起（仅露 58px 把手），可拖拽/点击把手切换；spring 回弹。
 */
import { computed, onMounted, ref, useSlots, type VNode } from 'vue'
import { usePointerDrag } from '../../../composables'
import { useLocale } from '../../../locale'

// i18n：背景占位文案默认走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { bottomSheet: bottomSheetLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 抽屉标题 */
    title?: string
    /** 展开区行数据 [label, value] */
    rows?: Array<[string, string]>
    /** 背景占位文案（缺省取词包 bottomSheet.bgTitle/bgHint） */
    bgTitle?: string
    bgHint?: string
    /** 初始展开 */
    open?: boolean
  }>(),
  { title: '', rows: () => [], bgTitle: undefined, bgHint: undefined, open: false },
)

const bgTitleText = computed(() => props.bgTitle ?? bottomSheetLabels.value.bgTitle)
const bgHintText = computed(() => props.bgHint ?? bottomSheetLabels.value.bgHint)

const emit = defineEmits<{ (e: 'update:open', v: boolean): void; (e: 'change', v: boolean): void }>()

const zone = ref<HTMLElement>()
const sheet = ref<HTMLElement>()
const isOpen = ref(props.open)
const slots = useSlots()

const collapsed = () => (zone.value?.clientHeight ?? 0) - 58
const setY = (v: number) => { if (sheet.value) sheet.value.style.transform = `translateY(${v}px)` }

let y0 = 0
let startY = 0

function matrixY(): number {
  if (!sheet.value) return collapsed()
  const tr = getComputedStyle(sheet.value).transform
  return tr && tr !== 'none' ? new DOMMatrixReadOnly(tr).f : collapsed()
}

function onDragMove(e: PointerEvent) {
  let v = startY + (e.clientY - y0)
  v = Math.max(0, Math.min(collapsed(), v))
  setY(v)
}

function onDragEnd() {
  if (sheet.value) sheet.value.style.transition = ''
  const v = matrixY()
  if (v < collapsed() * 0.5) toggle(true)
  else toggle(false)
}

// 拖拽骨架收敛到 usePointerDrag（按下-捕获-移动-释放）
const { startDrag } = usePointerDrag(onDragMove, { onEnd: onDragEnd })

function onDown(e: PointerEvent) {
  y0 = e.clientY
  startY = matrixY()
  if (sheet.value) sheet.value.style.transition = 'none'
  startDrag(sheet.value, e)
}

function toggle(open: boolean) {
  isOpen.value = open
  if (sheet.value) sheet.value.classList.toggle('open', open)
  setY(open ? 0 : collapsed())
  emit('update:open', open)
  emit('change', open)
}

function onHandleClick() {
  toggle(!isOpen.value)
}

onMounted(() => {
  isOpen.value = props.open
  sheet.value?.classList.toggle('open', props.open)
  setY(props.open ? 0 : collapsed())
})
</script>

<template>
  <div ref="zone" class="aero-bsheet-zone">
    <div class="aero-bsheet-bg">
      <b>{{ bgTitleText }}</b>
      <p>{{ bgHintText }}</p>
      <slot v-if="slots.bg" name="bg" />
    </div>
    <div
      ref="sheet"
      class="aero-bsheet"
      :class="{ open: isOpen }"
      @pointerdown="onDown"
    >
      <div class="aero-bsheet__bar" @click="onHandleClick">
        <i />
      </div>
      <div class="aero-bsheet__t">{{ title }}</div>
      <div class="aero-bsheet__body">
        <slot>
          <div v-for="(r, i) in rows" :key="i" class="aero-bsheet__row">
            <span>{{ r[0] }}</span><b>{{ r[1] }}</b>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-bsheet-zone {
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin: 8px 16px 10px;
  border: 2px dashed var(--ui-line-2);
  border-radius: 18px;
  background: var(--ui-bg-soft);
  overflow: hidden;
  min-height: 210px;
  display: flex;
  flex-direction: column;
}

.aero-bsheet-bg {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  align-items: flex-start;
  justify-content: center;
  height: 100%;

  b { font-size: 14px; }
  p { font-size: 11.5px; color: var(--ui-ink-3); }
}

.aero-bsheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ui-card);
  border: 2px solid var(--ui-line);
  border-bottom: 0;
  border-radius: 22px 22px 0 0;
  box-shadow: 0 -8px 24px rgba(2, 30, 45, 0.12);
  transform: translateY(calc(100% - 58px));
  transition: transform 0.45s var(--ui-spring);
  touch-action: none;
  user-select: none;

  &.open { transform: translateY(0); }

  &__bar {
    padding: 10px 0 4px;
    display: flex;
    justify-content: center;
    cursor: grab;

    i {
      width: 44px;
      height: 5px;
      border-radius: 99px;
      background: var(--ui-line-2);
      transition: 0.2s;
    }
  }

  &:hover &__bar i { background: var(--ui-brand); }

  &__t {
    font-size: 13.5px;
    font-weight: 900;
    padding: 2px 18px 8px;
  }

  &__body {
    padding: 0 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12.5px;
    padding: 9px 12px;
    background: var(--ui-bg-soft);
    border-radius: 11px;

    b {
      font-family: var(--ui-font-mono);
      color: var(--ui-brand-ink);
    }
  }
}
</style>
