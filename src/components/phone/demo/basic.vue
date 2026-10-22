<script setup lang="ts">
import { AeroPhone, useLocale } from 'aero-vue'
import { AeroBadge } from 'aero-vue'
import { AeroMobileCarousel, type AeroMobileCarouselSlide } from 'aero-vue'
import { AeroMobileStatCard } from 'aero-vue'
import { AeroMobileTabBar } from 'aero-vue'
import { ref, computed } from 'vue'
// 手机样机文案（标题/统计/徽章/标签栏）原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const act = ref(0)

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const slides = computed<AeroMobileCarouselSlide[]>(() => [
  { en: 'v3.0 STRATOS', zh: t.value['mobileCarousel.zh1'], chip: t.value['mobileCarousel.chip1'], tone: 'a', rings: [{ w: 150, h: 150, top: '-46px', right: '-36px' }, { w: 70, h: 70, bottom: '-18px', left: '-14px' }] },
  { en: 'EDGE · 312', zh: t.value['mobileCarousel.zh2'], chip: t.value['mobileCarousel.chip2'], tone: 'b', rings: [{ w: 120, h: 120, top: '-30px', left: '-30px' }] },
  { en: '11.6s', zh: t.value['mobileCarousel.zh3'], chip: t.value['mobileCarousel.chip3'], tone: 'c', rings: [{ w: 100, h: 100, bottom: '-24px', right: '-20px' }] },
])

const line = [
  { x: 2, y: 20 }, { x: 18, y: 14 }, { x: 32, y: 17 }, { x: 48, y: 8 },
  { x: 64, y: 12 }, { x: 80, y: 5 }, { x: 98, y: 9 },
]
const bars = [
  { x: 10, y: 12, w: 8, h: 12 }, { x: 30, y: 8, w: 8, h: 16, main: true },
  { x: 50, y: 14, w: 8, h: 10 }, { x: 70, y: 5, w: 8, h: 19, main: true }, { x: 88, y: 10, w: 8, h: 14 },
]
</script>

<template>
  <!-- 外层 flex wrapper 为 .pg-stage 的 flex item——min-width:auto=壳定宽 330px，
 窄宿主（390 视口卡内容宽 312）下 min-width:auto 阻止 max-width:100% 收缩，
 壳(330)+12px shadow 越出 demo 卡右缘约 10px。加 min-width:0 允许该 flex item
 收缩到「宿主宽 − 左右留白」，壳 max-width:100% 才生效。桌面宿主充足时取 330 定宽，
 像素不变；不动 L1 的 .aero-mcar min-width:0，不用 overflow:hidden 掩盖。 -->
  <div style="display: flex; gap: 46px; justify-content: center; flex-wrap: wrap; min-width: 0">
    <AeroPhone :title="t['phone.title']" :subtitle="t['phone.subtitle']">
      <AeroMobileCarousel :slides="slides" />
      <div class="p-stats">
        <AeroMobileStatCard label="QPS" value="12,480" />
        <AeroMobileStatCard :label="t['phone.p95']" value="41ms" />
        <AeroMobileStatCard :label="t['phone.online']" value="34" chart="line" :points="line" />
        <AeroMobileStatCard :label="t['phone.deploy']" value="218" chart="bar" :bars="bars" />
      </div>
      <div style="padding: 0 4px 4px; display: flex; align-items: center; gap: 8px">
        <AeroBadge type="ok" :dot="true">{{ t['phone.allOk'] }}</AeroBadge>
      </div>
      <AeroMobileTabBar v-model="act" :items="[
        { icon: 'home', label: t['phone.home'] },
        { icon: 'rocket', label: t['phone.deployTab'] },
        { icon: 'activity', label: t['phone.monitorTab'] },
        { icon: 'user', label: t['phone.myTab'] },
      ]" />
    </AeroPhone>
  </div>
</template>

<style scoped>
.p-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 14px 16px 6px;
}
</style>
