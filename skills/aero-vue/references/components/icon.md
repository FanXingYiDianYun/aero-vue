# AeroIcon（icon）

分组：Basic 基础
中文名：图标

具名导入：

```ts
import { AeroIcon } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `name` | AeroIconName | — |
| `size` | number|string | 16 |
| `stroke` | number | 2 |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { AeroIcon, useLocale } from 'aero-vue'
import { iconPaths } from 'aero-vue'
import { AeroInput } from 'aero-vue'
// placeholder/标题/已复制 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const names = Object.keys(iconPaths)
const q = ref('')
const copied = ref('')
const filtered = computed(() => names.filter((n) => n.includes(q.value.trim().toLowerCase())))

async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(`<AeroIcon name="${name}" />`)
    copied.value = name
    setTimeout(() => { if (copied.value === name) copied.value = '' }, 1200)
  } catch { /* clipboard 不可用时静默 */ }
}
</script>
<template>
  <div class="icon-demo">
    <div class="icon-demo__bar">
      <AeroInput
        v-model="q"
        :placeholder="t['icon.searchPlaceholder']"
        :width="240"
      />
      <span class="icon-demo__count">{{ filtered.length }} / {{ names.length }}</span>
    </div>
    <div class="icon-demo__grid">
      <button
        v-for="n in filtered"
        :key="n"
        class="icon-demo__cell"
        type="button"
        :title="`${t['icon.clickCopy']}&lt;AeroIcon name=&quot;${n}&quot; /&gt;`"
        @click="copy(n)"
      >
        <AeroIcon :name="n as any" :size="20" />
        <span class="icon-demo__name">{{ n }}</span>
        <span v-if="copied === n" class="icon-demo__copied">{{ t['icon.copied'] }}</span>
      </button>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/icon/demo/basic.vue

