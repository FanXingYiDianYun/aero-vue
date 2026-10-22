<script setup lang="ts">
/**
 * ThemeProvider demo —— 预设切换（作用域化，全局零 mutation）
 * - 预设按钮只作用于 demo 预览框（AeroThemeProvider scoped 模式，
 * CSS 变量只写容器自身，不动 :root、不写 localStorage）；
 * - 「应用到全局」= 用户显式操作才写全局 useTheme 状态（离开页面后保持，
 * 由 useTheme 持久化语义决定，与库原有全局开关行为一致）。
 */
import { ref, computed } from 'vue'
import { AeroThemeProvider } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroBadge } from 'aero-vue'
import { useTheme, useLocale } from 'aero-vue'
// demo 文案走词包 demo 组
const { demo } = useLocale()
const t = demo

const { state, setPreset } = useTheme()
const inner = ref<'aero' | 'violet' | 'mint' | 'sunset' | 'rose'>('aero')

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const presets = computed(() => ([
  { key: 'aero', label: t.value['themeProvider.aeroBlue'], color: '#0EBFFF' },
  { key: 'violet', label: 'Violet', color: '#7C6CFF' },
  { key: 'mint', label: 'Mint', color: '#10C999' },
  { key: 'sunset', label: 'Sunset', color: '#FF8A3D' },
  { key: 'rose', label: 'Rose', color: '#FF5C8A' },
] as Array<{ key: 'aero' | 'violet' | 'mint' | 'sunset' | 'rose'; label: string; color: string }>))

function applyGlobal() {
  setPreset(inner.value)
}
</script>

<template>
  <div class="tp-demo">
    <div class="tp-demo__hint">
      <AeroBadge type="soft" dot>{{ t["themeProvider.scopedBadge"] }}</AeroBadge>
      <span>{{ t["themeProvider.scopedHint"] }}</span>
    </div>

    <!-- 预设色板（只影响下方预览框，scoped 零全局副作用） -->
    <div class="tp-demo__presets">
      <button
        v-for="p in presets"
        :key="p.key"
        class="tp-demo__preset"
        :class="{ 'is-on': inner === p.key }"
        type="button"
        @click="inner = p.key"
      >
        <span class="tp-demo__dot" :style="{ background: p.color }" />
        {{ p.label }}
      </button>
    </div>

    <!-- 作用域内的组件随预设换色（CSS 变量只写容器，:root 不动） -->
    <AeroThemeProvider :preset="inner" scoped>
      <div class="tp-demo__scope">
        <AeroButton type="primary">{{ t["themeProvider.brandChanged"] }}</AeroButton>
        <AeroBadge type="solid">{{ inner }}</AeroBadge>
      </div>
    </AeroThemeProvider>

    <!-- 显式操作才写全局（用户主动点击） -->
    <div class="tp-demo__global">
      <span>{{ t["themeProvider.globalLabel"] }}：{{ state.preset }}</span>
      <AeroButton type="outline" size="sm" @click="applyGlobal">{{ t["themeProvider.applyBtn"] }}</AeroButton>
    </div>
  </div>
</template>

<style scoped>
.tp-demo { display: flex; flex-direction: column; gap: 16px; }
.tp-demo__hint { display: flex; gap: 10px; align-items: center; font-size: 13px; color: var(--ui-ink-2); flex-wrap: wrap; }
.tp-demo__presets { display: flex; gap: 8px; flex-wrap: wrap; }
.tp-demo__preset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid var(--ui-line);
  border-radius: 99px;
  background: var(--ui-card);
  color: var(--ui-ink-2);
  font-size: 13px;
  font-weight: 700;
  padding: 7px 14px;
  cursor: pointer;
  transition: .2s var(--ui-spring);
}
.tp-demo__preset:hover { border-color: var(--ui-brand); color: var(--ui-brand-ink); transform: translateY(-1px); }
.tp-demo__preset.is-on { border-color: var(--ui-ink); box-shadow: 2px 2px 0 var(--ui-ink); transform: rotate(-1deg); }
.tp-demo__dot { width: 15px; height: 15px; border-radius: 50%; border: 2px solid var(--ui-card); box-shadow: 0 0 0 2px var(--ui-line-2); }
.tp-demo__scope {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 18px;
  border: 2px dashed var(--ui-line-2);
  border-radius: 16px;
}
.tp-demo__global {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12.5px;
  color: var(--ui-ink-3);
  flex-wrap: wrap;
}
</style>
