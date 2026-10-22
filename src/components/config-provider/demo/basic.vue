<script setup lang="ts">
import { AeroConfigProvider, AeroBadge, useLocale } from 'aero-vue'
// demo 空壳修复——前后对比可见：默认（无包裹）vs provider 注入（dark + violet）
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div class="cp-demo">
    <div class="cp-demo__panel">
      <b class="cp-demo__label">{{ t['configProvider.default'] }}</b>
      <AeroBadge type="soft" dot>{{ t['configProvider.badge'] }}</AeroBadge>
    </div>
    <AeroConfigProvider theme="dark" preset="violet">
      <div class="cp-demo__panel">
        <b class="cp-demo__label">{{ t['configProvider.injected'] }}</b>
        <AeroBadge type="soft" dot>{{ t['configProvider.badge'] }}</AeroBadge>
      </div>
    </AeroConfigProvider>
  </div>
</template>

<style scoped>
.cp-demo {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  max-width: 100%;
}
.cp-demo__panel {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  background: var(--ui-card);
  border: 2px solid var(--ui-line);
  border-radius: 16px;
}
.cp-demo__label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ui-ink-2);
  letter-spacing: 0.02em;
}
</style>
