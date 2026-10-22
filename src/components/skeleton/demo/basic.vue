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

<style scoped>
.sk-demo { width: 320px; display: flex; flex-direction: column; gap: 14px; }
.sk-demo__card {
  border: 2px solid var(--ui-line);
  border-radius: 16px;
  padding: 20px;
  background: var(--ui-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sk-demo__head { display: flex; gap: 12px; align-items: center; }
.sk-demo__head-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.sk-demo__avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--ui-brand); color: var(--ui-on-brand);
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-family: var(--ui-font-en);
}
.sk-demo__t { display: block; font-size: 15px; }
.sk-demo__s { font-size: 12.5px; color: var(--ui-ink-3); font-family: var(--ui-font-mono); }
.sk-demo__title { margin: 4px 0 0; font-size: 17px; }
.sk-demo__p { margin: 0; font-size: 13.5px; color: var(--ui-ink-2); line-height: 1.7; }
.sk-demo__foot { display: flex; gap: 10px; margin-top: 4px; }
</style>
