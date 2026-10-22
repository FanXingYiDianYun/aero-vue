# Aero UI 场景配方（playbooks）

版本适用：`aero-vue >= 1.0.0-beta.4`。组件 API 细节以 `references/components/*.md` 组件卡为准（本文件只给整型场景骨架，props 均与真源对齐）。

## P1 表单 + 校验

```vue
<script setup>
import { ref } from 'vue'
import { AeroForm, AeroFormItem, AeroInput, AeroSelect, AeroButton } from 'aero-vue'
const form = ref({ name: '', city: '' })
const cityOptions = [{ label: '上海', value: 'sh' }]
const err = ref('')
function submit() {
  err.value = form.value.name ? '' : '姓名必填'
}
</script>

<template>
  <AeroForm @submit="submit"><!-- AeroForm = 原生 <form> 封装，submit 事件上抛 -->
    <AeroFormItem label="姓名" :required="true" :error="err">
      <AeroInput v-model="form.name" clearable />
    </AeroFormItem>
    <AeroFormItem label="城市">
      <AeroSelect v-model="form.city" :options="cityOptions" />
    </AeroFormItem>
    <AeroButton type="primary" native-type="submit">提交</AeroButton>
  </AeroForm>
</template>
```

要点：`AeroFormItem` props = `label / required / hint / error`（error 非空渲染 `is-error`）；`AeroForm` 只封 `submit`，无内置 rules 引擎——校验逻辑放宿主 `submit()` 里。按钮组用 `AeroButtonGroup` 收拢。

## P2 数据表 + 分页

```vue
<script setup>
import { ref, computed } from 'vue'
import { AeroTable, AeroPagination, type AeroTableColumn } from 'aero-vue'
const columns: AeroTableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'score', title: '分数', width: '80px', mono: true },
]
const page = ref(1)
const rows = computed(() => /* 按 page 切片 allRows */ [])
</script>

<template>
  <AeroTable :columns="columns" :data="rows" empty-text="暂无数据" />
  <AeroPagination v-model="page" :total="42" :page-size="10" @change="(p) => (page = p)" />
</template>
```

要点：`AeroTableColumn` 是类型（`import type`），列只有 `key/title/width/mono`，无内置排序/筛选；翻页器 props = `modelValue/total/pageSize` + `change(n)`。

## P3 弹层流（modal → 确认 → 反馈）

```ts
import { AeroDialog, AeroMessageBox, AeroToast, AeroNotification } from 'aero-vue'
// 模态：AeroDialog v-model="open"（modelValue: boolean），遮罩可点关闭/毛玻璃均自管
// 确认框：AeroMessageBox.confirm({ message, title, confirmText, cancelText, danger }) → Promise<boolean>
// 轻反馈：AeroToast.show({ type, message, duration }) / AeroToast.success(msg)
// 通知条：AeroNotification.success(title, message?)；加载遮罩：AeroLoading :loading
```

要点：弹层 z-index、关闭动画均由组件自管；勿在宿主自造全屏遮罩叠在弹层上。

## P4 i18n 接入（宿主侧）

```vue
<AeroConfigProvider :locale="lang"><!-- 'zh-cn' | 'en-us'，默认 zh-cn --></AeroConfigProvider>
```

- 词包组键全表见 `locale.md`；动态文案是带参函数（`metaFrame` / `go` / `pageAria` 等）
- 组件 `labels` 类 prop（如 `AeroCropper :labels`）可局部覆盖词包，无需整站切 locale
- 宿主自有文案直接 import 导出的 `zhCn` / `enUs` 词包对象，勿硬编码句子

## P5 主题接入（宿主侧）

```ts
import { useTheme } from 'aero-vue'
useTheme().setTheme('dark')  // 或 <AeroThemeProvider theme="dark" /> / <AeroThemeSwitch v-model="m" />
```

- 品牌换色只覆盖 `--ui-brand` + `--ui-on-brand` 两个变量（`theming.md` §5）
- 多主题区域隔离：`AeroThemeProvider :scoped="true"`（不动 :root / localStorage）
- "减少动效"开关接 `useMotion().setEnabled(false)`

## P6 移动端页面骨架

```vue
<script setup>
import { ref } from 'vue'
import { AeroMobileCarousel, AeroMobileTabBar, AeroBottomSheet } from 'aero-vue'
const slides = [{ en: 'LAUNCH', zh: '发射', chip: '阶段 1' }]
const active = ref(0)
const sheet = ref(false)
</script>

<template>
  <AeroMobileCarousel :slides="slides" />
  <AeroBottomSheet :open="sheet" :rows="[['版本','1.0.0-beta.4']]" title="详情" />
  <AeroMobileTabBar v-model="active" :items="[{ label: '首页', icon: 'home' }]" />
</template>
```

要点：slide 形态 = `{ en, zh, chip? }`（`AeroMobileCarouselSlide`，`import type`）；`AeroBottomSheet` 开关用 `:open` + `change` 事件（无 v-model）；移动端家族几何按手机视口设计，勿塞进桌面定宽容器。
