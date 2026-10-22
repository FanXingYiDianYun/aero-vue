# AeroSkeleton（skeleton）

分组：DataDisplay 数据展示
中文名：骨架屏

具名导入：

```ts
import { AeroSkeleton } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `variant` | 'text'|'circle'|'rect' | 'text' |
| `height` | number|string | 12 |
| `width` | number|string | — |
| `loading` | boolean | true |
| `animated` | boolean | true |


## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroSkeleton, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 样张文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const loading = ref(true)
</script>
<template>
  <div class="sk-demo">
    <!-- article skeleton: circle avatar + title lines + three char placeholders (last 60%) -->
    <div v-if="loading" class="sk-demo__card">
      <div class="sk-demo__head">
        <AeroSkeleton variant="circle" :height="44" :width="44" />
        <div class="sk-demo__head-lines">
          <AeroSkeleton :height="15" width="45%" />
          <AeroSkeleton :height="11" width="30%" />
        </div>
      </div>
      <AeroSkeleton :height="17" width="70%" style="margin-top: 4px" />
      <AeroSkeleton :height="12" />
      <AeroSkeleton :height="12" />
      <AeroSkeleton :height="12" width="60%" />
      <div class="sk-demo__foot">
        <AeroSkeleton variant="rect" :height="34" width="92px" />
        <AeroSkeleton variant="rect" :height="34" width="92px" />
      </div>
    </div>

    <!-- real content -->
    <div v-else class="sk-demo__card">
      <div class="sk-demo__head">
        <span class="sk-demo__avatar">ZK</span>
        <div>
          <b class="sk-demo__t">{{ t['skeleton.name'] }}</b>
          <span class="sk-demo__s">{{ t['skeleton.time'] }}</span>
        </div>
      </div>
      <h4 class="sk-demo__title">{{ t['skeleton.title'] }}</h4>
      <p class="sk-demo__p">{{ t['skeleton.p1'] }}</p>
      <p class="sk-demo__p">{{ t['skeleton.p2'] }}</p>
      <p class="sk-demo__p">{{ t['skeleton.p3'] }}</p>
      <div class="sk-demo__foot">
        <AeroButton size="sm" type="primary">{{ t['skeleton.viewUpdate'] }}</AeroButton>
        <AeroButton size="sm" type="outline">{{ t['skeleton.deployDoc'] }}</AeroButton>
      </div>
    </div>

    <AeroButton size="sm" @click="loading = !loading">{{ t['skeleton.toggle'] }}</AeroButton>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/skeleton/demo/basic.vue

