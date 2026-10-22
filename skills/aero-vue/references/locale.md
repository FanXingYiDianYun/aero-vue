# Aero UI locale（词包）速查

版本适用：`aero-vue >= 1.0.0-beta.4`。真源 = `src/locale/zh-cn.ts` / `en-us.ts`（本文件内容核对清单见 reports evidence）。

## 1. 两个词包对象

```ts
import { zhCn, enUs, type LocaleMessages } from 'aero-vue'
// zhCn / enUs：全量词包对象，键结构 = LocaleMessages（~40 组）
```

- 库默认词包 = **zh-cn**（无包裹时回落中文）
- `enUs` / `zhCn` 可直接用于宿主自有文案（demo 站点即此用法）

## 2. 宿主接入（AeroConfigProvider locale 属性）

```vue
<script setup>
import { AeroConfigProvider, AeroDatePicker } from 'aero-vue'
import { ref } from 'vue'
const lang = ref<'zh-cn' | 'en-us'>('zh-cn')
</script>

<template>
  <AeroConfigProvider :locale="lang">
    <AeroDatePicker v-model="date" />
  </AeroConfigProvider>
</template>
```

`locale` 取 `'zh-cn' | 'en-us'`；provide/inject 向下传递，子组件内 `useLocale()` 自动跟随。**没有** `useSiteI18n` 之类的宿主 API——宿主侧切换就是换 `locale` 属性。

## 3. 组件内消费（useLocale）

```ts
import { useLocale } from 'aero-vue'
const { locale, messages, cropper } = useLocale()
// locale: ComputedRef<'zh-cn' | 'en-us'>
// messages: ComputedRef<LocaleMessages>（全量，messages.value.code.copy 取值）
// cropper: 组级 ComputedRef（词包每个组都有同名快捷组；动态组按 Object.keys(zhCn) 补齐）
```

带参动态文案（非字符串）：`cropper.metaFrame(size, rot)`、`pagination.go(n)`、`carousel.pageAria(n)`、`datePicker.monthName(m)` 等；**动态文案一律是带参函数，宿主侧勿当字符串拼接**。

## 4. 词包组键全表（zhCn 顶层键，按真源顺序）

common, cropper, code, pagination, upload, empty, select, table, transfer, toast, dialog, drawer, messageBox, popconfirm, carousel, cascader, datePicker, timePicker, tour, search, themeSwitch, image, imageViewer, rate, qrcode, otp, slideGo, swipeDeck, sortList, tree, input, inputNumber, inputTag, autocomplete, mention, treeSelect, alert, announce, anchor, backTop, breadcrumb, notification, pageHeader, parallaxBox, bottomSheet, actionButtons, demo

注：末组 `demo`（`DemoMessages`，扁平 `'comp.key'` 键，如 `form.required`）供组件 demo 页与演示站消费；宿主应用一般不用。

## 5. 死键规则

无消费方的词包键已从词包删除（J5 收口）。引用不存在的组/键 → 运行时 `undefined` 文案；**以本表为准，勿凭记忆造键**。

## 6. 局部覆盖

组件 `labels` 类 prop（如 `AeroCropper :labels`）优先级高于词包——只需换个别文案时不必整体切 locale。
