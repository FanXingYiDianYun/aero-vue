<script setup lang="ts">
import { computed, ref } from 'vue'
import AeroPopover from '../../popover/src/popover.vue'
import AeroButton from '../../button/src/button.vue'
import { useLocale } from '../../../locale'

// i18n：标题/按钮文案缺省走词包（ConfigProvider locale 注入；显式传入 prop 优先）
const { popconfirm: popLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    title?: string
    confirmText?: string
    cancelText?: string
    /** 危险确认 */
    danger?: boolean
  }>(),
  { title: undefined, confirmText: undefined, cancelText: undefined, danger: false },
)

const titleText = computed(() => props.title ?? popLabels.value.title)
const confirmTextValue = computed(() => props.confirmText ?? popLabels.value.confirm)
const cancelTextValue = computed(() => props.cancelText ?? popLabels.value.cancel)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const open = ref(false)

function confirm() {
  open.value = false
  emit('confirm')
}
function cancel() {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <AeroPopover
    v-model:open="open"
    trigger="click"
    :title="danger ? popLabels.dangerTitle : popLabels.title"
    :width="240"
  >
    <slot />
    <template #content>
      <p style="margin: 0 0 12px; color: var(--ui-ink-2); font-size: 13.5px">{{ titleText }}</p>
      <div style="display: flex; justify-content: flex-end; gap: 8px">
        <AeroButton type="ghost" size="sm" @click="cancel">{{ cancelTextValue }}</AeroButton>
        <AeroButton :type="danger ? 'danger' : 'primary'" size="sm" @click="confirm">{{ confirmTextValue }}</AeroButton>
      </div>
    </template>
  </AeroPopover>
</template>
