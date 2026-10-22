<script setup lang="ts">
import { AeroResult, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 结果页文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; width: 100%">
    <AeroResult status="success" :title="t['result.paySuccess']" :desc="t['result.paySuccessDesc']" style="flex: 1; min-width: 260px">
      <AeroButton type="primary" size="sm">{{ t['result.viewOrder'] }}</AeroButton>
    </AeroResult>
    <AeroResult status="error" :title="t['result.payFail']" :desc="t['result.payFailDesc']" style="flex: 1; min-width: 260px">
      <AeroButton type="outline" size="sm">{{ t['result.retry'] }}</AeroButton>
    </AeroResult>
  </div>
</template>
