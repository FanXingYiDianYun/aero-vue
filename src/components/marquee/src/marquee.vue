<script setup lang="ts">
import type { AeroMarqueeProps } from './marquee.types'
import AeroIcon from '../../icon/src/icon.vue'

const props = withDefaults(defineProps<AeroMarqueeProps>(), {
  variant: 'brand',
  items: () => [],
  pauseOnHover: true,
})

// 双份内容拼接实现 -50% 无缝循环（demo 同法：innerHTML += innerHTML）
const doubled = [...props.items, ...props.items]
const dur = props.duration ?? (props.variant === 'brand' ? 28 : 34)
</script>

<template>
  <div v-if="variant === 'brand'" class="aero-mq" :class="{ 'is-pausable': pauseOnHover }">
    <div v-if="caption" class="aero-mq__cap">{{ caption }}</div>
    <div class="aero-mq__viewport">
      <div class="aero-mq__track" :style="{ animationDuration: dur + 's' }">
        <span v-for="(it, i) in doubled" :key="i" class="aero-mq__item">
          <AeroIcon v-if="it.icon" :name="(it.icon as any)" :size="18" />
          {{ it.text }}
        </span>
      </div>
    </div>
  </div>

  <div v-else class="aero-typeband" :class="{ 'is-pausable': pauseOnHover }">
    <div class="aero-mq__viewport">
      <div class="aero-mq__track aero-mq__track--type" :style="{ animationDuration: dur + 's' }">
        <span v-for="(it, i) in doubled" :key="i" class="aero-mq__tb" :class="{ 'is-solid': it.solid }">
          {{ it.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aero-mq {
  box-sizing: border-box;
  border-top: 2px solid var(--ui-line);
  border-bottom: 2px solid var(--ui-line);
  background: var(--ui-card);
  padding: 22px 0;
  overflow: hidden;

  &__cap {
    text-align: center;
    font-size: 12.5px;
    letter-spacing: 0.18em;
    color: var(--ui-ink-3);
    font-weight: 700;
    margin-bottom: 16px;
    font-family: var(--ui-font-en);
    text-transform: uppercase;
  }

  &__viewport {
    overflow: hidden;
    position: relative;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  }

  &__track {
    display: flex;
    width: max-content;
    animation: ui-marquee linear infinite;
    align-items: center;
  }

  &__track--type {
  }

  &__item {
    font-family: var(--ui-font-en);
    font-weight: 700;
    font-size: 19px;
    color: var(--ui-ink-3);
    display: flex;
    align-items: center;
    gap: 9px;
    white-space: nowrap;
    transition: color 0.3s;
    // margin-right 替代 flex gap：两份内容交界处（-50% 处）间距与项间一致，
    // 循环无回帧穿帮
    margin-right: 64px;
    &:hover {
      color: var(--ui-brand-ink);
    }
  }
}

.is-pausable:hover .aero-mq__track {
  animation-play-state: paused;
}

/* 大字带模式 */
.aero-typeband {
  border-top: 2px solid var(--ui-line);
  border-bottom: 2px solid var(--ui-line);
  background: var(--ui-bg-soft);
  overflow: hidden;
  padding: 20px 0;

  .aero-mq__viewport {
    -webkit-mask-image: none;
    mask-image: none;
  }

  .aero-mq__tb {
    font-family: var(--ui-font-en);
    font-weight: 700;
    font-size: 44px;
    letter-spacing: -0.01em;
    white-space: nowrap;
    padding-right: 48px;
    color: transparent;
    -webkit-text-stroke: 2px var(--ui-line-2);

    &.is-solid {
      color: var(--ui-brand);
      -webkit-text-stroke: 0;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .aero-mq__track {
    animation: none;
  }
}
</style>
