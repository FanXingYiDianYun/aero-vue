<script setup lang="ts">
/**
 * ActionButtons 移动端操作钮 —— 复刻 demo .p-actions .p-act
 * 左右两个圆形操作按钮（拒绝/同意），hover 填充
 */
import { computed } from 'vue'
import { useLocale } from '../../../locale'

// 提示文案默认值走词包（actionButtons 组，ConfigProvider locale 注入）
const { actionButtons } = useLocale()

const props = withDefaults(
  defineProps<{
    /** 左按钮提示 */
    rejectTip?: string
    /** 右按钮提示 */
    acceptTip?: string
  }>(),
  { rejectTip: undefined, acceptTip: undefined },
)

const rejectLabel = computed(() => props.rejectTip ?? actionButtons.value.reject)
const acceptLabel = computed(() => props.acceptTip ?? actionButtons.value.accept)

const emit = defineEmits<{
  (e: 'reject'): void
  (e: 'accept'): void
}>()
</script>

<template>
  <div class="aero-actbtns">
    <button class="aero-actbtn aero-actbtn--no" type="button" :aria-label="rejectLabel" @click="emit('reject')">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
      </svg>
    </button>
    <button class="aero-actbtn aero-actbtn--yes" type="button" :aria-label="acceptLabel" @click="emit('accept')">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.aero-actbtns {
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 4px 0 10px;
}

.aero-actbtn {
  box-sizing: border-box;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2.5px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-card);
  transition: 0.25s var(--ui-spring);
  cursor: pointer;

  &:hover {
    transform: translateY(-3px) scale(1.08);
  }

  &--no {
    border-color: color-mix(in srgb, var(--ui-err) 55%, transparent);
    color: var(--ui-err);

    &:hover {
      background: var(--ui-err);
      color: var(--ui-on-ink);
      border-color: var(--ui-err);
    }
  }

  &--yes {
    border-color: color-mix(in srgb, var(--ui-ok) 55%, transparent);
    color: var(--ui-ok);

    &:hover {
      background: var(--ui-ok);
      color: var(--ui-on-ink);
      border-color: var(--ui-ok);
    }
  }
}
</style>
