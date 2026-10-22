<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { encodeQR, type ECLevel } from './qrcode-encoder'
import { useLocale } from '../../../locale'

// i18n：「二维码：<内容>」aria 走词包（ConfigProvider locale 注入）
const { qrcode: qrLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    value: string
    /** 输出尺寸 px（含留白） */
    size?: number
    /** 静区宽度（模块数） */
    margin?: number
    /** 前景色（接受 CSS 色值或 token 引用）；未传时取 var(--ui-ink) 计算值 */
    fg?: string
    bg?: string
    /** 纠错级别 L/M/Q/H（越高容错越强、容量越小） */
    level?: ECLevel
  }>(),
  { size: 160, margin: 2, fg: '', bg: 'transparent', level: 'M' },
)

/** 解析 var(--ui-ink) 计算值（主题切换时重解析 → 重绘 QR 前景色） */
const inkColor = ref('#000000')
function resolveInk() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--ui-ink').trim()
  if (raw) inkColor.value = raw
}

/** 实际前景色：props.fg 传入则覆盖，否则取 inkColor（var(--ui-ink) 计算值） */
const resolvedFg = computed(() => props.fg || inkColor.value)

onMounted(() => {
  resolveInk()
  // 主题切换（html[data-theme] 变化）时重解析 → QR 重绘
  const mo = new MutationObserver(resolveInk)
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  onBeforeUnmount(() => mo.disconnect())
})

/** 主题预设变化时也重解析（data-preset 变化） */
watch(
  () => document.documentElement.getAttribute('data-preset'),
  resolveInk,
)

const matrix = computed(() => encodeQR(props.value, props.level))
const n = computed(() => matrix.value.length)
const mod = computed(() => Math.floor(props.size / (n.value + props.margin * 2)))
const svgSize = computed(() => mod.value * (n.value + props.margin * 2))
</script>

<template>
  <svg
    class="aero-qr"
    :width="svgSize"
    :height="svgSize"
    :viewBox="`0 0 ${svgSize} ${svgSize}`"
    role="img"
    :aria-label="qrLabels.aria(value)"
    shape-rendering="crispEdges"
  >
    <rect width="100%" height="100%" :fill="bg" />
    <template v-for="(row, r) in matrix" :key="r">
      <template v-for="(on, c) in row" :key="c">
        <rect
          v-if="on"
          :x="(c + margin) * mod"
          :y="(r + margin) * mod"
          :width="mod"
          :height="mod"
          :fill="resolvedFg"
        />
      </template>
    </template>
  </svg>
</template>

<style scoped lang="scss">
.aero-qr {
  box-sizing: border-box;
  border-radius: var(--ui-radius-s);
  border: 2px solid var(--ui-line);
  background: var(--ui-card);
}
</style>
