<script setup lang="ts">
import { computed, ref } from 'vue'
import { AeroIcon, useLocale } from 'aero-vue'
import { iconPaths } from 'aero-vue'
import { AeroInput } from 'aero-vue'
// placeholder/标题/已复制 原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const names = Object.keys(iconPaths)
const q = ref('')
const copied = ref('')
const filtered = computed(() => names.filter((n) => n.includes(q.value.trim().toLowerCase())))

async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(`<AeroIcon name="${name}" />`)
    copied.value = name
    setTimeout(() => { if (copied.value === name) copied.value = '' }, 1200)
  } catch { /* clipboard 不可用时静默 */ }
}
</script>

<template>
  <div class="icon-demo">
    <div class="icon-demo__bar">
      <AeroInput
        v-model="q"
        :placeholder="t['icon.searchPlaceholder']"
        :width="240"
      />
      <span class="icon-demo__count">{{ filtered.length }} / {{ names.length }}</span>
    </div>
    <div class="icon-demo__grid">
      <button
        v-for="n in filtered"
        :key="n"
        class="icon-demo__cell"
        type="button"
        :title="`${t['icon.clickCopy']}&lt;AeroIcon name=&quot;${n}&quot; /&gt;`"
        @click="copy(n)"
      >
        <AeroIcon :name="n as any" :size="20" />
        <span class="icon-demo__name">{{ n }}</span>
        <span v-if="copied === n" class="icon-demo__copied">{{ t['icon.copied'] }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon-demo {
  width: 100%;

  &__bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  &__count {
    font-family: var(--ui-font-mono);
    font-size: 12.5px;
    color: var(--ui-ink-3);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    gap: 10px;
    max-height: 420px;
    overflow-y: auto;
    padding: 2px;
  }

  &__cell {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 6px 10px;
    border: 2px solid var(--ui-line);
    border-radius: 12px;
    background: var(--ui-card);
    color: var(--ui-ink-2);
    cursor: copy;
    transition: 0.2s;
    font-family: inherit;

    &:hover {
      border-color: var(--ui-brand);
      color: var(--ui-brand-ink);
      transform: translateY(-2px);
      box-shadow: 3px 3px 0 var(--ui-bg-tint);
    }
  }

  &__name {
    font-family: var(--ui-font-mono);
    font-size: 11px;
    color: var(--ui-ink-3);
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__copied {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: var(--ui-on-brand);
    background: var(--ui-brand);
    border-radius: 10px;
    animation: icon-demo-pop 0.25s var(--ui-spring);
  }
}

@keyframes icon-demo-pop {
  from { transform: scale(0.85); }
  to { transform: scale(1); }
}
</style>
