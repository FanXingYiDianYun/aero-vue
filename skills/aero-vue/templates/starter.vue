<!--
  Aero UI 最小可挂载示例（裸宿主可跑：无 reset、无全局样式、UA content-box）
  用法：宿主安装 aero-vue 后，在 main 入口 import 本文件并 mount 即渲染。
-->
<script setup lang="ts">
import { ref } from 'vue'
import {
  AeroButton,
  AeroInput,
  AeroConfigProvider,
  useTheme,
} from 'aero-vue'

const user = ref('')
const lang = ref<'zh-cn' | 'en-us'>('zh-cn')
const theme = useTheme() // 明暗切换落 html[data-theme] + localStorage
</script>

<template>
  <AeroConfigProvider :locale="lang">
    <div style="max-width: 480px">
      <AeroInput v-model="user" placeholder="输入姓名" clearable />
      <p style="margin-top: 12px">
        <AeroButton type="primary" @click="user = 'Aero'">改名字</AeroButton>
        <AeroButton type="ghost" @click="theme.toggleTheme()">切明暗</AeroButton>
      </p>
    </div>
  </AeroConfigProvider>
</template>
