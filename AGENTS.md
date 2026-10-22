# AGENTS（aero-vue）

**库一句话**：Aero UI（`aero-vue`）= 源自 AeroBase 设计体系的 Vue 3 + TypeScript 组件库——硬阴影签名交互、弹性动效、明暗双主题，102 组件/组合式入口。

## 装包引样式（宿主 5 行起步）

```ts
// 1. 装包
npm i aero-vue
// 2. 引入样式（设计令牌 + 组件样式，明暗双主题变量）——exports 官方写法 aero-vue/styles，勿写 dist/styles.css 直写路径
import 'aero-vue/styles'
// 3. 具名导入组件（本库无 unplugin 自动导入，一律显式 import）
import { AeroButton, useTheme, zhCn } from 'aero-vue'
```

## 给 Agent / 协作者：先读 SKILL

- 组件选择、API 查询、错误对照、盒模型坑区 → 读 `skills/aero-vue/SKILL.md`（+ references 索引）。
- 全量 102 组件：`node scripts/list-components.mjs`（跑脚本优于读长文）。
- 组件卡（props/events/最小示例）= 生成物，真源在演示站仓 `aero-ui-view/src/locales/registry-struct.ts`（sibling），**勿手改** `skills/aero-vue/references/components/*.md`。

## box-sizing（宿主必读）

推荐在你的项目中使用标准全局重置：

```
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
```

aero-vue 组件已逐元素声明 border-box，在有无全局重置的宿主中均实测零几何漂移——添加与否都不会破坏组件；添加可获得更正规的页面排版基线（多数脚手架与 AI 生成项目已自带）。若遇组件几何异常，请先升级 aero-vue 版本排查，勿以临时样式补丁掩盖问题。详见 SKILL.md 坑区。

## 版本策略

- 当前 `1.0.0` 正式版（GA；此后变更走语义化版本）。
- 组件源码冻结项（announce/横幅词包、CodeBlock、SortList）改动须 owner 放行。
- 构建产物 `dist/` 不入源（.gitignore），发布面 = `files: ["dist", "skills"]`。

## 构建与验收

- `pnpm build`（vite lib + vue-tsc 出类型）；`pnpm test`（vitest，含 x1-exports-guard 10 项）。
- 门禁 = run-all 7 步一键（build → vitest → gen-idempotent 3 生成器二跑 → guard 9/9 → cjk → sweep 204 双视口 → pack 全树清点 + sha256）。
