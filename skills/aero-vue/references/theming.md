# Aero UI 主题速查（theming）

版本适用：`aero-vue >= 1.0.0-beta.4`。真源 = `src/styles/tokens.scss`（全库唯一样式真源）+ `src/composables/use-theme.ts` + theme-provider 组件。

## 1. 明暗主题（html 级）

- 运行时 CSS 变量：`<html data-theme="light|dark">`，默认 light；`aero-dark` 类同样切暗色
- 编程切换：

```ts
import { useTheme } from 'aero-vue'
const { state, isDark, setTheme, toggleTheme } = useTheme()
toggleTheme() // 写 localStorage 'aero-ui-theme' + html[data-theme]
```

- UI 切换件：`AeroThemeSwitch`（组件卡见 components/theme-switch.md）

## 2. 品牌预设（5 档）

`aero`（默认 #0EBFFF）/ `violet` / `mint` / `sunset` / `rose`，落 `<html data-preset="…">`（`aero` 不挂属性）；持久化 key = `aero-ui-preset`。

```ts
const { setPreset, setTheme, toggleTheme, setBrand, resetBrand } = useTheme()
// setPreset('violet') 亦可直接 state.preset = 'violet'（state 已解出）
```

宿主组件用法：`<AeroConfigProvider preset="violet">` 或 `<AeroThemeProvider :preset="p">`。

## 3. 自定义品牌色（brand）

`useTheme().setBrand('#FF5A2E')`：写 inline `--ui-brand` / `--ui-on-brand`（on-brand 按亮度自动推 墨/白），持久化 key = `aero-ui-brand`；`resetBrand()` 回预设。自定义色**优先于预设**（preset 被置 custom 覆盖）。
`AeroThemeProvider :brand="hex"` 同效，但作用于组件树（scoped 模式见下）。

## 4. 作用域模式（AeroThemeProvider :scoped）

默认（`scoped: false`）：theme/preset/brand 写 `:root` + localStorage（全局）。
`scoped: true`：只写容器自身 CSS 变量（**不动 :root、不写 localStorage**）——同页多主题区域用 scoped 实例隔离。

## 5. CSS 令牌（--ui-*，160+ 条）

前缀约定：CSS 变量 `--ui-*` / SCSS 变量 `$ui-*`。常用组（明暗双值，暗色在 `.aero-dark` / `data-theme=dark` 块翻转）：

- 品牌：`--ui-brand` `--ui-on-brand` `--ui-brand-deep` `--ui-brand-ink`
- 派生底色：`--ui-bg-soft` `--ui-bg-tint` `--ui-line` `--ui-line-2` `--ui-dot`
- 中性：`--ui-ink` `--ui-ink-2` `--ui-ink-3` `--ui-bg` `--ui-card`
- 状态：`--ui-ok` `--ui-warn` `--ui-err` `--ui-star`
- 圆角：`--ui-radius`(18px) `--ui-radius-s`(12px)

宿主覆盖品牌色只需 inline 两个变量（库组件全部经 `var(--ui-*)` 取色）：

```html
<style> :root { --ui-brand: #0EBFFF; --ui-on-brand: #fff; } </style>
```

**组件不得在 tokens.scss 之外定义色值**（库内规约）；宿主侧改主题 = 换 data-theme/data-preset 或覆盖 `--ui-brand`，勿逐组件改色。

## 6. 动效

- `useMotion()`：全局动效门控——`setEnabled(false)` 向 `<html>` 注入 `data-motion="off"`，由 tokens.scss 的断路规则**统一停用全库循环动画与过渡**；持久化 key = `aero-ui-motion`（刷新不丢）。宿主"减少动效"开关直接接它，勿自行逐组件禁用。
- 装饰动效组件 `AeroMotionPresets`（preset 名见 components/motion-presets.md）。
