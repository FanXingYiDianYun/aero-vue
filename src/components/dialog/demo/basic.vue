<script setup lang="ts">
import { ref } from 'vue'
import { AeroDialog, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 按钮/标题/正文原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const open = ref(false)
</script>

<template>
  <div>
    <AeroButton type="primary" @click="open = true">{{ t['dialog.openBtn'] }}</AeroButton>
    <AeroDialog v-model="open" :title="t['dialog.title']">
      <p>{{ t['dialog.body'] }}</p>
      <template #footer>
        <AeroButton type="ghost" size="sm" @click="open = false">{{ t['dialog.cancel'] }}</AeroButton>
        <AeroButton type="danger" size="sm" @click="open = false">{{ t['dialog.delete'] }}</AeroButton>
      </template>
    </AeroDialog>
  </div>
</template>
