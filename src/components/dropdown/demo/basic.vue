<script setup lang="ts">
import { AeroDropdown, useLocale } from 'aero-vue'
import { AeroButton } from 'aero-vue'
import { AeroToast } from 'aero-vue'
import type { AeroDropdownItem } from 'aero-vue'
import { computed } from 'vue'
// 菜单项/按钮/toast 文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

// computed 化——切语言不刷新即翻转（顶层一次性求值 t.value[] 已废除）
const items = computed<AeroDropdownItem[]>(() => [
  { key: 'copy', label: t.value['dropdown.copy'], icon: 'copy' },
  { key: 'edit', label: t.value['dropdown.edit'], icon: 'edit', desc: t.value['dropdown.editDesc'] },
  { key: 'share', label: t.value['dropdown.share'], icon: 'send', divided: true },
  { key: 'del', label: t.value['dropdown.delete'], icon: 'trash', danger: true, divided: true },
])
</script>

<template>
  <AeroDropdown :items="items" @select="(it) => AeroToast.info(`${t['dropdown.selected']}${it.label}`)">
    <AeroButton type="outline">{{ t['dropdown.moreBtn'] }}</AeroButton>
  </AeroDropdown>
</template>
