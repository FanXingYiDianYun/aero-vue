<script setup lang="ts">
import { ref } from 'vue'
import { AeroAnnounce, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroSwitch } from 'aero-vue'
// 横幅标题/正文/开关/按钮/注释文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// 受控显隐：v-model:open 外部接管，关闭后仍可重新打开（可逆）
const open = ref(true)
// 跑马灯开关：false 禁用（文字溢出直接截断）；true 自适应（仅装不下才滚动）
const marquee = ref(true)
// 长文案切换：演示跑马灯在文字溢出时的效果
const longText = ref(false)
</script>

<template>
  <div class="ann-demo">
    <div class="ann-demo__bar">
      <AeroAnnounce
        v-model:open="open"
        :marquee="marquee"
        @close="open = false"
        action-href="https://github.com/FanXingYiDianYun/aero-vue"
      >
        <template #title>{{ t['announce.title'] }}</template>
        <template v-if="longText">
          {{ t['announce.longBody'] }}
        </template>
        <template v-else>
          {{ t['announce.shortBody'] }}
        </template>
        <template #action>{{ t['announce.action'] }}</template>
      </AeroAnnounce>
    </div>
    <div class="ann-demo__ctrls">
      <AeroSwitch v-model="marquee">{{ t['announce.marqueeLabel'] }}</AeroSwitch>
      <AeroSwitch v-model="longText">{{ t['announce.longTextLabel'] }}</AeroSwitch>
      <AeroButton size="sm" type="outline" @click="open = !open">{{ open ? t['announce.closeBtn'] : t['announce.reopenBtn'] }}</AeroButton>
    </div>
    <p class="ann-demo__note">{{ t['announce.note'] }}</p>
    <div style="display: flex; flex-direction: column; gap: 14px">
      <h4 class="ann-demo__h">{{ t['announce.bodyTitle'] }}</h4>
      <div class="ann-demo__body">
        <p>{{ t['announce.bodyText'] }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ann-demo { display: flex; flex-direction: column; gap: 14px; width: 100%; }
.ann-demo__bar { border: 2px solid var(--ui-line); border-radius: 14px; overflow: hidden; background: var(--ui-card); }
.ann-demo__ctrls { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.ann-demo__note { font-size: 12.5px; color: var(--ui-ink-3); margin: 0; }
.ann-demo__h { margin: 0; font-size: 14px; }
.ann-demo__body {
  border: 2px dashed var(--ui-line-2);
  border-radius: 14px;
  padding: 16px;
  background: var(--ui-bg);
}
.ann-demo__body p { margin: 0 0 12px; font-size: 13.5px; color: var(--ui-ink-2); }
</style>
