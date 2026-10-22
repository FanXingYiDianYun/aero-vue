<script setup lang="ts">
import { ref } from 'vue'
import { AeroLoading, useLocale } from 'aero-vue'
import { AeroCard } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// tip/卡片/按钮文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const loading = ref(true)
</script>

<template>
  <div style="max-width: 380px">
    <AeroLoading :loading="loading" :tip="t['loading.tip']">
      <AeroCard>
        <h4>{{ t['loading.wrapped'] }}</h4>
        <p>{{ t['loading.wrappedBody'] }}</p>
      </AeroCard>
    </AeroLoading>
    <AeroButton size="sm" type="outline" style="margin-top: 12px" @click="loading = !loading">
      {{ t['loading.toggle'] }}
    </AeroButton>
  </div>
</template>
