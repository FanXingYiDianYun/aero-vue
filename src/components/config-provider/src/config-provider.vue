<script setup lang="ts">
import { provide, toRef } from 'vue'
import { AEROS_LOCALE_KEY } from '../../../locale'

const props = withDefaults(
  defineProps<{
    /** 组件库主题（注入 html data-theme） */
    theme?: 'light' | 'dark'
    /** 品牌预设 */
    preset?: 'aero' | 'violet' | 'mint' | 'sunset' | 'rose'
    /** 命名空间 class（默认 aero） */
    namespace?: string
    /** 组件文案语言（i18n，默认 zh-cn）；传入后 provide 到子组件 useLocale() 跟随 */
    locale?: 'zh-cn' | 'en-us'
  }>(),
  { locale: 'zh-cn' },
)

provide('AeroConfig', {
  theme: toRef(props, 'theme'),
  preset: toRef(props, 'preset'),
  namespace: toRef(props, 'namespace'),
})

// i18n：locale prop 注入（provide 到子组件 useLocale() 跟随）
provide(AEROS_LOCALE_KEY, { locale: toRef(props, 'locale') })
</script>

<template>
  <div class="aero-config" :class="[namespace, { 'aero-dark': theme === 'dark' }]" :data-preset="preset && preset !== 'aero' ? preset : undefined">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.aero-config {
  box-sizing: border-box;
  display: contents;
}
</style>
