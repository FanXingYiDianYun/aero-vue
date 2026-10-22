<script setup lang="ts">
import { AeroPopconfirm, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroToast } from 'aero-vue'
// 确认框标题/按钮/toast 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 16px">
    <AeroPopconfirm :title="t['popconfirm.publishTitle']" @confirm="AeroToast.success(t['popconfirm.published'])">
      <AeroButton type="primary" size="sm">{{ t['popconfirm.publishBtn'] }}</AeroButton>
    </AeroPopconfirm>
    <AeroPopconfirm :title="t['popconfirm.deleteTitle']" danger :confirm-text="t['popconfirm.deleteBtn']" @confirm="AeroToast.error(t['popconfirm.deleted'])">
      <AeroButton type="danger" size="sm">{{ t['popconfirm.deleteBtn'] }}</AeroButton>
    </AeroPopconfirm>
  </div>
</template>
