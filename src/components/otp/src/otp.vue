<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useLocale } from '../../../locale'

// i18n：输入格「第 N 位」aria 走词包（ConfigProvider locale 注入）
const { otp: otpLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    length?: number
    disabled?: boolean
    /** 数字模式 */
    numeric?: boolean
  }>(),
  { length: 6, disabled: false, numeric: true },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'complete', v: string): void
}>()

const cells = ref<HTMLInputElement[]>()

function chars() {
  return (props.modelValue ?? '').slice(0, props.length).split('')
}

async function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  let v = el.value
  if (props.numeric) v = v.replace(/\D/g, '')
  el.value = v.slice(-1)
  const arr = chars()
  arr[i] = el.value
  const joined = arr.join('').padEnd(props.length, ' ').trimEnd()
  const val = arr.join('')
  emit('update:modelValue', val)
  if (el.value && i < props.length - 1) {
    await nextTick()
    cells.value?.[i + 1]?.focus()
  }
  if (val.length === props.length && !val.includes(' ') && val) emit('complete', val)
}

async function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !chars()[i] && i > 0) {
    e.preventDefault()
    const arr = chars()
    arr.splice(i - 1, 1)
    emit('update:modelValue', arr.join(''))
    await nextTick()
    cells.value?.[i - 1]?.focus()
  }
  if (e.key === 'ArrowLeft' && i > 0) cells.value?.[i - 1]?.focus()
  if (e.key === 'ArrowRight' && i < props.length - 1) cells.value?.[i + 1]?.focus()
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = (e.clipboardData?.getData('text') ?? '').replace(props.numeric ? /\D/g : /\s/g, '')
  const sliced = text.slice(0, props.length)
  emit('update:modelValue', sliced)
  if (sliced.length === props.length) emit('complete', sliced)
}
</script>

<template>
  <div class="aero-otp" :class="{ 'is-disabled': disabled }" @paste="onPaste">
    <input
      v-for="i in length"
      :key="i"
      :ref="(el) => { if (el) (cells ??= [])[i - 1] = el as HTMLInputElement }"
      class="aero-otp__cell"
      :value="chars()[i - 1] ?? ''"
      :inputmode="numeric ? 'numeric' : 'text'"
      :disabled="disabled"
      maxlength="1"
      :aria-label="otpLabels.slotAria(i)"
      autocomplete="one-time-code"
      @input="onInput(i - 1, $event)"
      @keydown="onKeydown(i - 1, $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.aero-otp {
  box-sizing: border-box;
  /* 宽度自适应父容器：6 格 × (44px 上限 + gap) 在 390px 竖屏下不再溢出
 DEMO 框（任意宽度自适应收窄） */
  display: inline-flex;
  gap: 10px;
  max-width: 100%;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__cell {
    /* flex:1 1 0 + min-width:0 → 等分可用宽度；max-width:44px 封顶防桌面拉得过宽；
       aspect-ratio 1:1.2 让高度随宽度收缩（原固定 54px 高 + 46px 宽在窄屏总宽 306px+gap 溢出） */
    flex: 1 1 0;
    min-width: 0;
    max-width: 44px;
    aspect-ratio: 46 / 54;
    height: auto;
    border: 2px solid var(--ui-line-2);
    border-radius: 13px;
    background: var(--ui-card);
    text-align: center;
    font-size: 20px;
    font-weight: 800;
    font-family: var(--ui-font-mono);
    color: var(--ui-ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s var(--ui-spring);

    &:focus {
      border-color: var(--ui-brand);
      box-shadow: var(--ui-focus-ring);
      transform: translateY(-2px) rotate(-1deg);
    }
    &:not(:placeholder-shown) {
      border-color: var(--ui-brand);
    }
  }
}
</style>
