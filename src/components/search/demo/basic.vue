<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeroSearch, useLocale, type AeroSearchOption } from 'aero-vue'
// 选项 label/placeholder/已选文案原硬编码中文 → 走词包 demo 组（description 英文分组保留）
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
// group = 分类组标题（走词包 optGroup* 键，与 description 功能描述解耦；组值映射 = 侧栏三组
// 表单 / 数据展示 / 导航，description 不再兼作组键，防「描述当标题 / 描述两次」）
const g = (k: 'Form' | 'DataDisplay' | 'Navigation') => t.value[`search.optGroup${k}`]
const options = computed<AeroSearchOption[]>(() => [
  { value: 'button', label: t.value['search.optButton'], description: t.value['search.optButtonDesc'], group: g('Form') },
  { value: 'form', label: t.value['search.optForm'], description: t.value['search.optFormDesc'], group: g('Form') },
  { value: 'table', label: t.value['search.optTable'], description: t.value['search.optTableDesc'], group: g('DataDisplay') },
  { value: 'tree', label: t.value['search.optTree'], description: t.value['search.optTreeDesc'], group: g('DataDisplay') },
  { value: 'avatar', label: t.value['search.optAvatar'], description: t.value['search.optAvatarDesc'], group: g('DataDisplay') },
  { value: 'image-viewer', label: t.value['search.optImageViewer'], description: t.value['search.optImageViewerDesc'], group: g('DataDisplay') },
  { value: 'carousel', label: t.value['search.optCarousel'], description: t.value['search.optCarouselDesc'], group: g('DataDisplay') },
  { value: 'affix', label: t.value['search.optAffix'], description: t.value['search.optAffixDesc'], group: g('Navigation') },
  { value: 'anchor', label: t.value['search.optAnchor'], description: t.value['search.optAnchorDesc'], group: g('Navigation') },
  { value: 'collapse', label: t.value['search.optCollapse'], description: t.value['search.optCollapseDesc'], group: g('Navigation') },
])

const picked = ref('')
// 只存选中的 option 键（locale 无关），展示文案渲染期经 options computed 求值——
// 交互写回串（`${o.label}（…）` 烤进 ref）已废除，切语言后已选条目同步翻转
const pickedText = computed(() => {
  const o = options.value.find((x) => String(x.value) === picked.value)
  return o ? `${o.label}（${o.description}）` : ''
})
function onPick(o: AeroSearchOption) {
  picked.value = String(o.value)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px; max-width: 360px">
    <AeroSearch :options="options" :placeholder="t['search.placeholder']" group-by="group" @select="onPick" />
    <p style="font-size: 12.5px; color: var(--ui-ink-3); margin: 0">{{ t['search.hint'] }}</p>
    <p style="font-size: 13px; color: var(--ui-ink-3); margin: 0">
      {{ t['search.selected'] }}{{ pickedText || t['search.none'] }}
    </p>
  </div>
</template>
