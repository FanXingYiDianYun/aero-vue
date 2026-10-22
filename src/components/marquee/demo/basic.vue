<script setup lang="ts">
import { AeroMarquee, useLocale } from 'aero-vue'
// / 免责行走词包 demo 组（marquee.disclaimer，zh/en 同源）
const { demo } = useLocale()
const t = demo
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:26px;width:100%;max-width:100%;overflow-x:hidden">
    <AeroMarquee
      caption="BUILT WITH OPEN SOURCE"
      :items="[
        { icon: 'box', text: 'Docker' },
        { icon: 'package', text: 'Kubernetes' },
        { icon: 'compass', text: 'Envoy' },
        { icon: 'activity', text: 'Prometheus' },
        { icon: 'database', text: 'Redis' },
        { icon: 'layers', text: 'Kafka' },
        { icon: 'cloud', text: 'Terraform' },
        { icon: 'git-branch', text: 'GitLab' },
      ]"
    />
    <AeroMarquee
      variant="type"
      :items="[
        { text: 'OPEN SOURCE' },
        { text: 'CLOUD NATIVE', solid: true },
        { text: 'GIT PUSH' },
        { text: 'SCALE ANYWHERE', solid: true },
        { text: 'EDGE FIRST' },
        { text: 'ZERO CONFIG', solid: true },
      ]"
    />
    <!-- 免责行（marquee 区块下方）：词包 marquee.disclaimer，12px / ink-3 / margin 8px 0 0 -->
    <p class="marquee-demo__disclaimer">{{ t['marquee.disclaimer'] }}</p>
  </div>
</template>

<style scoped>
.marquee-demo__disclaimer {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--ui-ink-3);
}
</style>

