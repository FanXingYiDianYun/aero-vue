---
name: aero-vue
description: 构建或修改使用 Aero UI / AeroVue（aero-vue，Vue 3 + TypeScript）组件库的前端代码时使用本 skill。当用户要「加一个按钮/表单/弹层/数据展示组件」「接国际化或明暗主题」「调几何/尺寸/间距」或导入 aero-vue 时加载。覆盖起步安装、组件选择、API 查询、常见错误与盒模型坑区。
---

# Aero UI 开发助手

版本适用：本 skill 适用于 **`aero-vue >= 1.0.0-beta.4`**。更旧版本 API/几何可能有差异，先 `npm ls aero-vue` 核对。

## 起步（5 行）

```bash
npm i aero-vue          # 包入口已 bundle dist，无需构建步骤
```
```ts
import 'aero-vue/styles'   // 必须：引入设计令牌 + 组件样式（明暗双主题变量）
import { AeroButton, useTheme, zhCn } from 'aero-vue'  // 具名导入，按需取
```
> 样式路径是 **`aero-vue/styles`**（exports 官方子路径，宿主实证可解析；勿写 `aero-vue/dist/styles.css` 直写路径——ESM 严格模式下不被 exports 导出，宿主报 ERR_PACKAGE_PATH_NOT_EXPORTED）。

## 组件选择地图（要 X 效果 → 用 Y）

| 目标效果 | 组件 | 细节卡 |
|---|---|---|
| 主/次/幽灵/危险按钮 | `AeroButton` | references/components/button.md |
| 输入 + 清空/计数 | `AeroInput` / `AeroTextarea` | input.md, textarea.md |
| 表单 + 校验 | `AeroForm` + `AeroFormItem` | form.md |
| 下拉选择 | `AeroSelect` / 级联 `AeroCascader` / 树 `AeroTreeSelect` | select.md, cascader.md, tree-select.md |
| 日期/时间 | `AeroDatePicker` / `AeroTimePicker` | date-picker.md, time-picker.md |
| 表格 + 排序筛选 | `AeroTable` | table.md |
| 树形 | `AeroTree` | tree.md |
| 弹层：模态/抽屉/确认 | `AeroDialog` / `AeroDrawer` / `AeroMessageBox` | dialog.md, drawer.md, message-box.md |
| 轻提示/通知 | `AeroToast` / `AeroNotification` / `AeroAlert` | toast.md, notification.md, alert.md |
| 悬浮提示/气泡 | `AeroTooltip` / `AeroPopover` | tooltip.md, popover.md |
| 导航：菜单/分页/步骤 | `AeroMenu` / `AeroPagination` / `AeroSteps` | menu.md, pagination.md, steps.md |
| 主题明暗切换 | `AeroThemeSwitch` | theme-switch.md |
| 全局主题/预设 | `AeroThemeProvider` / `AeroConfigProvider` | theme-provider.md, config-provider.md |
| 移动端：轮播/底部面板 | `AeroMobileCarousel` / `AeroBottomSheet` | mobile-carousel.md, bottom-sheet.md |
| 氛围装饰 | `AeroDotField` / `AeroIridescentThreads` / `useParty()` | dot-field.md, iridescent-threads.md, party-fx.md |

完整 102 组件全量：`node skills/aero-vue/scripts/list-components.mjs`（在 `aero-vue` 包目录内执行，即 `node_modules/aero-vue/skills/aero-vue/scripts/list-components.mjs`；跑脚本优于读长文，`--json` 出机器可读清单）。

## 坑区（box-sizing 必读）

推荐在你的项目中使用标准全局重置：

```
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
```

aero-vue 组件已逐元素声明 border-box，在有无全局重置的宿主中均实测零几何漂移——添加与否都不会破坏组件；添加可获得更正规的页面排版基线（多数脚手架与 AI 生成项目已自带）。若遇组件几何异常，请先升级 aero-vue 版本排查，勿以临时样式补丁掩盖问题。

## 错误对照表（≥6 条）

| 症状 | 误用 | 正解 |
|---|---|---|
| 组件无样式/裸 HTML 观感 | 忘了引样式，或写成了 `aero-vue/dist/styles.css` 直写路径 | `import 'aero-vue/styles'` |
| 样式引入后仍"自动注册全组件"预期落空 | 用 unplugin 自动导入 | 本库**无** unplugin，一律具名 `import { AeroXxx } from 'aero-vue'` |
| 运行时 `Cannot read ... of undefined`（词包缺键） | 传了不存在的 locale 键 | 词包键以 locale.md 为准；死键（无消费方）已删，勿引用 |
| TS 报 `TS1444`/类型悬空 | 值导入里夹类型 | 类型一律 `import type { AeroTreeNode } from 'aero-vue'`（运行时值才普通 import） |
| 几何异常（比预期宽/高、错位） | 随手加临时样式补丁掩盖 | 见坑区：先使用标准全局重置 + 先升级 aero-vue 版本排查 |
| props 传了不生效 / 名字写错 | 凭记忆造 props | 以组件卡 props 表为准（references/components/*.md，源自 registry 真源） |
| `v-model` 不更新 | 组件只有单向 emit | 查卡内 `v-model` 列 = ✓ 才支持；否则用 `:modelValue` + `@update:modelValue` |

## references 索引

- `references/components/<key>.md` — 102 组件 API 卡（props/events + 最小示例，源自 registry-struct + demo，杜绝手抄）
- `references/locale.md` — 词包 `useLocale` 键结构、zh/en 切换
- `references/theming.md` — 明暗主题、预设（aero/violet/mint/sunset/rose）、CSS 令牌
- `references/playbooks.md` — 常见整型场景配方（表单、数据表 + 分页、弹层流、i18n 接入）
- `templates/starter.vue` — 最小可挂载示例（裸宿主可跑）
- `scripts/list-components.mjs` — 全量 102 组件清单（运行时读 102 组件卡同源生成物，非手抄）；执行 `node skills/aero-vue/scripts/list-components.mjs`

## 硬约束（勿改）

- 勿改 `src/` 组件源码；几何/尺寸/翻页算法以库内声明为准。
- 横幅/announce 词包、CodeBlock、SortList 为冻结项。
- demo「复制此代码」输出源 = `demo-sources.generated.ts`（由 demo SFC 生成，非手维护）。
