<script setup lang="ts">
import { computed, inject } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 是否禁用该项（默认：false；组内禁用时组级优先） */
    disabled?: boolean
    /** 该选项对应的值（用于组内匹配或独立 v-model） */
    value: string | number
  }>(),
  { disabled: false },
)

const checked = defineModel<boolean | string | number>({ default: false })

const emit = defineEmits<{
  /** 独立使用（无组）时选中变化触发，携带该选项的 value */
  (e: 'change', v: string | number | boolean): void
}>()

interface GroupCtx {
  value: { value: string | number | undefined }
  disabled: { value: boolean }
  pick: (v: string | number) => void
}
const group = inject<GroupCtx | null>('AeroRadioGroup', null)

const inGroup = computed(() => !!group)
const isChecked = computed(() => (inGroup.value ? group!.value.value === props.value : !!checked.value))
const isDisabled = computed(() => props.disabled || group?.disabled.value)

function pick() {
  if (isDisabled.value || isChecked.value) return
  if (inGroup.value) {
    group!.pick(props.value)
  } else {
    checked.value = props.value
    emit('change', props.value)
  }
}
</script>

<template>
  <label
    class="aero-radio"
    :class="{ 'is-disabled': isDisabled, 'is-checked': isChecked }"
    @click="pick"
  >
    <input
      type="radio"
      class="aero-radio__input"
      :checked="isChecked"
      :disabled="isDisabled"
      tabindex="-1"
      @click.stop.prevent
    />
    <span class="aero-radio__box"><i class="aero-radio__dot" /></span>
    <span class="aero-radio__label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
.aero-radio {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-size: 14px;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__input {
    position: absolute;
    opacity: 0;
    /* 完全交由 label 的 click 处理选中逻辑；
       原生 radio 自身响应点击时会先于 v-model 置 checked，
       造成同组其它项取消选中 → "无选中" 态。pointer-events:none 杜绝该路径 */
    pointer-events: none;
  }
  &__box {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--ui-line-2);
    background: var(--ui-card);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    flex: none;
  }
  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--ui-brand);
    transform: scale(0);
    transition: 0.25s var(--ui-spring);
  }
  /* 选中态由 class 驱动（与原生 input:checked 解耦，避免时序不同步） */
  &.is-checked {
    .aero-radio__box {
      border-color: var(--ui-brand);
      .aero-radio__dot {
        transform: scale(1);
      }
    }
  }
  &__label {
    color: var(--ui-ink);
  }
}
</style>
