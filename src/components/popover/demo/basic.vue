<script setup lang="ts">
import { AeroPopover, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 浮层标题/按钮/内容原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 18px; padding: 30px 0">
    <AeroPopover :title="t['popover.hoverTitle']" trigger="hover">
      <AeroButton type="outline" size="sm">{{ t['popover.hoverBtn'] }}</AeroButton>
      <template #content>{{ t['popover.hoverBody'] }}</template>
    </AeroPopover>
    <AeroPopover :title="t['popover.clickTitle']" trigger="click" placement="right">
      <AeroButton type="ghost" size="sm">{{ t['popover.clickBtn'] }}</AeroButton>
      <template #content>{{ t['popover.clickBody'] }}</template>
    </AeroPopover>
  </div>
</template>
