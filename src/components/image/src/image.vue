<script setup lang="ts">
import { ref } from 'vue'
import AeroImageViewer from '../../image-viewer/src/image-viewer.vue'
import { useLocale } from '../../../locale'

// i18n：加载失败回落文案走词包（ConfigProvider locale 注入）
const { image: imageLabels } = useLocale()

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: number | string
    height?: number | string
    /** 圆角档 */
    radius?: 'sm' | 'md' | 'lg' | 'pill'
    /** 点击放大（内置 AeroImageViewer，缩放/旋转/拖拽） */
    preview?: boolean
    fit?: 'cover' | 'contain' | 'fill'
  }>(),
  { radius: 'md', preview: false, fit: 'cover' },
)

const failed = ref(false)
const loaded = ref(false)
const viewerOpen = ref(false)

const emit = defineEmits<{ (e: 'preview', src: string): void }>()

function onClick() {
  if (props.preview) {
    viewerOpen.value = true
    emit('preview', props.src)
  }
}
</script>

<template>
  <figure
    class="aero-image"
    :class="[`is-${radius}`, { 'is-preview': preview, 'is-failed': failed }]"
    :style="{ width: width !== undefined ? (typeof width === 'number' ? width + 'px' : width) : '100%', height: height !== undefined ? (typeof height === 'number' ? height + 'px' : height) : undefined }"
    @click="onClick"
  >
    <img
      v-if="!failed"
      class="aero-image__img"
      :src="src"
      :alt="alt ?? ''"
      :style="{ objectFit: fit }"
      loading="lazy"
      @error="failed = true"
      @load="loaded = true"
    />
    <div v-else class="aero-image__fallback">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
      <b>{{ imageLabels.lost }}</b>
      <span>{{ imageLabels.retry }}</span>
    </div>
    <span v-if="preview && loaded" class="aero-image__zoom" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" />
      </svg>
    </span>
    <!-- 内置查看器：滚轮缩放/拖拽/旋转/双击复位 -->
    <AeroImageViewer v-model="viewerOpen" :url-list="[src]" />
  </figure>
</template>

<style scoped lang="scss">
.aero-image {
  box-sizing: border-box;
  position: relative;
  margin: 0;
  overflow: hidden;
  background: var(--ui-bg-soft);
  border: 2px solid var(--ui-line);
  display: inline-flex;

  &.is-sm { border-radius: var(--ui-radius-sm); }
  &.is-md { border-radius: var(--ui-radius-md); }
  &.is-lg { border-radius: var(--ui-radius-lg); }
  &.is-pill { border-radius: 99px; }

  /* 加载失败态：即使未显式给 height，也维持 160px 最小占位，避免卡片塌缩「瘦弱」 */
  &.is-failed {
    min-height: 160px;
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    transition: transform 0.4s var(--ui-spring);
  }
  &.is-preview {
    cursor: zoom-in;
    &:hover .aero-image__img {
      transform: scale(1.06) rotate(0.4deg);
    }
    &:hover .aero-image__zoom {
      opacity: 1;
    }
  }
  &__zoom {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: var(--ui-ink);
    color: var(--ui-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }
  &__fallback {
    width: 100%;
    height: 100%;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--ui-ink-3);
    font-size: 12.5px;
    font-weight: 600;
    border: 0;
    border-radius: inherit;
    background:
      repeating-linear-gradient(-45deg, var(--ui-bg-soft) 0 14px, transparent 14px 28px),
      var(--ui-bg-soft);

    svg {
      padding: 10px;
      border-radius: 14px;
      background: var(--ui-bg-tint);
      border: 2px solid var(--ui-line-2);
      color: var(--ui-brand-ink);
    }

    b {
      color: var(--ui-ink-2);
      font-size: 13px;
    }
  }
}
</style>
