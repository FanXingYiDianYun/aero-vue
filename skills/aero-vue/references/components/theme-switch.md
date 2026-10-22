# AeroThemeSwitch（theme-switch）

分组：Basic 基础
中文名：主题开关

具名导入：

```ts
import { AeroThemeSwitch } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | 'light'|'dark' | — |
| `disabled` | boolean | false |
| `size` | 'sm'|'md'|'lg' | 'md' |

## events
| event | payload |
|---|---|
| `update:modelValue` | 'light'|'dark' |
| `change` | 'light'|'dark' |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { AeroThemeSwitch, AeroSwitch, useLocale, useTheme } from 'aero-vue'
const { demo } = useLocale()
const t = demo
const { state, setTheme } = useTheme()

// 五段（全真实交互，无编造内容）：
// ① 基础（现行为）② 受控 v-model + 消费方应用值 + 实时显示绑定值
// ③ 尺寸 sm·md·lg 三枚共用一个值（联动）④ 禁用（独立值 + 真实开关控制 disabled）
// ⑤ change 事件日志
// —— 双向同步：demo 单一共享状态 pageTheme，②③④ 全部 v-model 绑它。
//    a) 初始化只读不写：取主题服务当前值（禁加载期写服务——避免 immediate 强写冲掉持久化，固化为规则）；
//    b) 推向：watch(pageTheme) → setTheme(v)，全局主题真变；
//    c) 回流：watch(state.theme) → pageTheme（不等式守卫防回声循环），外部改主题 demo 跟得上。
//    @change 统一进 ⑤ 日志（一个 handler，删各自零散消费 watch）；④ 禁用仍由 disSwitchOn 独立控制。
const pageTheme = ref<'light' | 'dark'>(state.theme)
watch(pageTheme, (v) => setTheme(v))
watch(() => state.theme, (v) => { if (pageTheme.value !== v) pageTheme.value = v })
// —— ④ 禁用段：disSwitchOn=false 可正常切换明暗，true 才锁定（disabled 只锁交互不锁显示，
//    旋钮仍随 pageTheme 呈现）；禁用视觉 token 不动
const disSwitchOn = ref(false)
// —— ⑤ change 事件日志：只存 'light'|'dark' 键值，文案渲染期 t() 求值（禁烤串）
const log = ref<('light' | 'dark')[]>([])
// ②③④ 的 change 事件并入同一条真实事件流（非模拟）
function onThemeChange(v: 'light' | 'dark') {
  log.value = [v, ...log.value].slice(0, 8)
}
</script>
<template>
  <div class="ts-demo">
    <!-- ① 基础（现行为：内部 useTheme 主题服务，零回归） -->
    <section class="ts-demo__sec">
      <h3 class="ts-demo__h">{{ t['themeSwitch.secBasic'] }}</h3>
      <div class="ts-demo__row">
        <AeroThemeSwitch />
        <span class="ts-demo__sub">{{ t['themeSwitch.hint'] }}</span>
      </div>
    </section>

    <!-- ② 受控 v-model（绑单一共享状态 pageTheme，点击 emit + 推向服务 → 全局主题真变；
 回流 watch 使外部改主题时此段同步跟上）+ 实时显示绑定值 -->
    <section class="ts-demo__sec">
      <h3 class="ts-demo__h">{{ t['themeSwitch.secControlled'] }}</h3>
      <div class="ts-demo__row">
        <AeroThemeSwitch v-model="pageTheme" @change="onThemeChange" />
        <span class="ts-demo__sub ts-demo__val">v-model = {{ pageTheme }}</span>
      </div>
      <span class="ts-demo__sub">{{ t['themeSwitch.hintControlled'] }}</span>
    </section>

    <!-- ③ 尺寸 sm · md · lg 三枚（全部绑 pageTheme，任一枚点击全段联动） -->
    <section class="ts-demo__sec">
      <h3 class="ts-demo__h">{{ t['themeSwitch.secSizes'] }}</h3>
      <div class="ts-demo__row">
        <AeroThemeSwitch size="sm" v-model="pageTheme" @change="onThemeChange" />
        <AeroThemeSwitch size="md" v-model="pageTheme" @change="onThemeChange" />
        <AeroThemeSwitch size="lg" v-model="pageTheme" @change="onThemeChange" />
      </div>
    </section>

    <!-- ④ 禁用：真实 AeroSwitch 控制示例开关的 disabled（绑 pageTheme；
 disabled 只锁交互不锁显示，旋钮仍随 pageTheme 呈现） -->
    <section class="ts-demo__sec">
      <h3 class="ts-demo__h">{{ t['themeSwitch.secDisabled'] }}</h3>
      <div class="ts-demo__row">
        <AeroSwitch v-model="disSwitchOn" />
        <AeroThemeSwitch v-model="pageTheme" :disabled="disSwitchOn" @change="onThemeChange" />
      </div>
    </section>

    <!-- ⑤ change 事件日志（真实事件流；日志只存键值，渲染期 t() 求值） -->
    <section class="ts-demo__sec">
      <h3 class="ts-demo__h">{{ t['themeSwitch.secChangeLog'] }}</h3>
      <ol class="ts-demo__log">
        <li v-if="!log.length" class="ts-demo__logempty">{{ t['themeSwitch.logEmpty'] }}</li>
        <li v-for="(v, i) in log" :key="i">{{ v === 'dark' ? t['themeSwitch.logDark'] : t['themeSwitch.logLight'] }}</li>
      </ol>
    </section>
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/theme-switch/demo/basic.vue

