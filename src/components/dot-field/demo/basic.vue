<script setup lang="ts">
import { ref } from 'vue'
import { AeroDotField, useLocale } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
import { AeroTypography } from 'aero-vue'
import { AeroSegmented } from 'aero-vue'
// 面板文案/开关 label 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const flow = ref(true)
const shape = ref<'dot' | 'x' | 'diamond' | 'ring'>('diamond')
const shapes = ['dot', 'x', 'diamond', 'ring'] as const
const shapeOptions = shapes.map((s) => ({ label: s, value: s }))
</script>

<template>
  <!-- 容器脱离舞台 flex 流（绝对定位），让 DotField 的 inset:0 以它为基准铺满 -->
  <div class="df-stage">
    <AeroDotField :shape="shape" :flow="flow" :density="24" />
    <!-- 控制条移到左下角，别挡住极光扫过的整片区域 -->
    <div class="df-panel">
      <AeroTypography level="body">{{ t['dotField.title'] }}</AeroTypography>
      <div class="df-panel__row">
        <AeroSwitch v-model="flow">{{ t['dotField.flow'] }}</AeroSwitch>
        <AeroSegmented v-model="shape" :options="shapeOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.df-stage {
  position: relative;
  width: 100%;
  /* 桌面端限宽居中——原 width:100% 在 1440 视口下撑满 .pg-stage 内容盒
 （888px），canvas 右缘贴边呈「右对齐」观感。max-width + margin-inline:auto
 在桌面（内容盒 >560px）限宽居中；390px 移动视口下 560px 上限不生效，
 仍 100% 占满可用宽度（零变化） */
  max-width: 560px;
  margin-inline: auto;
  /* aspect-ratio 使容器高度随宽度等比缩放（canvas 按父宽重绘）；
 min-height 兜底窄屏不至于过扁（固定宽度 + overflow:hidden 在 390px 视口下会裁掉点阵右侧区域） */
  aspect-ratio: 4 / 3;
  min-height: 260px;
  overflow: hidden;
  border: 2px dashed var(--ui-line-2);
  border-radius: 20px;
  display: grid;
  place-items: center;
}
.df-panel {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: color-mix(in srgb, var(--ui-bg) 82%, transparent);
  backdrop-filter: blur(6px);
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid var(--ui-line);
}
.df-panel__row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
/* 窄屏（≤520px，覆盖 390 视口下 312px 舞台）控制条不得溢出点阵区。
 AeroSegmented 为固定固有宽（不随容器收缩），max-width 只能裁不能缩 →
 用 transform:scale 等比缩小整块面板（视觉完整、几何全部落回舞台内）。
 实测 ≤400px：row 自然宽 ~327px × 0.8 ≈ 262px < 280px 可用宽度 */
@media (max-width: 400px) {
  .df-panel {
    transform: scale(0.8);
    transform-origin: left bottom;
  }
}
</style>
