<div align="center">

<img src="https://raw.githubusercontent.com/FanXingYiDianYun/aero-vue/main/assets/head-banner.svg" alt="AeroUI Brand Banner" width="760" />

English | [简体中文](https://github.com/FanXingYiDianYun/aero-vue/blob/main/README.zh-CN.md)

**A TypeScript component library built on Vue 3**  
Version `1.0.0` · Codename "Stratosphere"

<img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue 3" />
<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/license-MIT-334155" alt="MIT" />
<img src="https://img.shields.io/badge/tests-vitest%20%2B%20vue--tsc-6E9F18" alt="tests" />
<img src="https://img.shields.io/npm/v/aero-vue" alt="npm" />
<img src="https://img.shields.io/npm/dm/aero-vue" alt="downloads" />
</div>

---
## ✨ Introduction

AeroUI is a Vue 3 component library for modern web applications,
written entirely in strict TypeScript. Out of the box it provides
a design-token system with light & dark themes, Chinese and
English locale packages, a bundled monospace code font, 102 common
components (forms, data display, feedback, navigation, and more),
and composables such as `useTheme`, `useLocale` and `useParty`.

## 🧩 Features

| Area | Description |
| --- | --- |
| Design system | A unified visual language driven by `--ui-*` CSS design tokens — colors, radii, motion and typography all converge at the token layer |
| Theming | Light & dark themes, switched via the `data-theme` attribute; components support both controlled (`v-model`) and uncontrolled usage |
| i18n | `zhCn` / `enUs` locale packages exported from the package entry point, integrated via the `useLocale` system |
| Fonts | Bundled [JetBrains Mono](https://www.jetbrains.com/lp/mono/) monospace font (SIL OFL 1.1; the woff2 files and license text ship with the package) |
| Engineering quality | Strict TypeScript types, a full unit-test suite and site-wide visual regression checks as release gates |
| Accessibility | ARIA labels and keyboard navigation built into key interactive components |

## 📦 Install

```bash
npm install aero-vue
# or
pnpm add aero-vue
# or
yarn add aero-vue
```

## 🚀 Quick start

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
  <AeroButton variant="primary">Hello, Stratosphere</AeroButton>
</template>
```

## 🎨 Theming

Themes are driven by the `data-theme` attribute on the root
element:

```html
<html data-theme="dark">
```

Every color, radius, shadow and motion duration is a `--ui-*` CSS
variable that can be overridden at the application level.
Components such as `AeroThemeSwitch` support both controlled and
uncontrolled modes.

## 🌍 Internationalization

Locale packages are exported from the package entry point:

```ts
import { zhCn, enUs } from 'aero-vue'
```

## 🧩 Components

| Component preview |
| --- |
| <img src="https://raw.githubusercontent.com/FanXingYiDianYun/aero-vue/main/assets/button.gif" alt="AeroUI component interaction demo" width="100%" /> |

> Component demo area (button hover signature interaction +
> theme-switching animation).

## ✨ AI / Agent

The library ships with a development-assistant skill
(aero-vue ≥ 1.0.0-beta.4, covering component selection / API /
common pitfalls / box-model notes). The skill is generated from
the component source and distributed inside the same package —
it is always in sync with the version you install.
Quickest start: paste the instruction below to your AI agent
(Claude Code / Codex); it will read the guide and set everything
up:

```text
Please read https://FanXingYiDianYun.github.io/aero-ui-view/#/ai-guide and follow the instructions there to install the aero-vue component library and its companion skill in my project.
```

> The demo site hosts the same page at `/ai-guide` (one
> instruction + two install channels + box-model notes).

- **npm channel**: after `npm i aero-vue`, copy

  `node_modules/aero-vue/skills/aero-vue` to your project's
  `.claude/skills/` or `.codex/skills/`

- **GitHub channel**: `/plugin marketplace add FanXingYiDianYun/aero-vue`
- Box-model note: a standard global reset in your app is

  recommended: `*, *::before, *::after { box-sizing: border-box; }`

  + `body { margin: 0; }`. Every aero-vue component declares

  `border-box` per element and has been verified with zero
  geometric drift both with and without a global reset — adding
  one is optional; it simply gives your pages a cleaner
  typographic baseline (most scaffolds and AI-generated projects
  already include one). If components ever look off, upgrade
  aero-vue first instead of patching styles.

## 🗺️ Versioning

This project follows [Semantic Versioning](https://semver.org/).
The current release is `1.0.0` — a stable API; breaking changes
only occur in major versions. The `v0.2` roadmap includes
multi-entry builds with per-locale sub-path chunks (see CHANGELOG).

## 📄 License

This project is open-sourced under the
[MIT](https://github.com/FanXingYiDianYun/aero-vue/blob/main/LICENSE)
license. The bundled JetBrains Mono font is licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/).

## 🔗 Links

- Online demo: https://FanXingYiDianYun.github.io/aero-ui-view/
- 简体中文文档: https://github.com/FanXingYiDianYun/aero-vue/blob/main/README.zh-CN.md
