<script setup lang="ts">
import { ref } from 'vue'
import { AeroCodeBlock } from 'aero-vue'

const code = `import { AeroButton, AeroUI } from 'aero-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(AeroUI)
`

// 折叠显隐（v-model:open 受控）；标题栏右侧展开/收起钮
const open = ref(true)
</script>

<template>
  <AeroCodeBlock
    v-model:open="open"
    :code="code"
    lang="TS"
    title="main.ts"
    collapsible
    style="max-width: 480px"
  />
</template>
