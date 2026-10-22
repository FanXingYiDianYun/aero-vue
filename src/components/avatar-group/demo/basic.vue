<script setup lang="ts">
import { AeroAvatarGroup } from 'aero-vue'
import { AeroAvatar } from 'aero-vue'
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center">
    <AeroAvatarGroup :total="8" :max="5">
      <AeroAvatar :tone="1">AY</AeroAvatar>
      <AeroAvatar :tone="2">ZK</AeroAvatar>
      <AeroAvatar :tone="3">A3</AeroAvatar>
      <AeroAvatar :tone="4">Q4</AeroAvatar>
      <AeroAvatar :tone="5">W5</AeroAvatar>
    </AeroAvatarGroup>
  </div>
</template>
