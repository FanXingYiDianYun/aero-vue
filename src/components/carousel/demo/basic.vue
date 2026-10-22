<script setup lang="ts">
import { AeroCarousel, AeroButton, useLocale } from 'aero-vue'
import { ref, computed } from 'vue'
// 幻灯样张与 slot 文案原硬编码中文 → 走词包 demo 组（en/chip 为英文数据，保留）
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const slides = computed(() => [
  { en: 'Aero UI', zh: t.value['carousel.zh1'], chip: 'v0.1.0', tone: 'a' as const },
  { en: 'Dark Mode', zh: t.value['carousel.zh2'], chip: 'THEME', tone: 'b' as const },
  { en: '75+ CMP', zh: t.value['carousel.zh3'], chip: 'SCALE', tone: 'c' as const },
])

/* slot 注入演示：任意 Vue/HTML 内容 */
const counter = ref(0)
const customSlides = [
  { en: 'slot-1', tone: 'b' as const },
  { en: 'slot-2', tone: 'c' as const },
]
</script>

<template>
  <div style="display: flex; gap: 20px; flex-wrap: wrap">
    <!-- 数据驱动（默认） -->
    <AeroCarousel :slides="slides" style="max-width: 300px" />

    <!-- slot 注入任意内容 -->
    <AeroCarousel :slides="customSlides" :interval="0" style="max-width: 300px">
      <template #default="{ slide, index }">
        <div class="custom-slide">
          <h4>#{{ index + 1 }} {{ slide.en }} {{ t['carousel.customSlide'] }}</h4>
          <p>{{ t['carousel.anyContent'] }}</p>
          <AeroButton type="outline" size="sm" @click="counter++">{{ t['carousel.clickPlus'] }} {{ counter }} {{ t['carousel.clickPlusEnd'] }}</AeroButton>
        </div>
      </template>
    </AeroCarousel>
  </div>
</template>

<style scoped>
.custom-slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  padding: 24px 28px;
}
.custom-slide h4 { margin: 0; font-size: 20px; }
.custom-slide p { margin: 0; font-size: 13px; opacity: .8; }
</style>
