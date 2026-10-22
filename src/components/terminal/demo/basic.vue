<script setup lang="ts">
import { AeroTerminal } from 'aero-vue'
import type { TermLine } from 'aero-vue'

const lines: TermLine[] = [
  { text: '$ pnpm add aero-vue', type: 'cmd' },
  { text: '+ aero-vue 0.1.0', type: 'ok' },
  { text: '$ pnpm build', type: 'cmd' },
  { text: 'building for production...', type: 'live' },
  { text: 'done in 1.2s', type: 'ok' },
]
</script>

<template>
  <AeroTerminal :lines="lines" title="ztk@aero" style="max-width: 480px" />
</template>
