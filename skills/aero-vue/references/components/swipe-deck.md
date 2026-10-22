# AeroSwipeDeck（swipe-deck）

分组：Mobile 移动端
中文名：拖动卡片组

具名导入：

```ts
import { AeroSwipeDeck } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `cards` | AeroSwipeCard[] | — |
| `loop` | boolean | true |
| `bare` | boolean | false |

## events
| event | payload |
|---|---|
| `deploy` | AeroSwipeCard |
| `rollback` | AeroSwipeCard |
| `emptied` | — |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AeroSwipeDeck, type AeroSwipeCard } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
// demo 文案走词包 demo 组
import { useLocale } from 'aero-vue'
const { demo } = useLocale()
const t = demo

const loop = ref(true)

// locale 相关文案经工厂函数在渲染期取 t.value（切语言不刷新即翻转；
// 已插入牌组的卡是用户交互数据，仅新增/重置时取当前语言）
function makeCards(): AeroSwipeCard[] {
  const d = t.value
  return [
    {
      name: 'web-portal', avatar: 'W', avatarTone: 2, status: 'ok', statusText: d['swipeDeck.healthy'],
      rows: [['region', d['swipeDeck.regionEast']], ['replicas', '12'], ['p95', '41ms']],
      foot: `${d['swipeDeck.build']} a4f29c1 · 2m ago`,
    },
    {
      name: 'api-gateway', avatar: 'A', avatarTone: 3, status: 'ok', statusText: d['swipeDeck.healthy'],
      rows: [['region', d['swipeDeck.regionNorth']], ['replicas', '18'], ['p95', '23ms']],
      foot: `${d['swipeDeck.build']} 91bc0e7 · 6h ago`,
    },
    {
      name: 'billing-svc', avatar: 'B', avatarTone: 5, status: 'warn', statusText: d['swipeDeck.degraded'],
      rows: [['region', d['swipeDeck.staging']], ['replicas', '4'], ['p95', '88ms']],
      foot: `${d['swipeDeck.build']} 3d20af1 · 1d ago`,
    },
  ]
}

function makePool(): AeroSwipeCard[] {
  const d = t.value
  return [
    { name: 'edge-cache', avatar: 'E', avatarTone: 4, status: 'ok', statusText: d['swipeDeck.healthy'], rows: [['hits', '94%'], ['ttl', '300s'], ['evict', 'lru']], foot: `${d['swipeDeck.build']} 77c21e0 · 5m ago` },
    { name: 'auth-proxy', avatar: 'AU', avatarTone: 6, status: 'err', statusText: d['swipeDeck.abnormal'], rows: [['region', d['swipeDeck.regionSouth']], ['replicas', '6'], ['p95', '412ms']], foot: `${d['swipeDeck.build']} f0a33d2 · 3d ago` },
    { name: 'metrics-hub', avatar: 'M', avatarTone: 1, status: 'ok', statusText: d['swipeDeck.healthy'], rows: [['series', '1.2M'], ['scrape', '30s'], ['ret', '30d']], foot: `${d['swipeDeck.build']} 2b9e5aa · 1h ago` },
  ]
}

const cards = ref<AeroSwipeCard[]>(makeCards())
const pool = computed(makePool)
let poolIdx = 0

// locale 切换时刷新初始三张卡的文案（用户追加的 -N 卡保留其交互数据，不动）
watch(t, () => {
  const fresh = makeCards()
  cards.value = cards.value.map((c, i) => (i < 3 && !c.name.includes('-') ? fresh[i] : c))
}, { deep: true })

function insertCard() {
  const c = pool.value[poolIdx % pool.value.length]
  poolIdx++
  cards.value.push({ ...c, name: c.name + (poolIdx > pool.value.length ? `-${poolIdx}` : '') })
}

function removeCard() {
  cards.value.splice(0, 1)
}

function onEmptied() {
  cards.value = pool.value.slice(0, 2).map((c) => ({ ...c, name: c.name + '-reset' }))
}
</script>
<template>
  <div style="width: 340px; display: flex; flex-direction: column; gap: 14px">
    <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap">
      <AeroSwitch v-model="loop">{{ t['swipeDeck.loopLabel'] }}</AeroSwitch>
      <span style="font-family: var(--ui-font-mono); font-size: 12px; color: var(--ui-ink-3)">{{ t['swipeDeck.deckCount'] }} {{ cards.length }} {{ t['swipeDeck.deckCountUnit'] }}</span>
    </div>
    <div style="min-height: 300px; display: flex">
      <AeroSwipeDeck
        v-if="cards.length"
        :cards="cards"
        :loop="loop"
        @deploy="(c) => console.log(t['swipeDeck.deploy'], c.name)"
        @rollback="(c) => console.log(t['swipeDeck.rollback'], c.name)"
        @emptied="onEmptied"
      />
      <div v-else style="margin: auto; color: var(--ui-ink-3); font-size: 13px">
        {{ t['swipeDeck.empty'] }}
      </div>
    </div>
    <div style="display: flex; gap: 10px">
      <AeroButton size="sm" type="primary" @click="insertCard">{{ t['swipeDeck.insertBtn'] }}</AeroButton>
      <AeroButton size="sm" type="outline" :disabled="!cards.length" @click="removeCard">{{ t['swipeDeck.removeBtn'] }}</AeroButton>
    </div>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/swipe-deck/demo/basic.vue

