<script setup lang="ts">
import { AeroEmpty, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// hint/按钮原硬编码中文 → 走词包，随 ConfigProvider locale 翻转
const { empty } = useLocale()
</script>

<template>
  <div style="max-width: 400px">
    <AeroEmpty :hint="empty.search">
      <template #actions>
        <AeroButton type="outline" size="sm">{{ empty.reset }}</AeroButton>
      </template>
    </AeroEmpty>
  </div>
</template>
