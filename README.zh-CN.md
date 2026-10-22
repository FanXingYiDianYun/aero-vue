<div align="center">

<img src="https://raw.githubusercontent.com/FanXingYiDianYun/aero-vue/main/assets/head-banner.svg" alt="AeroUI 品牌横幅" width="760" />

[English](https://github.com/FanXingYiDianYun/aero-vue/blob/main/README.md) | 简体中文

**基于 Vue 3 的 TypeScript 组件库**  
当前版本 `1.0.0` · 代号「平流层 / Stratosphere」

<img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue 3" />
<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/license-MIT-334155" alt="MIT" />
<img src="https://img.shields.io/badge/tests-vitest%20%2B%20vue--tsc-6E9F18" alt="tests" />
<img src="https://img.shields.io/npm/v/aero-vue" alt="npm" />
<img src="https://img.shields.io/npm/dm/aero-vue" alt="downloads" />
</div>

---
## ✨ 简介

AeroUI 是一套面向现代 Web 应用的 Vue 3 组件库，以 TypeScript 严格模式编写，开箱即用：内置明暗双主题的设计令牌体系、中英文语言包与等宽代码字体，提供 102 个常用组件（覆盖表单、数据展示、反馈、导航等场景），以及 `useTheme`、`useLocale`、`useParty` 等组合式函数。

## 🧩 特性

| 领域 | 说明 |
| --- | --- |
| 设计体系 | 以 `--ui-*` CSS 设计令牌驱动的统一视觉语言，色彩、圆角、动效、字体全部收敛到令牌层 |
| 主题 | 明暗双主题，基于 `data-theme` 属性切换；组件支持受控（`v-model`）与非受控两种接入方式 |
| 国际化 | `zhCn` / `enUs` 语言包经包主入口导出，配合 `useLocale` 体系接入 |
| 字体 | 内置 [JetBrains Mono](https://www.jetbrains.com/lp/mono/) 等宽字体（SIL OFL 1.1 授权，随包分发 woff2 与许可文本） |
| 工程质量 | 严格 TypeScript 类型、全量单元测试与全站视觉巡检纳入发布门禁 |
| 可访问性 | 关键交互组件内置 ARIA 标注与键盘导航 |

## 📦 安装

```bash
npm install aero-vue
# 或
pnpm add aero-vue
# 或
yarn add aero-vue
```

## 🚀 快速上手

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'aero-vue/styles'
createApp(App).mount('#app')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { AeroButton } from 'aero-vue'
</script>
<template>
  <AeroButton variant="primary">你好，平流层</AeroButton>
</template>
```

## 🎨 主题

主题由根元素的 `data-theme` 属性驱动：

```html
<html data-theme="dark">
```

全部颜色、圆角、阴影、动效时长均为 `--ui-*` CSS 变量，可在应用层覆写以定制主题。组件（如 `AeroThemeSwitch`）同时支持受控与非受控两种模式。

## 🌍 国际化

语言包统一经包主入口导出：

```ts
import { zhCn, enUs } from 'aero-vue'
```

## 🧩 组件一览

| 组件预览 | |
| --- | --- |
| <img src="https://raw.githubusercontent.com/FanXingYiDianYun/aero-vue/main/assets/button.gif" alt="AeroUI 组件交互演示" width="100%" /> | |

> 组件演示区（button hover 签名交互 + 主题切换动效）。

## ✨ AI / Agent

安装后本库随包分发开发助手 skill（`aero-vue` ≥ 1.0.0-beta.4，覆盖组件选择 / API / 常见错误 / 盒模型坑区）。
skill 由组件源码生成、随包同版本分发——与你安装的版本永远同步。
最快上手：把下面这条**指令复制给手头的 AI agent（Claude Code / Codex）**，它会读文档并按规范装好组件库 + skill：

```text
请阅读 https://FanXingYiDianYun.github.io/aero-ui-view/#/ai-guide 并按照说明，为我的项目安装 aero-vue 组件库与配套 skill
```

> 演示站亦有此页：`/ai-guide`（一条指令 + 两通道安装 + 盒模型坑区）。

- **npm 通道**：`npm i aero-vue` 后把 `node_modules/aero-vue/skills/aero-vue` 拷到项目 `.claude/skills/` 或 `.codex/skills/`
- **GitHub 通道**：`/plugin marketplace add FanXingYiDianYun/aero-vue`
- 盒模型提醒：推荐在你的项目中使用标准全局重置：`*, *::before, *::after { box-sizing: border-box; }` + `body { margin: 0; }`。aero-vue 组件已逐元素声明 border-box，在有无全局重置的宿主中均实证零几何漂移——添加与否都不会破坏组件；添加可获得更正规的页面排版基线（多数脚手架与 AI 生成项目已自带）。若遇组件几何异常，请先升级 aero-vue 版本排查，勿以临时样式补丁掩盖问题。

## 🗺️ 版本策略

遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)：当前为 `1.0.0` 正式版，API 稳定，破坏性变更仅出现在主版本升级。`v0.2` 路线图（详见 CHANGELOG）包含 locale 子路径独立 chunk 的多入口构建。

## 📄 许可证

本项目基于 [MIT](https://github.com/FanXingYiDianYun/aero-vue/blob/main/LICENSE) 许可证开源。随包分发的 JetBrains Mono 字体遵循 [SIL Open Font License 1.1](https://openfontlicense.org/)。

## 🔗 链接

- 在线演示：https://FanXingYiDianYun.github.io/aero-ui-view/
