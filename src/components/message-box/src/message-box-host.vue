<script setup lang="ts">
import AeroDialog from '../../dialog/src/dialog.vue'
import AeroButton from '../../button/src/button.vue'
import { useLocale } from '../../../locale'
import type { MessageBoxOptions } from './message-box'

// i18n：未传 title 时回落文案走词包（ConfigProvider locale 注入）
const { messageBox: messageBoxLabels } = useLocale()

const props = defineProps<{
  /** 对话框是否打开 */
  open: boolean
  /** 确认框内容配置（标题/正文/按钮文案/是否危险操作） */
  opts: MessageBoxOptions
}>()

const emit = defineEmits<{
  /** 打开状态变化时触发 */
  (e: 'update:open', v: boolean): void
  /** 点击确认按钮时触发（随后自动关闭） */
  (e: 'confirm'): void
  /** 点击取消或关闭时触发（随后自动关闭） */
  (e: 'cancel'): void
}>()

function confirm() {
  emit('confirm')
  emit('update:open', false)
}
function cancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <AeroDialog
    :model-value="props.open"
    :title="props.opts.title ?? messageBoxLabels.title"
    :width="'420px'"
    @update:model-value="emit('update:open', $event)"
    @close="cancel"
  >
    <p style="margin: 0">{{ props.opts.message }}</p>
    <template #footer>
      <AeroButton type="ghost" size="sm" @click="cancel">{{ props.opts.cancelText }}</AeroButton>
      <AeroButton :type="props.opts.danger ? 'danger' : 'primary'" size="sm" @click="confirm">
        {{ props.opts.confirmText }}
      </AeroButton>
    </template>
  </AeroDialog>
</template>
