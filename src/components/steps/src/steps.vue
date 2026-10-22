<script setup lang="ts">
export interface StepItem {
  title: string
  desc?: string
}

defineProps<{
  items: StepItem[]
  /** 当前步骤索引（从 0 计） */
  current: number
}>()

const emit = defineEmits<{ (e: 'change', i: number): void }>()
</script>

<template>
  <div class="aero-steps">
    <div
      v-for="(s, i) in items"
      :key="i"
      class="aero-step"
      :class="{ 'is-done': i < current, 'is-active': i === current }"
      role="button"
      tabindex="0"
      @click="emit('change', i)"
      @keydown.enter="emit('change', i)"
    >
      <i class="aero-step__num">
        <svg v-if="i < current" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 12l-5 5" />
        </svg>
        <template v-else>{{ i + 1 }}</template>
      </i>
      <div class="aero-step__txt">
        <b>{{ s.title }}</b>
        <span v-if="s.desc">{{ s.desc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-steps {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;
}

.aero-step {
  box-sizing: border-box;
  flex: 1;
  min-width: 130px;
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 14px;
  border-radius: 14px;
  border: 2px solid var(--ui-line);
  cursor: pointer;
  background: var(--ui-card);
  transition: 0.28s var(--ui-spring);

  &__num {
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    flex: none;
    border-radius: 50%;
    border: 2px solid var(--ui-line-2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--ui-font-en);
    font-weight: 700;
    font-size: 13px;
    color: var(--ui-ink-2);
    transition: 0.28s;
    font-style: normal;
  }
  &__txt {
    b {
      font-size: 13.5px;
      display: block;
      color: var(--ui-ink);
    }
    span {
      font-size: 12px;
      color: var(--ui-ink-3);
    }
  }
  &.is-done .aero-step__num {
    background: var(--ui-ok);
    border-color: var(--ui-ok);
    color: var(--ui-on-ink);
  }
  &.is-active {
    border-color: var(--ui-brand);
    box-shadow: 4px 4px 0 var(--ui-bg-tint);
    transform: translateY(-2px);
    .aero-step__num {
      background: var(--ui-brand);
      border-color: var(--ui-ink);
      color: var(--ui-on-brand);
    }
  }
}
</style>
