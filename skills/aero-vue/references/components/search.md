# AeroSearch（search）

分组：Form 表单
中文名：搜索框

具名导入：

```ts
import { AeroSearch } from 'aero-vue'
```

## props
| prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `options` | AeroSearchOption[] | — | 候选数据源 |
| `placeholder` | string | — | 占位（缺省取词包） |
| `limit` | number | 12 | 召回上限（默认 12） |
| `emptyText` | string | — | 空结果提示（缺省取词包） |
| `disabled` | boolean | false | 禁用 |
| `groupBy` | 'description' | (keyof AeroSearchOption & string) | — | 分组键（缺省=不分组平铺；按该字段出组标题，不参与匹配） |
| `showOptionDesc` | boolean | false | 结果副行开关（默认 false；开=携 description 项渲染独立小字淡色副行命中位 mark，关=仅主行组件名，描述仍参与匹配召回） |

## events
| event | payload |
|---|---|
| `select` | AeroSearchOption |
| `search` | (q, hits) |
| `clear` | — |

## 最小示例（源自 demo/basic.vue）
```vue
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
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/search/demo/basic.vue

