# Changelog

@aero/ui 版本历史。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/)。

## [Unreleased]（v0.2 Roadmap）

### Planned
- locale 子路径独立 chunk 多入口构建（rollup 多 entry 产 `dist/locale/zh-cn.js`/`en-us.js`），
  届时恢复 `exports["./locale/*"]` 声明。在此之前（X1）子路径声明已收回（RF-2：vite
  单入口不产 locale JS），词包常量统一从主入口 `@aero/ui` 引入（zhCn/enUs 值导出）。
- 可视化巡检工具链（overflow sweep / CJK 扫描器）恢复为仓库内 tools/qa/（可自
  node-a-pre-alpha 历史提取）。

## [1.0.0] - 2026-10-21

首个正式版（GA）。自 1.0.0-rc.12 起功能零变更（仅 SKILL 示例指针路径与版本标识更新），本节为发布标记。

- 102 个 Aero* 组件（基础 / 表单 / 数据展示 / 导航 / 反馈等）
- 完整 TypeScript 类型与 Tree-shakable ESM 构建
- 暗色主题与预设体系
- 配套 AI Skill（102 张组件卡 + 安装指南）
- SKILL 组件卡示例指针路径更新为公开仓布局
- 演示站：https://FanXingYiDianYun.github.io/aero-ui-view/

历史明细见 1.0.0-beta.1 → 1.0.0-rc.12 各节。

## [1.0.0-rc.12] - 2026-10-21（sync-audit RC-fix3-j 终检修正微轮：owner 全检两处反馈修正——QRCode 初始内容换仓库真值 + AI Skill 页「查看完整文档」移除）

### Changed
- **QRCode 演示初始内容**：`https://aero-ui.dev`（不存在的演示域名）→ `https://github.com/FanXingYiDianYun/aero-vue`（owner 点名；组件 `value` prop 无默认值，初始值 = demo 传参面改 demo basic.vue；SKILL qrcode 卡与 demo-sources 循生成器再生成同步，「查看此代码」面板显示新源）。
- **AI Skill 页「查看完整文档」移除**：ai-guide 页底部该链接（原目标 = AI_GUIDE_URL 演示站 /ai-guide 页，页面内自指冗余）UI 元素 + 词包键（zh `fullDocs` / en `fullDocs` 同删）删除；AI_GUIDE_URL 常量本身保留（one-liner 在用）；页面其余面零动。

### Notes
- 渲染态验证：qrcode demo 初始输入 = 新 URL（QR 正常渲染）/ ai-guide 页「查看完整文档」文本与 DOM 0 + one-liner 真值仍在 + 控制台 0 错 + 双视口截图入 evidence。
- 挂账更新：B 案 SKILL 英文化 / SKILL 指针依赖仓库 Release / lib ESM minify / 16 d.ts 序差（延续）。

## [1.0.0-rc.11] - 2026-10-21（sync-audit RC-fix3-i Release 前终检微轮：占位真值化 + 一致性对平 + README 终稿 + 开源就绪审计 + npm 元数据补齐）

### Changed
- **占位真值化**：`AI_GUIDE_URL` 单源常量 = `https://FanXingYiDianYun.github.io/aero-ui-view/#/ai-guide`
  （演示站 ai-guide 页）；README one-liner 复制块 `{AI_GUIDE_URL}` → 真值 URL 字面量；占位注释句删除；
  演示站「在线演示」链接真值化。渲染态验证 one-liner 出真值 + 占位残留 0。
- **一致性对平（四面）**：styles 导入统一 exports 真源写法 `aero-vue/styles`（AGENTS/SKILL 警示语
  倒置面同步改写，rc.10 挂账 4 清偿；`aero-vue/dist/styles.css` 直写 ESM 不可解析 = 宿主实证）；
  AGENTS 刷新（beta.4 → rc 通道实况 / guard 5 → 9 项 / 门禁顺序 = run-all 7 步）；组件数 102 与
  box-sizing 口径四面一致复核零改；仓库名/marketplace 四面 = 命名终局表。
- **README 终稿（owner 点名四件）**：emoji 🤖 → ✨（AI / Agent 节，仅此一处）；GitHub 通道行内
  括号注释删除（命名已终局，行本体保留）；组件区 GIF 替换（owner 提供 `button.gif` 拷贝制落
  `assets/button.gif` + alt「AeroUI 组件交互演示」，上轮产物 button-hover.gif 全仓引用面清零后删除）；
  在线演示真值 + TODO(owner) 注释删除。
- **npm 发布面元数据补齐**：author `FanXingYiDianYun` / repository（lib 公开仓）/ homepage（演示站）/
  bugs（仓库 issues）/ keywords（≤5 合理值）；license = MIT 核实。
- **构建脚本声明产物单源化**（R13 裁决 A′）：dist 对平发现 `vue-tsc --emitDeclarationOnly` 按
  tsconfig declarationDir=dist 嵌套出 `dist/src/**` 352 件 + `dist/vite.config.d.ts`（与
  vite-plugin-dts 顶层扁平 d.ts 双源并存，包面冗余死件）→ build 脚本改
  `vite build && vue-tsc --noEmit`（类型检查保留，声明产物单源 = vite-plugin-dts）+
  新守门 ⑩ dist-declaration-purity（guard 9→10，断言 dist/src 与 dist/vite.config.d.ts 禁在位）。

### Notes
- 开源就绪审计（J3）：秘密扫描工作树 0 真命中；git 历史 4 行命中逐条定性误报（POSIX 路径 + 第三方库
  lock 记录）；agent 痕迹 npm 发布面 0（dev 私面工具层 5 处列明未动）；发布面 gitignore 覆盖 ✓。
- 挂账更新：B 案 SKILL 英文化 / SKILL 指针依赖仓库 Release / lib ESM minify / 16 d.ts 序差 /
  registry locale 历史注释口径（延续）；AI_GUIDE_URL 占位面已清偿。

## [1.0.0-rc.10] - 2026-10-21（sync-audit RC-fix3-h 完善轮：README 完善主轴（内容勘误 + 兼容改造 + 组件区 GIF）+ LICENSE 与第三方许可审计 + header logo 放大 + Link demo 外链）

### Fixed（内容勘误，先取证后动笔）
- **README 版本线**：`1.0.0-alpha.1` → `1.0.0-rc` 预发布通道（与 package.json 实测一致）；版本策略节 alpha→rc 同步。
- **README 组件数**：104 → 102（registry-struct 实测 102；SKILL/ai-guide 面均已是 102，零联动）。
- **styles 导入统一**：以 exports map 为准统一为 `aero-vue/styles`（宿主实证：exports `./styles` 解析成功；
  `aero-vue/dist/styles.css` 直写 ESM 严格模式 = ERR_PACKAGE_PATH_NOT_EXPORTED）；ai-guide 词包 step1Code2
  同步（zh/en 各 1 行）；SKILL.md 旧注记倒置面 = 备案（SKILL 再生成轮修订）。
- **GitHub 通道仓名**：`<owner>/aero-ui` → `FanXingYiDianYun/aero-vue`（owner 拟定仓名定案，
  npm 包名与仓库名同名校正；`.claude-plugin` 目录在位核实）。

### Changed
- **README 兼容改造**：组件一览区 grid div（display:grid 双列内联样式）→ 纯 Markdown 表格两列
  （单元格内图片，GitHub 渲染 + 纯 MD 渲染器兼容）；`<div align="center">` 与内联 `<img>` 备案保留；
  语法审计复验 0 真错。
- **组件区 GIF 主视觉**：button hover + 明暗双主题切换 GIF（`assets/button-hover.gif`，84KB/640px/
  10fps/无限循环；纯 page 外部操控捕获，零代码改动）；旧 4 张组件截图删除（孤儿资产同步清理）。
- **header logo 放大**：演示站导航 logo 34×34 → 44×44（授权区间 40-48，导航栏 68px 内等比适配
  不溢出不换行；移动端同步 26→32）。

### Added
- **LICENSE 与第三方许可审计**：LICENSE = 标准 MIT（版权行署名 `FanXingYiDianYun`，owner 默认署名）；
  JetBrains Mono OFL.txt 随包缺口修正（build 插件补拷贝至 dist/，与 woff2 同目录分发，消费端可核许可）；
  第三方资产全盘点 = 来源不明 0。

### Notes
- 挂账更新：B 案（SKILL 英文化）/ AI_GUIDE_URL 占位 / SKILL 指针 GitHub 化依赖仓库 Release 创建 /
  lib ESM minify 决策面 / 16 d.ts 序差 / SKILL.md styles 旧注记倒置面（再生成轮统一修订）。

## [1.0.0-rc.9] - 2026-10-20（sync-audit RC-fix3-g 修复轮：SKILL 完整性重构（截断撤销 + 指针 GitHub 化 + 表头英文化）+ 品牌资产接入 + Link demo 外链统一 + README 语法审计 + 生产构建注释实证）

### Changed
- **SKILL 完整性重构（R12-4 改判：截断保留撤销）**：组件卡示例区移除 `script.slice(0,800)/tpl.slice(0,600)` 硬截断 →
  完整生成（单卡完整优先；半截代码比长卡更危险）；单卡体量 6KB 兜底上限（超限停上报，禁静默截断/全量）——
  实测 max 4877B 零触发。指针行改 GitHub blob URL（`…/blob/main/src/libs/ui/src/components/<key>/demo/basic.vue`，
  仓库 Release 创建后生效，拆仓路径变更时一次性再生成回填——与 AI_GUIDE_URL 同模式挂账）。事件表头「载荷」→ payload
  （结构区英文化收尾，60 卡全替换）。中文名行保留。SKILL 机械审计（围栏配对/指针 102/102/示例区闭合/体量分布）入 evidence。
- **品牌资产接入（H0）**：owner 提供 favicon/large/head 三件 SVG，拷贝制接入演示页 favicon + header logo +
  README 顶部横幅（image/ 暂存区不入库；demo-sources 零影响）。

### Added
- **生产构建注释实证工具**：`dist-comment-scan.mjs`（acorn token 流判据，区分活注释 vs 字符串内注释样文本）；
  `skill-integrity-audit.mjs`（SKILL 完整性机械审计）入 `scripts/hygiene/`。

### Notes
- Link demo 外链统一 aero-vue 仓（owner 授权，与 F4/R12-3 同目标）。
- README 语法机械审计 = 0 真错 + GitHub 特性备案 2 项（零改动合规）。
- 生产构建注释实证（H4）：demo 面 ≈0 业务注释残留（预期通过，所见注释 = dev server 特性，禁为 dev 配置删注释）；
  **lib ESM dist = 非 minify + 8 中文 JSDoc + 227 @__PURE__（rc.8 基线同形态 = 既有面，vite 5 lib 模式 build.minify
  默认 false；UMD 面 minified 单行）** → ESM minify/JSDoc 去留 = 构建配置决策面挂账 owner。
- 挂账更新：B 案（SKILL 示例区英文化全量重生成）1.0.0 前执行；AI_GUIDE_URL 占位 owner 定夺；
  SKILL 指针 GitHub 化依赖仓库 Release 创建；lib ESM minify 决策面（本轮新挂账）。

## [1.0.0-rc.8] - 2026-10-19（sync-audit RC-fix3-f 修复轮：Props 表全量恢复 + Events 说明列补齐 + mark 字重对齐 + 注释守门时序根因 + GitHub 链接统一 + SKILL 指针行/中文名行）

### Restored（事实源恢复）
- **Props 表全量恢复（F1/F1b/R12-1）**：registry-struct search 卡恢复源码 7 props（rc.6 越面删行根因 = RC-fix3-d D4，双根因记账）；F1b 全量审计（102 卡 vs 源码 defineProps/defineEmits/defineModel/withDefaults）42 缺行 + 1 事件行补齐入册，词包 42 props 描述键双语落地；复审计白名单外差异 = 0。
- 行数守恒判据入门禁（防越面删行第五次复发）：struct 行数 = 源码 props 数全量守恒（合并行/跨组件行白名单折算，`props-audit.mjs` v3 常驻 + `skill-struct-parity.mjs` struct↔SKILL 对平 102/102）。

### Added（新 prop / 新机制）
- **Events 说明列补齐（R12-2）**：审计器 v3 只比行/名称/类型/默认值，说明列空 = 检测盲区 → 新增 `desc-audit.mjs`（v4 说明列空检测，渲染态 dict ?? '' 口径）常驻；34 个空 events 说明点位（17 卡）双语补齐，全 102 卡说明列空 = 0。
- **SKILL 卡片指针行 + 中文名行（R12-4 修订版 C 案）**：`gen-skill-references` 机械注入「完整示例源码：src/libs/ui/src/components/<key>/demo/basic.vue」指针行（示例截断上限保留 = token 控制设计意图）+「中文名：X」行（数据源 = 侧栏 registry-zh title CJK 段，禁新造译名）；102/102 双行覆盖。
- 审计工具链固化：`props-audit.mjs`（v3 源事实审计，白名单文件驱动）/ `skill-struct-parity.mjs`（struct↔SKILL 对平）/ `desc-audit.mjs`（v4 说明列空检测）/ `r12-3-audit-a-href.mjs`（渲染态 a[href] 枚举）入 `scripts/hygiene/`。

### Changed
- **副标题 mark 字重对齐 Typography 样板（F2）**：`.pg-prose mark` 新增 `font-weight: 900`（样板 `.is-highlight` 双主题实测计算值；旧 RC-fix3-c「inherit 禁加粗」裁定被本轮裁决替代）；E1 擦条 / E3 滚入触发机制不回归。
- **注释守门⑦时序补强（F3）**：根因 = 写入先于⑦复扫（非词表/非范围，负例验证坐实）；对症 = 触碰⑦覆盖面即提交前复扫；「查看此代码」4 处存量注释定性 = 功能描述非对话痕迹（git 考古 3a177de/836c349），零动。
- **GitHub 链接统一（F4）**：站顶/announce/组件 demo/测试/SKILL 生成物 5 点位 → `https://github.com/FanXingYiDianYun/aero-vue`（owner 指定，仓库创建前指向不变）；渲染态全站 a[href] 枚举残留旧值 0。

### Notes
- SKILL 示例区英文化 + 全量重生成（B 案）挂账下轮 1.0.0 前执行。
- 交付链双守门（⑧prepack 防覆盖 / ⑨基线 sha 前置校验）续在位；rc.7 tgz sha 8f0f9c0f… 为 dist 对平基线。

## [1.0.0-rc.7] - 2026-10-18（sync-audit RC-fix3-e 修复轮：高亮擦条跨行修复（行片段友好机制）+ S4 推荐入高亮 + 滚入视口触发 + Search showOptionDesc 门控 + 移动端分类后缀移除 + 副标题 code→AeroTag 规格 + 注释门控固化 + sweep 超时 1500s）

### Added（新 prop / 新机制）
- **AeroSearch 新增 `showOptionDesc` prop（默认 `false`）**：结果副行渲染门控。
  `false`（默认）= 结果项仅主行组件名，任何状态下无副行（描述仍参与匹配召回，召回面不变）；
  `true` = 携 `description` 的结果项渲染独立副行（小字 dimmed + 命中位 `mark` 高亮，规格 = 既有
  `.aero-search__sub`：独立行 / font-size 0.8em / opacity 0.7）。单测 z1 系列更新（n/a/na 三态改传
  `showOptionDesc:true`）+ 新增 E4 双用例（默认关全状态无副行 / 开=副行+命中 mark+font-size 与
  color 计算样式区别于主行）；vitest 199→201 基线。
- **副标题高亮擦条改「行片段友好」实现**：`box-decoration-break: clone` + 元素自身 `background`
  底部擦条（`background-size 0% 0.3em → 100% 0.3em` 宽度擦入，`@keyframes pg-mark-erase`），替代旧
  单 `::after` 盒方案（跨行标记上条不渲染的移植缺陷，见下方 Changed）。跨行每行片段独立绘条，
  双主题终态一致。
- **擦条滚入视口触发一次**：`IntersectionObserver` 最小接入（进入 ai-guide 路由 / locale 翻转后先
  武装 `.is-armed`，滚入视口一次 → `.is-erasing` 播放 → `animationend` 回落终态；播放一次不重播，
  Typography 样本区/replay 零触碰）。
- S4 段落「推荐」/「recommend」入 `mark` 高亮（词包仅加标签、零改字；safeRich 白名单通道渲染）。

### Changed（演示站面 + 机制说明）
- **高亮擦条机制变更（向 owner 报告的机制变更，非 P4）**：E0 取证坐实旧 `::after` 单盒方案为参照
  `AeroTypography .is-highlight`（`inline-block`+`nowrap`，永不换行）设计；移植到可换行裸 inline
  `.pg-prose mark` 后，文字跨行时单盒被钉在 union box 底部 + 叠 `z-index:-1` → 条在跨行标记上不渲染
  （跨行实测 0 品牌色像素 vs 单行 601px）。E1 按任务书切换行片段友好实现（上条），最终视觉 = 所有者
  标准（高亮条在所有行片段可见）。Typography 组件本体（`.is-highlight`）与样本区零改动。
- 移动端搜索分类后缀移除（rc.5 移动端眼检痛点）：`searchOptions` 由 `description=组名` 改 `group=组名`
  + `group-by="group"`（D3 同款「描述兼作组键」解耦），每项结果只渲染组件名（±命中 mark），分组标题
  头保留；桌面端侧栏行为无回归。
- 副标题通道内联 `code` 视觉规格改 = AeroTag（`--ui-bg-tint` 底 / `--ui-brand-ink` 字 / 12px / 700 /
  `2px 9px` / `radius 8px` / mono）；作用域锁定 `.pg-desc`，`.pg-prose code` 旧规则与 CodeBlock /
  AI 段 / Typography 样本区零命中（演示全局层复制，lib 作用域哈希样式对 v-html 不可达）。
- 注释复发门控固化（第三次清扫 + 机制终止）：演示可见表面（playground + 组件 demo 的 `.vue`/`.scss`）
  过程注释强信号清零并入 guard 常驻任务（x1-exports-guard 6→7 用例）；run-all 门控同步。
- 基建：run-all sweep 步骤超时 1200s → 1500s（204 双视口全量遍历耗时增长）。

### 门控（本轮 G1-G15）
build / vitest 201（≥199）/ run-all 单次 7/7（新 1500s 超时）/ sweep 204 双视口全零 /
CJK 0·0 / guard 7/7 + 生成器二跑 diff=0 / 擦条几何断言双主题 + 截图 / 滚入采样 + S4 间距无回归 /
showOptionDesc 双状态 / 移动端双端断言 / pack 三源 + 冒烟同哈希 / locale 复验 / 截断清单冻结 / 定位表 / 冒烟同哈希。

### Added（Search 分组机制解耦：组标题与功能描述分离）
- `AeroSearchOption` 新增**可选数据字段** `group?: string`（与 value/label/description 并列；
  仅当 `groupBy` 指向该字段时渲染为组标题，**不参与匹配**——匹配面仍为 label/description 子序列，
  缺省 `group` = 不分组平铺，行为向后兼容；公共 props/events 签名零改动）。
- 组标题与 `description`（功能描述）解耦：组标题 = 分类（demo 走词包 `search.optGroup*` 三键
  表单/数据展示/导航 · Form/Data Display/Navigation），副行 = 功能描述（输入态显示），
  消除 rc.5「描述当组标题 / 描述两次」缺陷。

### Changed（演示站面：副标题通道断言修正 + S4 间距 + Props 表瘦身）
- 副标题 mark 通道断言修正（rc.5 断言通道错位三连教训）：G7 断言节点 = owner 眼检位
  （Typography 样板 + AI Skill 页 mark 双实例，`.pg-prose mark` 单源）双主题全等，
  副标题 mark 通道 vacuous 显式记账（组件页 0 节点为数据面事实）；P4「等效实现」废弃，
  改结构性差异白名单（animation-name scoped 哈希 / 字号档字重 / em 几何，注明结构理由，白名单外零豁免）。
- AI Skill 页 S4 盒模型区间距补位（段落/CodeBlock/正文段 16px 节奏，既有类上加规则零新 wrapper，
  双视口 911/390 无溢出）；S4 区入 G8 断言节点集（rc.5 G13 未覆盖 S4 节点的缺口补齐）。
- Search demo Props 表类型列瘦身：options 行类型列 = `AeroSearchOption[]`（纯类型信息），
  行为说明移描述列一句话（registry-struct 第 4 元素，SKILL 生成器同步 4 列渲染，仅 search 卡生效）。

### 挂账（只统计禁修，owner 拍板时机）
- SKILL references 生成卡截断清单（32/102 卡示例区 800/600 字符截断 = 生成器设计行为，
  非损坏；typography/tooltip 重点复核坐实）。

## [1.0.0-rc.5] - 2026-10-17（sync-audit RC-fix3-c 修复轮：Search 显示重设计（主副行翻转）+ 描述词包化 + 副标题高亮擦条 + kbd 间隙 + AI Skill 页重写 + demo 源净化）

### Changed（Search 显示重设计：主副行翻转，text 机制移除）
- `AeroSearchOption` 移除 `text` 可选字段（rc.4 引入的双数据面机制撤除，
  该特性未被接受）；`description` 语义升级为「功能描述」（替代原英文分组标签），
  全量 demo 数据走词包 `search.opt*Desc` 键（zh/en 双语），禁硬编码。
- 双行渲染翻转：主行 = `label` 恒定（命中位 `<mark>`），副行 = `description`
  （小字 dimmed，query 非空时统一显示，命中位 `<mark>`）；query 空 = 仅主行。
  副行复用组件 scoped `.aero-search__sub`（0.8em / opacity 0.7 / 独立行 /
  margin-top 2px），零新设计令牌。
- **匹配算法（fuzzyMatch 子序列打分）、props/events 公共 API 签名零改动**
  （`AeroSearchOption` 数据面收窄：旧携带 text 的数据字段被忽略，text 本为
  rc.4 新增未发布面，无兼容负担）。
- 单测 `z1-search-dual-line.spec.ts` 按新双行行为等量重写（4 例，只增不删）；
  SKILL 组件卡 `search.md` 同步（text 说明删除 + 双行行为说明，
  registry-struct → gen-skill-references 生成器链路）。

### Added（副标题富文本通道视觉升级，demo 演示站面）
- 副标题通道 `mark` 高亮升级为 Typography「高亮词」擦条样式（实色 `--ui-brand`
  擦入条 + `ui-wipe-in` scaleX 动画 + z-index 堆叠复刻），替代旧 16% 淡擦平铺；
  字重 inherit（不加粗），mount 触发一次；双主题计算样式断言与样板对平。
- 副标题通道 `kbd` 水平间隙 `margin-inline: 0.35em`（作用域锁副标题容器，
  不波及 Typography 页 flex gap 观感）；相邻 kbd 视觉间隙 ≥8px。

### Changed（AI Skill 页整页重写，demo 演示站面）
- 四区块结构（简介 / 快速开始 / 手动安装 / 盒模型须知），文案全走站点词包
  `aiGuidePage` 组（zh/en 双语）；旧「两通道安装」键下线，手动安装 =
  两步（npm i aero-vue → 拷 skills 目录）。

### Changed（demo 可见源码净化 + Props 表修正）
- 演示站/词包/组件 demo 源中过程性注释（轮次 token / 修复叙事 / 自我提醒）
  清理，保留产品必要注释；Search demo Props 表与 `AeroSearch defineProps`
  源码对平（6 props，text 不再出现，limit 默认 12 如实）。

## [1.0.0-rc.4] - 2026-10-16（sync-audit RC-fix3-b 修复轮：Search 双数据面 text 字段 + description 命中双行 + 侧栏命中限 1 条 + 副标题补句 + 空态截断修正）

### Changed（Search 双数据面：text 字段 + description 命中双行渲染）
- `AeroSearchOption` 新增**可选**数据字段 `text`（展示文案，缺省回落 label）——
  options 数据面扩展，**非组件 prop**；props/events 公共 API 签名零改动，向后兼容。
- description 命中项双行渲染：主行 = description（命中位 `<mark>` 高亮），
  副行 = `text`（缺省回落 label）；label 命中项保持单行。副行 = 组件内 scoped
  新类 `.aero-search__sub`（12px / `--ui-ink-3`，li 级 is-focus/hover 背景整项
  覆盖副行），零新设计令牌。匹配算法（子序列打分）、`limit` 默认 12、
  空态行为均未动。
- demo `basic.vue`：anchor/collapse 携 `text`（独立词包键 `search.optAnchorText`=
  「锚点」/`search.optCollapseText`=「折叠面板」，en 对应）；affix 不携 text →
  副行回落 label（缺省验证）；其余 7 项不动。
- 新增单测 `tests/z1-search-dual-line.spec.ts`（3 例：n 态 desc 双行 + 回落 /
  a 态全 label 无副行 / na 态双命中双行，只增不删）。
- 文档同步：SKILL 组件卡 `search.md` options 类型标注补
  `{value,label,description?,text?}；text=可选展示文案…`（registry-struct → 生成器链路）；
  `docs/api-matrix.md` 粒度 = 组件级 props 清单（text 非组件 prop，不在其记录粒度，
  未同步，本行判读留档）。

### Changed（demo 侧栏：分组命中项最多展示 1 条）
- `App.vue filteredGroups`：query 非空时命中组只取 1 条（key 子串命中优先，
  无则 title 子序列首个），侧栏空间受限；无命中分组滤掉（维持）；
  侧栏内联搜索命中高亮（em.pg-hl）维持现状。AeroSearch 组件零改动。
- 行为变化记账：此前侧栏 q=n 展示 32 项（全量匹配数），现 7 组各 1 条
  （显示数 7）——32 → 7 为本轮 Z2 引入的**目的性显示行为变化**（侧栏限 1 条），
  非回归；匹配判定面（fuzzyHit）未动。

### Changed（副标题词包补句）
- Search 副标题追加「description 命中双行显示」（zh）/「description hits render
  on two lines」（en 意译）；「命中 mark 高亮」宣称维持原句（机制下成立：
  高亮落点 = 命中级文本 = 实际显示文本）。排版标签规则照旧（特性词 code）。

### Fixed（空态截断修正，R6-2）
- demo `basic.vue` 删除 `:limit="8"` 传参（demo 层）：此前空态 = 前 8 项截断
  （10 项 options 中 anchor/collapse 被丢，NAVIGATION 组只见 Affix），与空态提示
  句「空输入显示全部」直接矛盾；删参后 basic 零配置 limit，走组件默认 12 →
  空态全量 10 项（NAVIGATION 组三项齐全），提示句原文维持不动。
- **推翻记账（P3 如实）**：RC-fix2 X3 定性 A 的「空态全量」前提当时不成立
  （带 `:limit="8"` 实为 8/10 截断），本轮修正；宽召回匹配策略本身维持，
  宽窄归 owner 待拍板（挂账）。

### Gates（RC-fix3-b，run-all 全量）
- build / vitest 全量只增不删 / sweep 204 双视口全零（双行副行 + 侧栏 1 条
  = DOM 变更，禁豁免全量照跑）/ CJK 0·0 / 生成器二跑 diff=0 / guard 6/6 /
  pack 全树清点 / sha256 三源一致。

## [1.0.0-rc.3] - 2026-10-16（sync-audit RC-fix2 微轮：box-sizing 官方口径反转 + 富文本行内元素全局单源 + Search 召回定性 A + 空态说明）

### Changed（box-sizing 官方口径反转，X0 全项目统一）
- **官方立场反转 = 推荐宿主加标准全局重置**（owner 裁决，全部落点原文照抄）：
  「推荐在你的项目中使用标准全局重置：`*, *::before, *::after { box-sizing: border-box; }` +
  `body { margin: 0; }`；aero-vue 组件已逐元素声明 border-box，在有无全局重置的宿主中均实测零几何
  漂移——添加与否都不会破坏组件；添加可获得更正规的页面排版基线。若遇组件几何异常，请先升级
  aero-vue 版本排查，勿以临时样式补丁掩盖问题。」
- 落点（改前 grep 命中清单 + 改后复扫旧口径字样 = 0，双向自证明 evidence）：
  `skills/aero-vue/SKILL.md` 坑区 + 错误对照表 / `src/libs/ui/AGENTS.md` box-sizing 节 /
  `README.md` AI 小节豁免一句（范围锁死，其余一字不动）/ demo AI Skill 页盒模型段（词包 zh/en
  意译 + 代码块排版走 AeroCodeBlock，同两通道安装惯例）/ references 内无 box-sizing 旧口径提及
  （grep 复核 0 命中，含 theming.md）。历史文档（CONTEXT / audit-index / 归档区 / CHANGELOG 旧节）不改。

### Changed（富文本行内元素样式统一，X1 裁定 C：demo 全局单源）
- 副标题/AI Skill 段/Typography 示例的 `<kbd>`/`<code>`/`<mark>`/`<em>` 此前为 App.vue 两处
  `:deep()` **平行自建**（与 Typography 演示页 scoped `.kbd` 值/变量各选不同——根因 = 平行自建，
  getComputedStyle 明暗双主题机器取证坐实）。
- 修复（demo 层，库组件/非 demo 源文件零改动）：四标签规则收敛到 demo 全局样式层单源
  `.pg-prose`（style.scss）：`kbd` ← Typography 原 scoped `.kbd` 整条规则值（副标题侧升级：
  12px/600/--ui-bg-soft 芯片 + color 补齐 --ui-ink 拉平通道差异）；`code`/`mark`/`em` ← 副标题
  现值【零变化迁移】（code 保留 bg-soft 芯片、mark 保持 16% 品牌色擦——非浏览器默认）。
  Typography demo 源 `basic.vue` 的 scoped `.kbd` 块删除 + 示例容器挂 `.pg-prose` 类（R3 放行面：
  仅 demo 源文件样式块，迁移非复制，grep 双向清零）；App.vue `:deep` 四规则删除 + 三容器挂类。
  `code` 选择器排除 AeroTag 组件内部 `<code class="aero-tag">`（芯片观感零变化，P12 防线）。
- 验证：计算样式断言脚本 `scripts/x1-rich-inline-assert.mjs`（全通道逐属性，明暗双主题，
  每调用独立 MCP 会话 + 跨文档导航稳态驱动）fail=0：kbd（Typography 2 + 副标题 4）/code（副标题 2）
  /mark（AI Skill 1）distinct 签名均 = 1；em 无实际通道 = vacuous。
- 记账（R3-4）：`basic.vue`（lib 侧 demo 源文件）自此依赖 demo 站全局样式，属跨层耦合，
  T 轮拆仓时知悉（本轮无动作）。dist 对平门禁：bundle 零 demo 内容波及，唯一变化 = 本节
  Fixed 的 `search.hint` 词包键（构建确定性二跑一致）。

### Fixed（Search 召回机制三定性 = A 设计如此，X3 + R2-A 授权轻改）
- owner 场景（空态全量 + n 宽召回）双通道机器取证：
  - AeroSearch 组件 demo：空 query = 全量原序展示（源码明示「召回全量」）；q=n 宽召回 4 项
    （Affix/Collapse via description 组名 "Navigation" + Anchor/Button via label），高亮字段 =
    命中字段（`hits` 与 `text` 同 via 来源），一致无缺陷。
  - 站点侧栏：q=n 召回 32 项，高亮全落 title；全量 102 项 a-z 逐字母枚举「仅 key 命中
    （title 无命中）」项 = 0 → 副标题「命中 mark 高亮」宣称在本数据面失配 = 0。
- 定性 = **A（设计如此）**：空态全量 + 子序列宽召回 + 高亮全覆盖。匹配算法（子序列打分）、
  AeroSearchOption 公共 API、Search 组件 placeholder/空态行为/组件内文案 = 零改动。
- 授权轻改（demo 层）：Search demo 示例区新增空态说明句（词包 `search.hint` 键 zh/en 双语）：
  「输入以筛选，空输入显示全部」/「Type to filter — leave empty to show all components」。
  验收：`batch-components --only search` PASS + MCP 双通道复测。

### Gates（X5，全绿）
- build.sh --demo / vitest 只增不删 / sweep 暗色双视口 204 全零 / CJK 0·0 / run-all.mjs 全绿 /
  X1 计算样式断言双主题过 / X0 改向复扫清零 / guard 6/6 / pack 全树清点 / demo-sources 变更清单
  （typography + search 两条目重生成）。

## [1.0.0-rc.2] - 2026-10-15（sync-audit RC-fix1 微轮：Search 键盘导航修复 + AI Skill 页修正 + CodeBlock 副简介重写 + 全站副标题 Typography 美化 + .claude-plugin 口径统一）

### Fixed
- **AeroSearch 键盘导航高亮（W1 定性 B → 分支乙）**：修复前键盘 ↑↓ 在**分组分支（demo 默认
  `group-by="description"`）无视觉高亮**（li 缺 `:class is-focus` 绑定），且 style 块无 `.is-focus`
  视觉规则（非分组分支绑了 class 也无效果）——仅状态机在（Enter/Esc 生效）。
  最小修复（预授权边界内，仅 Search 键盘交互面，禁改 props/events 公共 API）：
  - 分组分支 li 补 `:class="{ 'is-focus': shown.indexOf(h) === focusIdx }"`（+1 行）；
  - style `&__item` 规则 `&:hover, &.is-focus` 共享视觉态（复用 hover 同款 `--ui-bg-tint`/`--ui-brand-ink`，
    零新设计令牌，+3 行）。
  - 验收：MCP 复测 4 判据全 ✓（↑↓ 高亮移动 / Enter 选中 / Esc 关闭 blur）+ 新增
    `tests/w1-search-keyboard.spec.ts`（2 例，分组+非分组双分支，jsdom 补 scrollIntoView 桩，只增不删）
    + batch-components `--only search` PASS。

### Changed（demo 文案/视觉修正，npm 面仅 Search 组件 1 处修复）
- **AI 指南页 → AI Skill 页（W2）**：入口/页题「AI 指南」改「AI Skill」（zh/en 词包同步）；
  box-sizing 段换任务书原文（富文本值：`box-sizing: border-box` 走 code、两条核心警示走 mark 高亮，
  排版吃狗粮走库 `AeroTypography`）；两通道代码块补垂直间距（`.pg-ai-channels` flex column + 14px gap）；
  one-liner 改**运行时插值**（词包 `oneLiner: (u) => …`，`App.vue` `oneLinerText` computed 填
  `AI_GUIDE_URL` 单源常量 → 渲染/复制均显示常量当前值，禁字面 `{AI_GUIDE_URL}` 花括号；
  Release 改 `ai-guide-url.ts` 即全局换真值）。
- **CodeBlock 副简介重写（W3）**：旧「奶油软糖窗 + 和纸胶带 + 迷你语法高亮 + 可折叠」与实现脱节
  （无该视觉概念）→ 重写为现实现特性清单（2px 描边代码窗 + `highlight`/`lineNumbers`/`copyable`/
  `collapsible`，特性名 code 排版；核对证据入 `w3-codeblock-old-vs-new.txt`，禁描述不存在特性）。
- **全站副标题 Typography 美化（W4，机械规则制）**：102 副标题逐条过规则——按键/快捷键→`<kbd>`、
  组件名/标识符/代码值/单位→`<code>`、每条至多 1 个 `<mark>`（仅 search 既有 1 个并修正为
  `<code>mark</code>` 消除裸开标签）、无合适元素保持纯文本（改动面 118/204，宁少勿多）。
  渲染通道：副标题唯一走 `App.vue <p class="pg-desc" v-html="safeRich(desc)">`；新增最小白名单富文本
  通道 `safe-rich.ts`（`kbd/code/mark/em` 四标签 + 全量先转义机制——非白名单标签/事件属性不可能复活；
  内容源全为库内词包非用户输入 → 无 XSS 面，不引 DOMPurify）。纯文本条目经 safeRich 原样透传不受影响。
- **.claude-plugin 标识口径统一（W5，悬置①收案）**：`marketplace.json`/`plugin.json` 的
  `aero-ui` → `aero-vue`（GitHub 面，不入 npm 包面；`files=[dist,skills]` 已排除，pack 白名单维持 0 混入；
  品牌名「Aero UI」未动）。

### 门禁（RC-fix1 GATE，分支乙）
build.sh --demo 全绿（vue-tsc 0 / vitest 22 文件 194 用例只增不删 / 库 + 演示站 build）· 生成器二跑
diff=0 · x1-exports-guard 6/6 · CJK 库 0 / 站点 0 · overflow-sweep 204 双视口全零（DOM 有变更禁豁免）·
npm pack 全树清点（skills 108 件 / 顶层 6 类 0 混入 / dist 核心在位）· run-all.mjs 7/7 全绿 ·
batch-components 全 102 PASS（患 0）+ `--only search` PASS · 交付
`/home/ztk/aero-vue-1.0.0-rc.2.tgz`。

## [1.0.0-rc.1] - 2026-10-15（sync-audit RC 轮：命名迁移 + 测试基建 + 全组件体检 + 演示页 AI 指南页 + README 轻润色，组件逻辑零变更）

### Changed（命名迁移 @aero/ui → aero-vue）
- **包名 / 依赖 / import 全量迁移 `@aero/ui` → `aero-vue`**（scoped 标识符，非组件逻辑）：
  - lib `package.json` `name` + demo `dependencies` 双侧同步（demo 沿用 `file:` 协议，循 04-pitfalls 先例非 `workspace:*`）；
  - 全部 `import { … } from 'aero-vue'`（102 组件 demo 源 + 测试 + 演示站 + 生成器源）、vite alias、resolver `from`/`sideEffects`；
  - 3 生成器源同步后重跑覆盖产物（demo-sources.generated.ts / mount-smoke + interaction / 102 skill 组件卡）。
- **skill 目录 `skills/aero-ui/` → `skills/aero-vue/`**：目录名 + `SKILL.md` frontmatter `name: aero-vue` + 全部内部引用路径 + AGENTS×2 / README cp 命令路径 / `x1-exports-guard`⑥ 路径 / `scan-junk` / `gen-skill-references` outDir；description 触发词同时含「Aero UI」与「aero-vue」。
- **保留原名（历史 + 运行时，未误伤）**：
  - dist 产物名 `aero-ui.js` / `aero-ui.umd.cjs`（vite `fileName` 定，与 npm 包名解耦；`health-check` 检产物名保留）；
  - 运行时 localStorage 键 `aero-ui-theme` / `-preset` / `-brand` / `-motion`（`use-theme`/`use-motion` 组件逻辑）；
  - JS 命名空间 `AeroUI` / 组件名 `Aero*` / Release 仓名 `aero-ui-view`；
  - `.claude-plugin/{marketplace,plugin}.json` 标识 `name: aero-ui`（H5 市场/插件标识，超 R0-3 字面范围，保守未改——**已知不自洽点，owner 判读**）；
  - 历史文档 `docs/audit-index.md` / 归档区 / 本 CHANGELOG 各历史节保留 `@aero/ui` 原名记录。
- `AI_GUIDE_URL`（`PgNav.vue`）：原 npm 包页值删除（语义已错——他人包名），改占位 `''` + 注释「Release 填 lib 公开仓真值」；RC 起挪单源 `ai-guide-url.ts`（header + 页共用防漂移）。

### Added
- **测试基建 `scripts/test/`（主仓层，不入 npm 面）**：
  - `paths.mjs`：单源路径配置（T 轮「一带二嵌套子仓 + paths 单源迁移」预留，届时只改此一文件）；
  - `run-all.mjs`：7 步一键编排（build.sh --demo → vitest → 生成器二跑 diff=0 → x1-exports-guard 6 → CJK 双扫 → sweep 暗色双视口 204 → npm pack + 解包全树 find 清点 + sha256），逐项 ✓/✗ + 各步耗时 + `--skip <step>` + 异常非零 exit；
  - `batch-components.mjs`：全组件批量机测（CloakBrowser 8931 单实例，`registry-struct` 程序化读 102 key 禁手抄；逐组件裸宿主冒烟 = 渲染存在 / 控制台 0 错 / 几何 sane / 明暗主题翻转不炸；`--only` 单件重跑 P4 隔离；结果 JSON 落 `state/` 守大文件 P1）。
- **演示页 `/ai-guide`（R4b）**：站点级 AI 开发助手指南页（hash 路由特判；复用现有 `pg-` 样式类 + `AeroCodeBlock` copyable 自带复制，零新配色/图标/样式类）——one-liner 复制块（zh/en 词包，文案「请阅读 {AI_GUIDE_URL} 并按照说明，为我的项目安装 aero-vue 组件库与配套 skill」）+ 两通道安装命令 + box-sizing 坑区段 + 查看完整文档外链（`v-if AI_GUIDE_URL`）；header「AI 指南」入口由外链改站内 `#/ai-guide`。词包归属 = 站点词包 `aiGuidePage` 组（站级页渲染在 `AeroConfigProvider` 外，循 H7 判据落组防死键）。
- **README AI/Agent 小节 one-liner 复制块**（与 `/ai-guide` 同文案，`{AI_GUIDE_URL}` 占位）；安装命令全改 `aero-vue`（cp 路径 `skills/aero-vue`）。

### Changed（README 轻润色，解冻仅本节）
- 组件一览 4 图堆叠 → 2×2 网格（inline grid 排版微调，零新增图）；
- badges：动态「真值」徽章（npm 版本/下载量）注释占位（Release 拆公开仓 + npm 发布后启用，禁发布前挂死链图）；
- GitHub 通道加免责注释（`aero-ui` = lib 仓名/.claude-plugin 市场标识，R0 保留项；npm 包名是 `aero-vue`，二者不同名）。

### 门禁 / 体检
- `x1-exports-guard` 6/6（含⑥ skill 自洽，路径随目录迁移同步）；CJK 0·0；生成器二跑 diff=0；
  `npm pack` 全树清点 = skills 108 件（SKILL 1 + 手写 refs 3 + 组件卡 102 + templates 1 + scripts 1）+ 顶层 tests/docs/reports/AGENTS/.claude-plugin 0 混入；
  sweep 暗色双视口 204 全零。
- **全组件体检（batch-components 全量首跑）**：102 组件裸宿主冒烟 **PASS 102 / 患 0**（渲染 / 控制台 0 错 / 几何 sane / 明暗翻转不炸，预期 0 患达成）。

## [1.0.0-beta.4] - 2026-10-12（sync-audit Beta-4 轮：零组件码变更——SKILL 全套 + 卫生脚本 + README 图文 + demo AI 入口 + npm 白名单扩展）

### Added
- **SKILL 全套（居 `src/libs/ui/skills/aero-vue/`，随包分发）**：
  - `SKILL.md`：agentskills.io frontmatter（`name` + `description` 触发词，版本适用 ≥1.0.0-beta.4）；
    正文 <200 行——起步 5 行（装包 → `import '@aero/ui/dist/styles.css'` → 具名 import）、组件选择地图、
    box-sizing 坑区（宿主勿加全局 reset）、≥6 条错误对照表、references 索引、硬约束。
  - `references/components/*.md`（**102 组件卡**）：由 `scripts/gen-skill-references.mjs` 从 registry-struct
    真源派生（props/events/最小示例，杜绝手抄幻觉），纳入生成器门禁；`locale.md`/`theming.md`/`playbooks.md`
    手写；`templates/starter.vue` 最小可挂载（裸宿主可跑）。
  - `scripts/list-components.mjs`：agent 可执行列 102 组件（跑脚本优于读长文）。
- **卫生检测脚本（主仓 `scripts/hygiene/`，不入 npm 面）**：
  `scan-junk-files` / `scan-junk-comments`（复用 Y3·x4 状态机）/ `audit-diff-whitelist` / `run-hygiene`（一键汇总 exit code）；
  只检测出报告、禁自动删除。
- **README 图文节**（`src/libs/ui/README.md`，冻结豁免 = 本节 + AI 小节）：
  组件一览 4 图（`assets/` 明/暗/移动端 MCP 截图）+ AI/Agent 小节（skill 两通道 npm/GitHub + box-sizing 提醒）+ Release 注记。
- **demo AI 入口**（演示站 header `.pg-actions` 链接行）：复用 `.pg-gh` 样式 + `sparkles` 现有图标（零新配色/图标），
  文案走站点词包 `nav.aiGuide`（zh/en 键对），目标 = `AI_GUIDE_URL` 常量占位（Release 填真值）。

### Changed
- **npm 白名单扩展**：`files: ["dist"]` → `["dist", "skills"]`（skill 随 npm 面分发）。
- **x1-exports-guard 扩展**（2 → 5 项）：新增 files 含 skills / SKILL.md frontmatter 非空 / box-sizing 坑区段在位；
  全量 vitest 21 文件 188 → 191 用例（只增不删）。
- **AGENTS.md 双件**：`src/libs/ui/AGENTS.md`（库正典，<60 行）+ 工作区根薄指针。
- **.claude-plugin/**（`src/libs/ui/`）：`marketplace.json` + `plugin.json`（字段依 Anthropic 官方 schema），
  本地路径安装验证通过（GitHub 远程安装留 Release 拆公开仓后跑）。

## [1.0.0-beta.3] - 2026-10-12（sync-audit Beta-3 轮：轮播家族宿主盒模型错位修复）

### Fixed
- **轮播家族宿主盒模型错位（Beta-0 Q3 勘误：由「纯环境性」改判「确定性缺陷」）**：
  mobile-carousel 与 carousel 的 slide 定宽靠 `flex: 0 0 100%` + 自带横向 padding，
  宿主无全局 `*{box-sizing:border-box}` 时（UA content-box）slide 实宽 = 采样宽 + 40px
  （padding 外扩），翻页逐页累积错位（第 2 页残留 40px / 第 3 页 80px，实测）；
  carousel slot 注入变体的宿主内容（库 deep 规则 `width:100%`）同型右偏。
  修复 = 3 处 `box-sizing: border-box` 声明（mcar `__slide` / carousel `__slide` /
  carousel `is-plain > :deep(*)`），几何值与翻页算法零改动；裸宿主与 reset 宿主
  双测 70 条全零（G1/G2 带仪表复现，CloakBrowser MCP）。

### Changed
- 全库「JS 量测布局」审计（v4 判据，30 量测点）：29 点自洽（量测实盒、宿主无关），
  1 点有患评估不修（slide-go `max()` 公式：knob 实宽宿主差异仅影响行程归一化映射，
  终点宿主无关）；轮播家族为全库唯一「定值几何 + 宿主盒模型驱动布局」组合，无第 4 处需补。
- box-sizing 非继承机制勘误注记（承 Beta-2）：本轮坐实「宿主 reset 掩盖库内声明缺口」
  的第二实例（Switch 被掩盖两轮 / 轮播家族本轮），声明责任在库、不转嫁宿主。

## [1.0.0-beta.2] - 2026-10-11（sync-audit Beta-2 轮：边框盒语义修复——box-sizing 非继承机制勘误）

### Fixed
- **Switch track 边框盒语义修复（R2 定案）**：裸宿主（无全局 `*{box-sizing:border-box}`
  reset）下 `.aero-switch__track` 实测 52×31（content-box 语义，48×27 content + 2×2 border）
  且旋钮不居中 → `.aero-switch__track` 补 `box-sizing: border-box`，裸宿主恢复 48×27 且
  旋钮居中。几何值（48/27/border 2px/knob）零改动。

### Changed
- **内层定几何元素全量重审（box-sizing 非继承机制勘误）**：B2 轮 border-box 仅落根类，
  罩不到内层「定值 width/height + border/padding 共存」元素（box-sizing 非继承属性，
  演示站全局 reset 曾兜底掩盖缺口）。本轮以「box-sizing 非继承」为机制前提重审全部
  选择器（根类/内部类/::before/::after/原生控件伪元素），补声明 17 处（switch __track +
  内层 15 + slider 原生控件伪元素 2），另 2 处（spinner sm/lg 修饰类）经核实为根类
  同元素叠挂、已有声明覆盖（书面理由存证）。全库对账 box-sizing 134 次出现
  = border-box 132 + content-box 2（code-block 有意值）。

### Note
- **机制勘误注记**：组件几何确定性依赖「宿主提供 border-box 环境或逐元素自带声明」；
  库内层定几何元素已逐元素声明，无需宿主 `*{box-sizing}` reset（防宿主污染，不塞全局
  reset 进库 styles）。

## [1.0.0-beta.1] - 2026-10-10（sync-audit Beta-1 轮：修复 Alpha 详测遗留 + 几何确定性）

### Fixed
- **Menu 折叠态激活指示条动画**：折叠态内切换 active 项时共享滑动指示条恢复 CSS
  过渡平滑滑动（此前 watch 入口把「当前折叠态」误当「折叠切换帧」，折叠态内所有
  active 切换被无差别即时定位）。仅折叠⇄展开切换那一帧保持即时定位（防追赶容器
  0.25s 宽度过动画），ResizeObserver 触发帧维持即时定位；指示条几何 3×16 品牌色不变。
  （n3-menu.spec.ts 补 1 回归用例，全量 vitest 21 文件 188 测试）

### Changed
- **组件根类边框盒语义全量声明（几何确定性）**：全部 103 个含 .aero 根盒组件的根类
  顶层块补 `box-sizing: border-box`；定值几何 + border 共存的内部类 5 处一并声明
  （action-buttons / loading spinner / steps 2 处 / tree check）。纯防护性消歧义，
  非行为变更——宿主 content-box 环境下组件定值几何（如 Switch 48×27）不再随
  box-sizing 漂移；演示站 204 页 sweep 全零（零视觉漂移）。

### Docs
- MobileCarousel 陈旧注释勘误（「桌面宿主充足时取 330px 定宽」与实态脱节，
  330 实为 demo 的 max-width，组件宽度由宿主容器决定）——现状式改写，逻辑零改动。
- demo 注释终态核验：105 demo 源 + generated 复制源 a 类对话痕迹 = 0，无补清。

## [1.0.0-alpha.1] - 2026-10-09（sync-audit Y 轮：Alpha 收口——注释定向清洗 + 死键删除 + 发布面终验）

### Changed
- 全库注释定向清洗（Y3，in-scope 373 文件）：删除流程路标/轮次标记/修复过程记/教学旁注
  与 owner/外部归因字样（33 条归因逐条 R1-R4 处置）；API JSDoc 与架构说明保留，
  技术数值/默认值/行为语义零改动；marker 263→0，对话归因注释区命中归零。
- OBS-4 死键 4 条（common.noData / demo.menu.about / demo.parallaxBox.comment /
  demo.themeProvider.globalBadge）动态模板串复查 0 命中后 zh/en 同删。
- npm 发布面终验（Y5）：`files: ["dist"]` 白名单确认——包 610 文件全部在 dist/
  （组件/样式/字体/类型）+ npm 固有 3 件套；tests/、reports/、docs/、演示站 0 混入；
  tgz 解包冒烟（主入口/./styles/README/package.json 在位）+ x1-exports-guard 2/2 全绿。
- 版本定档 0.1.0 → 1.0.0-alpha.1（预发布通道，API 可能随 Beta 调整）。

### Docs
- README v3 逐字落盘（外部交付制）：版本线 `1.0.0-alpha.1`、104 组件口径、
  安装/快速上手/主题/国际化/许可证；hero 与架构图维持注释 + 占位行（图片随
  Y4b 流程入库后启用）；旧 v2 存证于 Y-cleanup evidence。

## [0.1.0] - 2026-10-07（sync-audit V 轮：size 阶梯重定 lg 88×44 + demo 双向同步）

### Changed
- **theme-switch size 阶梯重定（V1，owner 外部重定值）**：lg 档 `--_h:44px/--_w:88px/--_knob:30px/icon16`；
  inset 与位移按 T4 既有公式自算（inset=(44-4-30)/2=5、位移=88-4-30-10=44）。取 88 而非 80：须与 md 72.2
  明显拉开档差，防「看着一样大」三审。sm 36×20/knob14/icon10 与 md 72.2×38 现状一像素不动（①基础默认=md，
  owner 冻结连带冻结）。U1 guard 教训已吸收（先报后动，不再蒙改）。MCP 实测严格递增 36<72.2<88；①开关
  before/after 恒等 72.2×38。registry-zh/en size 描述键改中性表述「sm 36×20 · md 72×38 · lg 88×44」（删
  「（现状）」内部措辞）；t4 spec 用例名注记 V1 几何值（jsdom 无布局引擎，断言仍类名）。commit 45abaae
- **theme-switch demo 双向同步（V2，修 U1「只出不进」病）**：单一共享状态 `pageTheme = ref(state.theme)`——
  初始化只读不写（固化规则：禁加载期写服务，U1 踩过 immediate 强写冲掉持久化的坑）；推向 watch(pageTheme)→
  setTheme(v)（U1 既有保留）；回流 watch(state.theme)→pageTheme（不等式守卫防回声循环）。②受控/③三枚尺寸/
  ④示例开关全部 v-model="pageTheme"；@change 统一 onThemeChange 进 ⑤ 日志（删各自零散消费 watch ctrl/sizeVal/
  disVal）；④禁用仍由 disSwitchOn 独立控制（disabled 只锁交互不锁显示，旋钮仍随 pageTheme 呈现）。①段代码与
  ThemeSwitch 组件本体零改动。验收全过：fresh nav 加载态五段一致（before=U1 病症复现留证）；点①/②/③任一枚
  全段跟随；④禁用中其他照常+解锁恢复；日志含②③④来源事件顺序正确；pull 路径经导航栏切主题实测跟随。commit 9c44e27

## [0.1.0] - 2026-10-07（sync-audit U 轮：ThemeSwitch demo 交互打通 + size 几何核查）

### Changed
- **theme-switch demo（U1 三段重接线，撤 T4 demo 死开关缺陷）**：外部撤销声明——T4 ②③④
  死锁系外部规格未定真实接线。②受控段增消费方逻辑 watch(ctrl)→useTheme().setTheme(v)
  （与①同源主题服务，撤 immediate 防加载期强写全局）：点击后 v-model 值/显示值/全局
  主题三处同步变；hint 改新键 themeSwitch.hintControlled（①旧 hint 不动）。③尺寸段
  三枚全改绑共用 v-model（点任一枚三枚联动翻转）。④禁用段示例开关绑独立值 disVal
  （disSwitchOn=false 可正常切明暗，true 才锁定）。①⑤段与禁用视觉 token 零改动；
  顺手删 demo 源码 J5A.4 陈旧注释标记。commit 4eaef5f

### Docs
- **theme-switch size 几何核查（U1 先报后动，guard 触发保留现值）**：MCP 暗色视口实测
  sm 36×20/knob14/icon10、md 72.2×38（现状）/knob26/icon14、lg 56×30/knob22/icon16。
  「md 大于 lg」定案 = 非映射错位，系 T4 外部定死 lg 绝对值(56×30)小于 md 现状(72.2×38)，
  倒挂自 T4 即存在。owner 拟 lg 64×34/knob26/icon18，但 guard「md 现状≥64×34→停下报备」
  触发（72.2×38≥64×34）→ 保留现值不蒙改、如实上报；md 现状值报入 registry-zh/en
  size 描述键。待 owner 重定 lg（须 >72.2×38）或明示接受现状。commit 4eaef5f

## [0.1.0] - 2026-10-06（sync-audit T 轮：Announce actionHref + CodeBlock 按压现代化 + ThemeSwitch API 扩充 + Tree includeParents 即时生效）

### Added
- **announce（T1 actionHref，owner 授权解除组件本体冻结）**：新增 props.actionHref?: string。
  提供 → action 槽外层渲染真实 `<a :href="actionHref" target="_blank" rel="noopener
  noreferrer">`（新标签打开）；未提供 → 逐字保留现行为（href="#" + click preventDefault，
  零回归，撤 S7 死链方案）。demo 接入真实链接。vitest +2。commit 2e37d32
- **theme-switch（T4 API 扩充，owner 授权新增 props/events）**：props modelValue?: 'light'|'dark'
  （受控 v-model，controlled = modelValue !== undefined）、disabled?: boolean = false、
  size?: 'sm'|'md'|'lg' = 'md'（md=现状；sm 轨道 36×20/knob14/icon10；lg 轨道 56×30/knob22/icon16）；
  emits update:modelValue + change（受控/非受控两模式均发，受控态点击仅发事件、渲染跟 prop）；
  a11y role="switch" + aria-checked + aria-label（新词包 switchToLight/switchToDark）。demo
  诚实重构 5 区块（basic/controlled/sizes/disabled/change log），S3 的状态行与用法 CodeBlock
  两段全删、旧词包键 toLight/toDark 等清零不留死键。api-matrix 行真实 props/emits。vitest +4。
  commit 6559b82
- **tree（T5 includeParents 即时生效）**：tree.vue 新增单点 watch(() => props.includeParents)，
  切换时按当前勾选态（minimize→derive 全集）立即重发 update:checked（false→叶集 / true→全集）；
  禁 watch checked（回灌不触发重发，无循环）。check-ops.ts / derive-check-state.ts 零改动
  （R3/S2 契约冻结，过滤仅在 emit 出口）。vitest +2。commit 63656f0

### Fixed
- **code-block（T3 按压现代化，撤回 R2/S1 win98 按压观感）**：__copy/__fold/__copied
  :active → transform: scale(0.94)（作废 translate(1px,1px)），active bg brand16% 保留；
  transition 增 transform 0.15s ease（沿用现时长）；28×28/r8/图标 16px/几何全不动。
  commit 0937603
- **playground registry-struct（T4-fix 语法修复）**：6559b82 中 theme-switch 裸对象替换为
  props/events 版时 brace 匹配吞掉 items 数组收尾 ]，STRUCT 行括号失衡 → esbuild Transform
  failed（Expected "}" but found end of file），站点整页 500。从 56bc401 干净基线重打 T4+T5
  两处补丁，esbuild --loader:.ts=ts 编译通过。commit 4170a00
- **playground gen-api-matrix（T5 emits 正则根因修）**：旧正则 `\(e: '([a-z-]+)'` 漏抓
  update:* 命名空间事件（全库凡 emit update:* 者 events 全丢）。修正为
  `\(e: '([A-Za-z][A-Za-z0-9:-]*)'` 后重生成，rate/tree/theme-switch 等行 events 补全。commit 63656f0

### Docs
- **playground 页面 Props 可见性（T5 核查回答）**：owner「Props 里没看见 includeParents」结论
  = 矩阵不缺、页面缺——api-matrix 一直有（S2 加入），缺的是页面 Props 表（数据源
  registry-struct.ts 结构册 S2 漏更）。补 STRUCT tree 条目 + registry-zh/en 描述键
  （zh 勾选集合含父节点 / en checked set includes parents）。commit 63656f0

## [0.1.0] - 2026-10-05（sync-audit S 轮：CodeBlock 色系回归 + Tree includeParents + Rate allowReselect + MobileTabBar 图标 + Marquee 免责行 + Announce 文案）

### Fixed
- **code-block（S1 色系回归，撤回 R2 ink 实色边框）**：ink 黑只属按钮家族，CodeBlock
  回主题色衍生系。root border → `2px solid color-mix(in srgb, var(--ui-brand) 32%, var(--ui-line))`；
  box-shadow → `var(--ui-shadow-sm-brand)`（既有 token 4px 4px 0 brand，Button outline
  hover 同款，未造新 token）；radius 14px 保留。bar border-bottom 同新边框色。copy/fold
  去白卡黑边改幽灵钮（transparent 底/边 + ink-3 字，hover brand12%/border30% + ink，
  active translate(1,1)+brand16%；copied brand 底/透明边/on-brand 字）。lang 徽标 +
  title ink600 + 高亮色板/几何/动画零 diff。commit 4638521

### Added
- **tree（S2 includeParents 双模式，默认 false）**：props.checked / emit('update:checked')
  在 includeParents=true 时 = 全集契约（父 key 入集）；false（默认）= checkedKeys 过滤
  掉「有 children 的节点 key」（仅叶），半选父两模式均不入集。check-ops.ts /
  derive-check-state.ts 内部零改动（叶集过 minimize 恒等），过滤只在 emit 出口。demo 增
  AeroSwitch「包含父节点」实时切换。api-matrix tree 行 +includeParents。vitest +4。
  commit 3f89a88
- **rate（S4 allowReselect 首评锁定，默认 false）**：false 时用户完成首次评分
  （pointer/键盘第一次 commit，无论值是否变化）后锁定——后续指针/键盘输入全忽略、
  星钮 cursor:default + is-locked 类（禁 hover 放大）、aria 保持；消费方程序化
  setProps modelValue 不受锁影响。true = 现行为可反复改；allowDecimal 组合照旧。
  demo 增「允许重选」开关。api-matrix rate 行 +allowReselect。vitest +4。commit 69caf03

### Changed
- **mobile-tab-bar（S5「我的」图标替换）**：tabPaths.user 由旧 lucide user 改为
  owner 逐字 `M19 21a7 7 0 0 0-14 0` + `M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z`（半圆肩 + 头部，
  与兄弟 home/rocket/activity 风格一致）；width 19 / viewBox 24 / stroke=currentColor
  width2 round / aria-hidden 保留。commit 08a40bc
- **marquee demo（S6 免责行）**：区块下方加 `.marquee-demo__disclaimer`，词包
  marquee.disclaimer（en "All product names, logos and brands are property of their
  respective owners." / zh "所有产品名称、Logo 与品牌均属于其各自所有者。"），样式
  12px / ink-3 / margin 8px 0 0；台账 caption "BUILT WITH OPEN SOURCE" 不动。commit 3375679

### Docs
- **theme-switch demo（S3 诚实重做，R4 全量回滚）**：删除 R4 的 scenario 区块 + 5 行
  设置项及 12 个 themeSwitch.* 场景词包键（不留死键）；改加两块真内容——实时状态行
  （useTheme().state 同源，词包 2 静态键 currentLight/currentDark，禁模板拼句）+ 用法
  CodeBlock（真实 import 片段英文 + 块标题词包 usageTitle）。零编造。commit 6bc6d3b
- **announce 文案（S7 组件本体零功能改动，全经词包）**：顶部横幅（站点 announce 组）
  + demo 页实例（库 demo announce.* 键）替换为新稿——zh 标题 `AeroUI Release v1.0.0
  「平流层」正式发布🎉` / en `AeroUI Release v1.0.0 "Stratosphere" officially released 🎉` /
  zh 副题「一个好看、优雅、易套用的 Vue 组件库」/ en `A beautiful, elegant, easy-to-use
  Vue component library Vue 3 UI library.` / 链接（两语言同）`https://github.com/`。
  横幅 action 槽传纯文本 URL（组件自身 <a href="#"> 包裹，避免嵌套 <a> 非法 HTML）。
  域外同词（STRATOS/11.6s/AeroBase Team）非 Announce 范围未动。commit 8cadb50

## [0.1.0] - 2026-10-05（sync-audit R 轮：CodeBlock 复制修复+终版美术 + Tree 全集勾选契约 + ThemeSwitch 移动端充实）

### Fixed
- **code-block（R1 复制按钮失效，P0）**：非回归——组件仅安全上下文可用，owner 走
  http://IP:5173 时 `navigator.clipboard === undefined`，writeText 抛 TypeError 进旧
  catch 静默 → 「点复制无任何作用」。修：主路 `clipboard.writeText`，不可用/reject
  回退隐藏 textarea + `document.execCommand('copy')`（同步 click handler 栈内执行）；
  两路皆败 → console.warn 且**不显示已复制**（禁止撒谎），零新依赖。vitest +2
  （r1-copy.spec）。**R5 门禁修正**：warn 原中文硬编码违 i18n 红线 → 改英文诊断文案。
  commit 6a71988 / warn 英文化随 R5。
- **code-block（R2 终版美术，向 AeroButton 家族对齐）**：外部逐字规格六点全命中——root
  border `2px solid --ui-ink`（mix 线作废）+ radius 10→14 + box-shadow `--ui-shadow-sm`
  （删两层软阴影）；bar bg `--ui-surface-2` + border-bottom 2px ink + hover brand8%；
  title `--ui-ink`/fw600；lang `--ui-brand` 底/`--ui-on-brand` 字/删描边；copy-fold 1px
  ink 描边 + `--ui-card` 底 + hover brand16%/active translate(1,1)；copied brand 底/ink
  描边/on-brand 字。不变项（高亮配色/padding/字号/JBM/动画/几何）零 diff。明暗双主题
  computed before/after 逐项核对。commit 503ba9e

### Changed
- **tree（R3 勾选语义点修，v-model:checked 全集契约）**：props.checked / emit = 全集
  （全部视觉选中 key：显式 ∪ 整选父聚合后代），半选父不入集。新增 check-ops.ts 三纯函数
  （minimize / uncheckOp 路径绽放兄弟 / checkOp），tree.vue toggleCheck 三步重写
  （minimize→derive 判态→check/uncheck→emit derive(sNext).checkedKeys），JSDoc 同步契约。
  **derive-check-state.ts 与 tree-row.vue 一行未动**。测试 r3-check-ops + r3-tree-toggle
  共 12 例，原 derive 6 例回归全绿。MCP 复现 owner 症状（勾父含全部后代、点子其余保持、
  再点复活、点父全灭）。commit 819daf0

### Added
- **theme-switch demo（R4 移动端充实）**：如实核查无 props/emits/slots（不编造 API）。
  basic.vue 保留原基础示例，追加「实际使用场景」卡——5 行「左文案/右开关」设置项，文案
  走词包 themeSwitch.* via useLocale（zh/en 各 +12 键）。390×844 docH 844→1099(≥1080)，
  sweep 双视口 total=0，明暗整页截图 md5 互异。commit ad523b8

## [0.1.0] - 2026-10-04（sync-audit Q 轮：CodeBlock 字体真凶 + BackTop 轮询兜底 + ImageViewer 变换中心）

### Fixed
- **code-block（Q1 正文字体真凶：UA `code{font-family:monospace}` 压过继承）**：
  P1 已修构建侧 woff2 内联/物理资产，本轮定位正文 `pre > code` 仍回退
  generic monospace 的最后一段根因——浏览器 UA 样式表对 `code` 元素有自身
  `font-family: monospace` 声明，**元素自身声明永远赢过从 `pre` 继承的
  `var(--ui-font-mono)`**，故 bar/lang（直接写 token）正确而正文错位。修：
  `&__code code { font-family: inherit }` 让 code/高亮 span/行号子元素
  继承回 pre 的 token 值（dev + build 双链路不变式：全部代码子元素
  computed 以 "JetBrains Mono" 开头）。bar 未动。静态守卫扩展
  `p1-font.spec.ts`（dist 最终 CSS 含 `--ui-font-mono` 定义 + 0 个
  data:font/woff2 残留 + 相对 url 齐全；SFC 含 inherit 守卫）。
  证据：Q-fixes/evidence/q1-{diagnosis,dev-computed,after}.txt。commit 122690c
- **back-top（Q2 显示判定去「一次性事件重绑」依赖）**：
  M1 的重绑（resize → rAF 一帧后 `start()`）在连续拖拽窗口 / 视觉视口
  不触发 window resize 的宿主可漏帧 → show 卡死。修：组件内 rAF 帧预算
  轮询（每 4 帧 ~15Hz 直接读 `getTarget()` 当前真实滚动容器 scrollTop
  判 show），scroll 监听与 M1 resize 重绑降为「更快收敛」优化，正确性
  由轮询兜底；**零新增宽度判据**，容器漂移自动跟随。硬约束像素级不变
  （390 btRect=[308,772]、1440 符合 right/bottom 不变式、顶部隐藏双向
  判定正确、reduced-motion 未触碰）。全矩阵 67 档 + 19 步断点抖动全绿。
  证据：Q-fixes/evidence/q2-{before,after}-sweep.txt。commit 1b2698e
- **image-viewer（Q4 缩放/旋转中心回归：transform-origin `0 0` → `center`）**：
  考古定案 `0 0` 由 pinch commit 0a6b579 引入（初始行为即绕中心，owner
  判读绕左上角观感「歪」）。修：`transform-origin: center`（缩放/旋转
  中心 C 为不动点 M·C=C）+ 捏合锚点公式补「左上角补差 C·(k/s0−1)」项
  （`pinchOriginFix`，两轴同式、不依赖旋转角；起始帧 ratio=1 与纯旋转
  k=s0 时为 0，单独缩放/旋转行为不变）。几何验收：1440 下
  zoom×8→旋转 90° 组合中心 cx/cy 恒 720/450（drift=0）；390/1440 查看器
  自身零横向溢出；平移方向随手势、复位/Esc 全回归。vitest +1
  （`q4-imageviewer.spec.ts` 静态守卫：origin=center + 补差函数存在性）。
  证据：Q-fixes/evidence/q4-after.txt + before/after 截图。commit 75a558c

### Added
- **tree（Q3 勾选回归考古，report-only 零代码改动，等外部判读）**：
  F 轮定案 `4543376` 把 `toggleCheck` emit 从「父+子孙全集合」收窄为
  「userChecked 单 key 增删」；定案→HEAD 仅 J 轮 i18n（`0f513b0`，
  aria 文案）触碰 tree 目录，三核心文件逐字节未动。两症状（v-model 不
  含子孙 / 点推导选中子节点被 userChecked 成员性误判为勾选）同源于该
  语义收窄；6 单测全部只测 `deriveCheckState` 纯函数，toggle 交互路径
  零覆盖，回归自落地即存在。建议（外部判读，本轮不修）：点修不回滚——
  emit 改 derive 全集 + 点击判定用 derive 成员性 + 补组件级交互测试。
  报告全文：reports/sync-audit/Q-fixes/report-tree-checkout.md。commit e5b2a9e

### Docs
- **Q1b CodeBlock 设计现状报告（只读，供外部出终版美术规格）**：
  DOM 树 + 双主题全量 style 值表（逐 property 值/token 来源）+
  AeroButton primary/outline 全值 + lang/copied/fold 状态，零样式改动。
  证据：Q-fixes/evidence/q1b-codeblock-dual-theme.json +
  q1b-button-dual-theme.json。commit 588a0b1

## [0.1.0] - 2026-10-03（sync-audit P 轮：等宽字体真加载根因修复）

### Fixed
- **K2 守卫重设计（P4① sort-list + swipe-deck locale 同步偏脆）**：
  旧守卫「键序全等」——inner 与 props 逐下标同键才同步，用户拖动
  改序后 locale 切换即全部失同步。改为「按键合并」：以 inner 现有
  键集合为准（顺序保持用户序），逐键从最新 props 同名项刷新 locale
  绑定字段；键集合不一致（增删）才整体重置。swipe-deck 同型同改
  （结构报备：其键集合变化由既有 name 签名 keep/added watch 负责，
  本守卫 keySet 不一致时不动 order）；watch 源由窄签名
  （statusText/foot）改全字段 JSON.stringify，rows/头像等字段同步
  全量刷新。vitest 各 +1（`tests/p4-k2-guards.spec.ts`：改序+换
  文案 → 顺序保持且文案更新；键集合变化 → 重置/追加）

### Added
- **rate（P3 小数评级，新能力，样式零改动）**：新增根 prop
  `allowDecimal?: boolean = false`（默认关闭，关闭时与修复前逐像素一致、
  现有测试全绿）。开启时：粒度 0.1，写入/emit 值 clamp [0,count] 后
  `Math.round(v*10)/10` 防浮点尾巴；第 i 星填充 = `clamp(value-(i-1),0,1)`，
  部分填充 = 底层灰星 + 上层填充星按 frac×100% 宽度左裁切（星形/尺寸/
  间距/颜色一概不动，DOM 新增 `.aero-rate__fill` 叠层，整数模式不渲染）；
  指针按星内水平位置取 0.1 档（鼠标 enter/move 双事件同精度）；键盘
  ←→/↑↓ 步进 0.1；根挂 `aria-valuenow`（一位小数）+ min/max。demo 加
  AeroSwitch 开关「整数/一位小数」（词包 `rate.decimalToggle`/
  `rate.decimalHint` 新增 zh/en，走 useLocale demo 组），开启时数值
  `toFixed(1)`。门禁：vitest +2（`tests/p3-rate.spec.ts`：置 3.7 →
  第 4 星裁切宽 70% + aria-valuenow=3.7；切回整数 → 值取整渲染恢复）；
  gen-api-matrix 重生成（rate 行含 allowDecimal）；demo-sources 重生成

### Fixed
- **menu（P2 选中指示条滑动 + 微动效）**：N3 每项 `.is-active::before`
  指示条（3×16 品牌色）改为容器内单个绝对定位
  `.aero-menu__indicator`（同 3×16/r2/品牌色、aria-hidden）——active
  切换时 measure offsetLeft/offsetTop，transform 平移到「项左缘 -8
  （对齐 N3 原 ::before 视觉位 x=0）+ 项内垂直居中」（展开 h36 → +10；
  折叠 40×40 → +12，按实测几何自适应，不写死分支）；
  过渡 `transform var(--ui-dur-mid) var(--ui-spring)`
  （既有 MotionPresets token，未新造/未写死数值）；首次挂载与
  resize/collapsed 切换走双 rAF 瞬时定位（transition:none → 恢复），
  防追赶容器 0.25s 宽度过动画。微动效仅限授权三样：项 hover/active
  背景+文字既有 0.18s 过渡保留；项文字折叠/展开 opacity 0↔1
  （折叠 label 由 display:none 改 absolute+opacity:0 出流，icon 居中
  几何零变化，容器 overflow:hidden 裁剪）；分组标题 opacity
  `var(--ui-dur-mid) var(--ui-ease)` 淡入淡出（折叠态 is-line
  opacity 0）。reduced-motion 走 tokens 全局 .01ms 断路自动失效。
  N3 像素零变化：240/64、h36、r8、popover 显名均不动；
  vitest +1（指示条存在 + transform 定位 + vertical 区段无 ::before
  + 过渡走 token 静态断言）

### Fixed
- **字体打包（P1 Windows 仍 monospace 根因）**：O2 验收证据（本机
  `document.fonts.check`）被本地已装 JetBrains Mono 污染成假绿——
  Windows 未装该字体的环境实际未加载。链路诊断（环境无关证据）
  定位根因：vite lib 模式 `shouldInline` 无条件返回 true
  （node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:20474
  `if (config.build.lib) return true;`），woff2 被 base64 内联进
  dist/styles.css 且物理资产未输出；dev server 链路全绿
  （woff2 200、名称一致、无 404）故问题只在构建产物。
  修法：`src/libs/ui/vite.config.ts` 新增 `fontAssetsRebase()`
  插件（closeBundle 钩子）——构建后把 4 个 woff2 物理落 dist/ 根、
  按源文件 base64 全量匹配把 CSS 内 data-URI 逐个替换为
  相对 `url('./JetBrainsMono-*.woff2')`，禁止 base64 内联/CDN 外链；
  @font-face 保持 font-display:swap + latin/latin-ext 不动。
  验证：dist 4 个 woff2 物理文件（md5 与 src 逐一相等）、
  styles.css 0 个 data:font/woff2 残留 + 4 个相对 url；
  门禁 build.sh --demo 全绿（vitest 139 含新增静态守卫）。
  证据：reports/sync-audit/P-fixes/evidence/p1-{diagnosis,
  diagnosis-1b,after}.txt

### Added
- **vitest 静态守卫（tests/p1-font.spec.ts）**：断言主样式入口
  import 链含 fonts partial、@font-face 条目数 = 实际 woff2 权重
 文件数、family 名与 `--ui-font-mono` 栈首一致——防未来误删回归

## [0.1.0] - 2026-10-02（sync-audit O 轮：CodeBlock 美术迭代 + 等宽字体内置）

### Changed
- **code-block（O1 边框/头部加重，美术迭代第 2 轮）**：只动边框/投影/
  头部底色三处，尺寸/圆角/字号/动画/lang 徽标/copy-fold 钮全不动。
  容器 `border` 1px ink26% → 2px solid `color-mix(ink 32%, line)`；
  `box-shadow` 保留 0 1px 2px ink10%、移除 inset 0 0 0 1px ink4%
  （与 2px 边框叠加发闷）、新增环境投影 0 16px 40px -20px ink28%
  （纯视觉不影响 sweep 几何）；bar 背景 ink7% → ink12% mix surface、
  bar 底边改 1px 同容器边框色（ink32% mix，与描边呼应）

### Added
- **字体内置（O2 JetBrains Mono webfont + OFL 合规）**：此前
  `--ui-font-mono` 栈首引用 'JetBrains Mono' 但库内无 @font-face，
  全靠消费端（playground style.scss 自托管）；Windows 等未装该字体的
  环境整栈回退 generic monospace。现 vendor woff2（Google Fonts v24
  latin + latin-ext 静态切片，字重 400/500——库内 mono 消费点实测
  1×500/8×600/11×700，600/700 由引擎按 500 位合成，不额外下载）入
  `src/styles/fonts/`（JetBrainsMono-{Regular,Medium,-LatinExt-*}.woff2
  + OFL.txt 全文——SIL OFL 1.1 再分发法定前提，许可合规无传染族依赖）；
  库样式 `src/styles/fonts.scss` 加 4 个 @font-face（font-display:swap、
  unicode-range latin+latin-ext、woff2 format），经 `src/index.ts` 引入
  随库构建进 dist/styles.css（4 个 data:font/woff2 base64 块）；
  `--ui-font-mono` 补全回退栈
  'JetBrains Mono', ui-monospace, 'SF Mono', SFMono-Regular, Menlo,
  Consolas, 'Liberation Mono', monospace；CodeBlock `__code` 改消费
  该 token；字体来源：JetBrains Mono v24，OFL 1.1

## [0.1.0] - 2026-10-01（sync-audit N 轮：M 轮复检后新增 + owner 外部设计授权）

### Fixed
- **upload（N1 长文件名撑爆 P0）**：390 视口注入 80+ 字符文件名时，li
  min-content 宽度把 `.aero-upload` 根推到 400px（越宿主）、页 scrollW
  432>380、18 个溢出元素。修（锁定规格）：根 `min-width:0; max-width:100%`；
  `__drop` `max-width:100%; box-sizing:border-box`；`__list` 与 li
  `max-width:100%; min-width:0`（第三处 flex min-width:auto 命中）；
  `__name` 增 `min-width:0`（既有 flex:1/ellipsis/nowrap 在文件名层
  截断，不用容器 overflow:hidden 掩盖）；`__size`/`__x` `flex:none`；
  触发器与列表解耦各持 max-width:100%；demo wrapper 增 `min-width:0`。
  短文件名前后像素恒等（uploadW=204），上传/删除无回归，L1/M3
  min-width:0 未动
- **tour（N2 移动端滚动失控 + 屏外目标）**：390 竖屏 tour 打开时整页
  仍可 Y 滚动、highlight mask 不跟随。增 `currentContainer()`（与
  BackTop(M1)/getTarget 同源容器判定，无第四宽度判据）：可滚
  document.scrollingElement → document 容器（html+body overflow hidden
  + wheel/touchmove/keydown passive:false 拦截兜底——该引擎实测
  overflow:hidden 不挡程序化 scroll）；否则首个 overflow-y auto/scroll
  + 内容溢出 `.pg-main`（存 computed overflowY 后 hidden，unlock 还原
  原值）；锁定期间程序化 scroll 放行。屏外目标
  `scrollIntoView({block:center, behavior:reduce?auto:smooth})`，rAF
  轮询（入视口 + rect 稳 2 帧）+1.5s 兜底后重测 mask/outline/tooltip
  （引擎无 scrollend）；resize 重测；mask 跟 document 坐标不 fixed
  钉死；z-index 提 `var(--ui-z-modal)`=1300（tip<pop<modal<toast
  体系，不超 toast 1400）

### Added
- **menu（N3 侧栏重设计，owner 外部设计授权数值全锁定）**：
  `MenuItem` 增 `icon?: Component`（`<component :is>` 渲染，18×18 /
  currentColor / flex:none，无 icon 无额外缩进）+ `group?: string`
  （同组连续项渲染一个分组标题）；根 prop `collapsed?: boolean`
  （默认 false，纯样式态）+ emit `update:collapsed`（v-model:collapsed
  可用，组件自身不改）；`export type { MenuItem }` 入库入口。
  vertical 侧栏整体重设计（与 Anchor 区分）：容器 240/折叠 64、width
  .25s cubic-bezier(.4,0,.2,1)、背景 `var(--ui-surface)`、border-right
  ink12%line；item h36 / m2px8 / p0-12 / r8 / f14 / ink75% / icon-text
  gap10；hover bg ink6%；active bg brand12% + color brand + ::before
  3×16 r2 指示条；group 标题 11px ls.05em ink45% 折叠渲染 1px 分隔线；
  折叠 item 40×40 居中、文字隐藏，hover 库内 AeroPopover（placement
  right）显菜单名；折叠开关钮不入组件，demo 层库内 Button 控制。
  demo 重写：三组（概览/组件/设置）8 项各带内联 SVG icon + 词包
  menu.* 键（zh/en 各 11 键）

### Changed
- **code-block（N4 圆钮撤销重做，owner 否决 K4 全圆设计）**：撤销即
  撤销——copy/fold 28×28 与全部行为保留，仅 `border-radius` 999px→8px；
  M4 的 border ink16% / bg default ink8% / hover ink12% 全保留；copied
  反馈胶囊（expand 语义不变：h28 / padding 0 10px / brand 色 / .2s）
  radius 999→8px 与钮同角；lang 徽标 99px 胶囊未否决保留；全部 M4
  线条加重值保留

## [0.1.0] - 2026-10-01（sync-audit M 轮：K/L 复检遗留 + owner 新增）

### Fixed
- **back-top（M1 真空带失灵，L3 同源）**：跨布局断点（桌面 `.pg-main`
  overflow-y:auto ↔ 移动/真空带 window 整页滚动）resize 后，`useRafScroll`
  的 scroll 监听仍绑在 `start()` 时的旧容器上，新容器滚动无人采样 →
  `show` 卡死（桌面滚 .pg-main→窄屏：卡「可见」浮页顶；窄屏→桌面：卡
  「隐藏」）。改 `onResize` = 即时 `sample()` + rAF 一帧后 `start()` 重绑
  目标并重新采样（`start()` 幂等、自带目标漂移重绑）；不引入任何宽度常量，
  对断点无感知。390/1440 计算样式 before/after 逐字段相同（仅 resize 行为
  变正常）
- **sort-list / search / chip demo（M2 交互回写烤串，K2 漏网形态）**：demo
  层把 `t(...)` 求值结果烤进持久 ref/reactive/数组，交互（拖拽/选中/关闭）
  回写键序后切语言不再翻转。逐个改为「状态只存 locale 无关键/序，文案
  渲染期 t() 求值」：sort-list 拖拽序存 `order`（name 键），meta 经
  `META_KEY` 渲染期取；search 选中存 option value 键，展示串改
  `pickedText` computed；chip 日志存被移除 tag 键，文案渲染期拼词包。
  全站 grep 确认库 src 无烤串（sort-list 库侧 inner 同步 watch 已合规，
  不改）

### Changed
- **code-block（M4 线条加重，owner 定方向逐字）**：只动线条层次，不动
  尺寸/圆角/字号/展开动画。容器 border ink 26%（原 16%）+ box-shadow
  外 `0 1px 2px ink 10%`（原 6%）+ 新增内圈 `inset 0 0 0 1px ink 4%`；
  bar 底边 ink 24%（原 16%）、背景 ink 7%（原 4%）；lang 徽标 border
  ink 22%/bg ink 11%（原 14%/7%）；copy/fold 圆钮新增 border ink 16%、
  背景 default 8%/hover 12%（原透明/hover 6%）——现值不同，按 owner
  「default 8% / hover 12%」落定并报数。28×28/radius 999/copied 胶囊
  逻辑全不动
- **phone demo（M3 手机壳移动端溢出）**：phone 外层 flex wrapper 为
  `.pg-stage` 的 flex item，`min-width:auto`=壳定宽 330px，窄宿主（390
  视口卡内容宽 312）阻止壳 `max-width:100%` 收缩 → 壳+12px shadow 越
  demo 卡右缘约 10px。wrapper 加 `min-width:0` 允许收缩到宿主宽，壳
  `max-width:100%` 才生效；桌面宿主充足取 330 定宽，像素不变。不动 L1
  的 `.aero-mcar min-width:0`，不用 overflow:hidden 掩盖

## [0.1.0] - 2026-09-30（sync-audit L 轮：K 轮复检遗留收口）

### Fixed
- **mobile-carousel（L1 移动端 X 溢出回归，K8 引入）**：`.aero-mcar` 作为
  flex item（`.pg-stage` display:flex）时 `min-width:auto` 使 16px 固定
  margin + 330px 下限把元素撑出窄宿主右缘（390 视口 off-card 14px + 页面
  横向滚动条；390 demo 卡内 330px 定宽 > 卡内可用 284px）→ 根元素
  `min-width: 0` 允许收缩到「宿主宽 − 32px margin」。桌面宿主充足时取
  330px 定宽，1440 像素不变；K8 悬停恢复（onLeave）逻辑保留
- **playground 导航（L3 横屏小窗真空带，owner 确诊方向正确）**：侧栏隐藏
  阈值（@media 960）与汉堡出现阈值（@media 768）双断点不一致 → 768<w≤960
  无任何导航。断点单一权威收敛（nav-breakpoint.ts NAV_BREAKPOINT=960 经
  matchMedia 驱动 html.pg-nav-mobile 根类；引擎实测 CSS @media 无法读
  var()，故权威落 JS 常量+根类而非 CSS 变量）；侧栏隐藏与汉堡出现两
  判据同源联动，不变式「任意宽度 侧栏可见 XOR 汉堡可用」。硬约束：
  ≤768 与 >1024 计算样式像素不变（390/1440 全断言对照一致），只允许
  真空带 (768,960] 长出汉堡
- **playground 汉堡展开附带回顶（L4）**：点击汉堡开抽屉前，若真实滚动
  容器（H0 结论：移动端 window/document.scrollingElement，桌面 .pg-main）
  scrollTop>0 → 平滑滚到 0（prefers-reduced-motion 直接跳转），同时开
  抽屉；已在顶部行为不变。1440 桌面无汉堡，零行为变化

### Changed
- **overflow-sweep（L2 demo 卡片包容性检查）**：对白名单横滚子系统根元素
  （.aero-carousel/.aero-mcar/.aero-mq）检查其 rect 是否被最近 demo 容器
  （.pg-stage，实际 demo 卡类名）完整包含——根越出卡片 = 违规（子系统
  内部滚动不受影响）。既有 rect 越视口/innerOut 两检查的机器盲区
  （"被 demo 卡裁切"两者都不覆盖）补齐；违规计入 cardIncl 归零判定。
  阳性测试：L1 修复前 mobile-carousel 390 根 off-card 14px 被该检查抓到，
  修复后双视口 102 页归零

## [0.1.0] - 2026-09-29（sync-audit K 轮：桌面审计修复 + demo 收口）

### Added
- **theme-provider（K7 scoped 模式）**：新 prop `scoped`（默认 false，全局语义
  不变）——预设/品牌色 CSS 变量只写容器自身（+ aero-dark class），不写 :root、
  不写 localStorage，卸载随元素销毁零残留；demo 预设色板只作用预览框，
  显式「应用到全局」才 setPreset（tokens 增 [data-preset] 非 html 选择器供
  作用域预设取值）
- **input-tag / chip（K9 删除补位 FLIP）**：前置标签删除后后续标签
  TransitionGroup `move` 类平滑补位（First/Last/Play 位移 → CSS 过渡）；
  时长/缓动读 MotionPresets token（`--ui-dur-mid`/`--ui-spring`），
  `prefers-reduced-motion` 由 tokens 全局断路规则自动降级；vitest 1 例
  （k9-flip.spec：删 'a' 后 b/c 获 itag-flip-move 类 + translate(50px) 补位证据）

### Fixed
- **use-pointer-drag（K5）**：PC 单击失效——pointerdown 即 setPointerCapture
  把后续 pointerup/click 重定向到捕获元素 → 延迟捕获：首帧位移 >5px 才确认
  拖拽并挂捕获，小位移手势 click 放行回原目标；鼠标 pointerdown 不再
  preventDefault（触摸/笔保留）；carousel/mobile-carousel grab 视觉态同门控
- **mobile-carousel（K8 悬停恢复）**：@pointerenter 暂停自动轮播后无对应
  恢复路径（指针迁移丢失 mouseleave）→ 增 @pointerleave onLeave（拖拽中不
  重启，否则 restart 重计时）；phone demo 内嵌同组件同步修复
- **code-block（K4 质感终版，逐字规格）**：容器 border color-mix(ink 16%,
  line) + box-shadow ink 6%（双层描边激活感）；bar 底边同强化色 + 背景
  ink 4% surface；lang 徽标胶囊化（radius 99px/padding 3px 10px/border
  ink 14%/bg ink 7%）；copy/fold 钮 28×28 圆形 + 背景 transition .15s；
  copied 反馈态胶囊展开（宽度过渡 .2s ease 无跳变，文案 v-if 渲染防隐藏
  溢出）
- **config-provider / theme-provider demo（K6 空壳修复）**：registry 占位
  demo（空壳 badge）改吃库内 demo/basic.vue（同源约定）；config-provider
  demo 重写为前后对比双面板（默认 vs Provider 注入 dark+violet）

### Changed
- **demo i18n 实时切换（K2）**：库 demo 组词包顶层一次性求值
  （`t.value[...]` 写入 setup 常量）改为 computed/render 期求值——切语言
  不刷新整站翻转（23 文件枚举扫描）

## [0.1.0] - 2026-09-27（sync-audit J 轮：设计授权 + i18n 全量固化）

### Changed
- **code-block（J1 外部设计方定稿，逐字应用）**：容器 surface 体系
  （`--ui-surface`/`--ui-surface-2`，双主题），头部 40px 三要素
  （左：标题 + mono lang 徽标；右：copy + fold 28×28）；折叠动画
  grid-template-rows 0fr↔1fr .28s cubic-bezier(.4,0,.2,1) + pre opacity 淡入；
  语法高亮 10 组 token 双主题色板（`--ui-code-tk-*`）。tokens 新增
  `--ui-surface`/`--ui-surface-2`/code-tk 色板
- **marquee（J6 外部决策）**：caption "TRUSTED BY TEAMS…" →
  "BUILT WITH OPEN SOURCE"（通用图文，去商标风险）

### Fixed
- **menu demo（收口）**：EN label（Home/Components/Docs/About）390 下
  nowrap 撑破 scroller 8px → demo 水平菜单包 `.menu-demo__h`
  overflow-x:auto（桌面内容 < 容器无滚动条，像素零变化；sweep 白名单 36 类）
- **parallax-box（收口）**：en hint 句过长（334>312 hidden innerOut）→
  词包 en hint 缩短为 "Move → parallax · Click → rotate"，innerOut 归零

### Added
- **i18n 全量固化（J5A）**：库 src（含 demo/）非注释行 0 CJK——
  demo 组自由键词包（demo 文案全量入册）+ 各组件组件组（popconfirm/messageBox
  确定/取消、全部剩余 CJK aria-label 接线）；package.json exports 固化
  `./locale/zh-cn`/`./locale/en-us` 子路径（构建脚本 emit-locale-subpaths）；
  vitest i18n.spec 3 测（无 Provider 默认 zh-cn / en-Us Provider "Go to" / 词包常量）
- **演示站 i18n（J5B）**：playground locales/{zh-cn,en-us} 站点词包 +
  useSiteI18n 模块单例（与顶部栏 lang 同源 localStorage）；registry.ts 改
  computed 随 locale 翻转（结构册 registry-struct.ts 零文案 + 双字典
  registry-{zh,en}.ts 各 102 项）；切 EN 后整站可见英文（代码示例/prop 值除外），
  `grep CJK` playground/src（除 locales/ 与生成册）= 0

## [0.1.0] - 2026-09-27（sync-audit I 轮：零信任复检）

### Fixed
- **code-block**：头部 `__bar-left`/`__bar-right` 原嵌套在 SCSS `&__bar` 块内，展开为
  双下划线选择器 `.aero-cw__bar__left/__right`（与模板单连字符类名失配）→ 前两轮
  "修复"静默失效（owner 第三次质疑成立）。规则提升到 `.aero-cw` 顶层：左区 flex:1、
  右区 `align-items:center + gap:8px`，头部高度统一 40px；代码区 pre 纵轴改
  `overflow-y: clip`（展开动画 0fr→1fr 压缩期间不再闪出 Y 滚动条，横轴 auto 保留）
- **watermark**：`ctx.strokeStyle = ctx.fillStyle` 原在 fillStyle 赋值前执行，取 canvas
  默认黑——暗主题黑描边吞没于深底不可辨识（前两轮"已修"实测 URL 已变但像素未变的根因）。
  修复后亮/暗 fillStyle 分别为 mix(ink 30%)：`rgb(13,76,106)` / `rgb(170,227,251)`，
  双主题水印各自可辨识
- **transfer**：双面板定宽 190px 合计 440px 撑破 390px 视口（overflow-sweep 实证
  scrollOverflow）→ ≤480px 面板 flex:1 等分 + 操作钮 30px；桌面像素不变（媒体查询隔离）
- **dot-field**：demo 舞台 `width:100%` 在宽视口撑满内容盒致 canvas 右缘贴边 →
  `max-width:560px + margin-inline:auto` 桌面居中，390px 移动视口不生效（零变化）

### Added
- **i18n 从"地基"到"可见"（I3）**：词包由 cropper/code 两组扩至 10 组
  （新增 pagination/upload/empty/select/table/transfer/toast + cropper.metaFrame），
  useLocale() 全量返回 messages 及各组 ComputedRef；组件接线：
  pagination（上一页/下一页 aria、前往/确定、N 页）、upload（选择文件/拖拽区/aria）、
  empty（hint/slot 回落）、select（placeholder 缺省）、table（空数据）、
  transfer（双面板标题/移动钮 aria）、toast（关闭 aria）、code-block（折叠钮 aria）；
  cropper demo tip 与 empty demo hint 原硬编码中文改走词包。
  playground 顶部栏新增 中/EN 语言切换 chip（localStorage 持久化）+ GitHub stars 紧凑
  移动端 chip（I4，≤768px icon+数字不再 display:none）；切换 en-us 后实测
  CodeBlock 复制按钮 Copy/Copied、cropper 工具栏英文、pagination "Go to / pages"、
  upload "Drop files here"（G2-10b 复制文本词包声明经复检属实，非虚假完成项）

## [0.1.0] - 2026-09-25（sync-audit H 轮增补）

### Fixed（H 轮移动端复检收口，owner 批复）
- **back-top**：`target` 未传时自动探测真实滚动容器（先 window，window 不可滚再扫 overflow-y 候选），
  修复移动端硬传 `.pg-main` 导致按钮永不出现；demo 移除 target 靠自适应
- **pagination**：收回上轮「<480px 隐藏 jumper」条款——jumper 禁止隐藏，紧凑模式折行独占一行
  （flex-wrap），总数缩写「N 页」（桌面保留「/ N 页」）；紧凑判定改测外层块级祖先宽 ∩ 视口宽
  （原测 nav.clientWidth，被 demo flex-start 收缩误判恒 compact）
- **cropper**：结果卡片排移除 `Math.min(size,64)` 钳制 + img border-box，96/128 档按真实像素渲染；
  demo 删除「真实尺寸」第二排（验收改为全量枚举：querySelectorAll 计数 + 逐个 rect.width===导出尺寸±1px）
- **dot-field**：canvas 增 ResizeObserver 重绘，父容器非 window-resize 的尺寸变化（侧栏折叠等）不再失配；
  demo 舞台 aspect-ratio 4:3 随宽缩放，≤400px 控制条 transform:scale(0.8) 收进点阵区

### Changed（站点 chrome，playground GPL 域）
- **顶部导航 sticky**：移除 html/body `overflow-x:hidden`（CSS 规范将其 overflow-y 升级为 auto，
  body 变错位滚动盒 → 移动端 sticky 失效）；横向溢出已由 overflow-sweep 归零，无需兜底
- **移动端头部**：抽屉唯一关闭钮（消除双 X）；站点名 ≤768px 保留（缩字号 nowrap）；
  主题切换回归顶栏（紧凑态），GitHub 入口移动端隐藏；PgNav/PgMobileMenu 职责分离
- **overflow-sweep H6**：新增 hidden/clip 容器内部溢出检测（scrollWidth>clientWidth）+
  白名单祖先链豁免（API 表格/aero-table/marquee/carousel/mcar）；双视口全站 102 页归零

## [0.1.0] - 2026-09-25（sync-audit G 轮：移动端验收体系 + 布局修复 + 组件回归 + 新能力）

> X2 补录（W 终审 RF-1）：本节按 G-PHASE.md 与既有 commit 摘要补写，非当轮落盘。

### Added
- **验收体系（G0）**：MCP 走查升双视口（1440×900 / 390×844）；overflow-sweep
  程序化溢出审计（102 页 × 双视口，白名单 24 类）；z-index 语义阶梯
  （nav 800 < drag 900 < tip 1000 < pop 1200 < modal 1300 < toast 1400，
  通知类全库最高）。commit 7ac1d10
- **IconButton 正式 API（G3.11）**：`AeroIconButton` emits 补齐
- **SlideGo autoReset（G3.12）**：新 prop。commit ce89753

### Fixed
- **移动端布局（G1，站点+库）**：DemoFrame 工具钮遮挡（≤960 改流式排前）、
  PgNav 内联主题钮撑屏（≤768 隐藏）、PgMobileMenu 关闭钮出屏（流内 flex）、
  OTP 单元格 390 溢出（flex 收缩 + min-width:0）、BackTop `target` 滚动容器
  适配（EP 惯例，字符串/函数双形态）。commit 7ac1d10
- **Pagination compact（G1.5）**：ResizeObserver 监测容器宽，`<480px` 页码
  窗口收缩 5 格、隐跳过器/总数（H 轮再收回 jumper 条款）。commit 7ac1d10
- **Watermark 深色主题不可读（G2.8）**：`mixHexSafe` hex 分量 off-by-one
  （`[1,3,5]`→`[0,2,4]`）+ 非 hex 色值 canvas 采样 fillStyle；输出 rgb()。commit ce89753
- **SortList 拖拽项遮挡 Toast（G2.9）**：拖拽 z-index → `--ui-z-drag`(900)，
  低于 toast 1400。commit ce89753
- **CodeBlock 终改（G2.10）+ 复制反馈**：copy 钮 28×28、copied 态文案胶囊。commit ce89753

### Changed
- **Cropper 结果预览 + 提示 chip（G2.7）**：提示改胶囊 chip、结果容器
  flex-wrap；`AeroAvatar` box-sizing 改 border-box（修正 getBoundingClientRect
  比 size 大 5px）。commit 7ac1d10
- **playground 导航重构（cd1d8c2）**：抽离 PgNav + PgMobileMenu 内部组件；
  三个 demo 加 AeroToast 反馈（c4c7c48，demo 层增强，非库改动）
- 收口报告（双视口证据 + 门禁通过记录）：commit d591ab8

## [0.1.0] - 2026-09-24（sync-audit F 轮：owner 实测修复六项 + i18n 地基 + Tree 定案）

> X2 补录（W 终审 RF-1）：本节按 O 轮落点台账（d-ledger F 轮段）与既有
> commit 摘要补写，非当轮落盘。F 轮无独立 PHASE 档案，系 owner 实测反馈
> 驱动的逐枚 fix commit 序列（sync(fix-*) 前缀）。

### Added
- **i18n 词包 + useLocale（84ff06d）**：`src/libs/ui/src/locale/{zh-cn,en-us}.ts`
  词包与 `useLocale()` composable（对标 EP useLocale），组件文案走 t()；
  ConfigProvider locale 注入。后续 I/J 轮在此基础上扩至全量固化
- **demo 反馈增强（c4c7c48）**：action-buttons / bottom-sheet /
  pull-to-refresh 三个 demo 加 AeroToast（demo 层，非库改动）
- **playground 导航重构（cd1d8c2）**：抽离 PgNav + PgMobileMenu 内部组件

### Fixed
- **Tree 半选/全选根因（4543376，F 轮定案）**：`deriveCheckState` 后序遍历
  纯函数派生三态（唯一可变状态 = userChecked，6 单测锁死）；Q3 考古
  确认定案→HEAD 无回滚，回归源即本 commit 的 v-model 语义变更
- **SlideGo done 单次闭锁（b3b87b9）**：每个手势 doneFired 复位
- **Announce 跑马灯自适应（017fc97）**：ResizeObserver 响应内容变化，
  切长文案后循环自动生效
- **CodeBlock 展开 Y 滚动条（4403930）**：整条 bar 可点开合，交互看齐
  「查看此代码」；主题感知重设计（09436b6，token 全覆盖 + mono 字体栈）
- **IridescentThreads 重设计（3ec22fc）**：环境氛围规格（低透明曲线 +
  两层光晕 + reduced-motion）
- **QRCode color 默认取 `var(--ui-ink)` 计算值 + 主题切换重绘（15cc624）**
- **SwipeDeck bare prop（cf30f2b，对齐 PrimeVue unstyled）+ QRCode SFC 修复**
- **Cropper 导出预览裁切（d32c5a9）**：Avatar 按真实 size 渲染；
  QRCode 演示页布局解耦（dc05d8d）

## [0.1.0] - 2026-09-23

首个同步审计收口版本（未发布，open-source 预备）。本版本为 sync-audit 的完整成果，
含组件 API 补全、composable 收敛、demo 站治理与双许可落地。

### Added
- **AeroUpload** P0 组件 API 补全（对标 ElUpload，定位=文件选择 UI，不碰网络）：
  - props：`limit`、`name`、`withCredentials`、`showFileList`、`listType`、`tip`、`beforeUpload`、`beforeRemove`
  - events：`exceed`、`preview`、`upload`、`success`、`progress`、`error`（success/progress/error 走受控 watch 模式，宿主维护 `modelValue` 状态，组件自动侦测跃迁 emit）
  - expose：`submit`、`clearFiles`、`abort`、`handleStart`
  - `UploadFile` 扩展 `uid`/`url`/`percent`/`status(uploading|done|error)`
  - slots：`default(trigger)`、`tip`、`file`
- **AeroCropper** 新组件（从 avatar demo 460 行下沉为正式组件）：
  - 取框式裁剪（拖中间移动 / 角缩放 / 边旋转 / 圆形裁取），多尺寸 canvas 导出（默认 32/48/64/96/128px）
  - props：`exportSizes`/`shape(circle|rect)`/`minSize`/`maxSize(0=自动 view-10)`/`disabled`/`view`/`labels(Partial<CropperLabels>)`
  - 内置 `<input type="file" hidden>`（D-CR-1），`expose: reset()/openFilePicker()/setSource()`
  - `CropResult`/`CropFrameState`/`CropperLabels`/`defaultCropperLabels` 从包入口导出
- **AeroCarousel**：`change(prev,next)` 事件 + `defineExpose({setActiveItem,next,prev})`
- **AeroAvatar**：`shape('circle'|'square')` + `fit('cover'|'contain'|'fill')`
- 键盘可达 P0 子集：dialog/drawer 焦点圈 + Tab 陷阱 + Esc；menu 方向键；tabs ←→ 键；select 上下/Enter/Esc（已有）
- **composables**（阶段5 去重收敛）：
  - `usePointerDrag`：统一 12 处指针拖拽骨架（按下-捕获-移动-释放），迁移 9 处 + 3 例外（image-viewer 双指捏合 / slider 原生 range / use-click-outside capture 判定）
  - `useRafScroll`：统一 3 处 rAF 节流滚动采样（affix/anchor/back-top）
- **formatSize** 工具（`utils/format-size.ts`，KB/MB 人类可读，upload 等复用）
- 主题 token：`--ui-err-deep`(#8C1F1F)/`--ui-ok-deep`/`--ui-warn-deep`/`--ui-on-ink`(白)/`--ui-on-ink-2`(#CDE0EA)/`--ui-on-ink-3`(#8FA9BC)（深底专用灰阶，零视觉变化）
- 104 组件 props/emits JSDoc 补全（矩阵 JSDoc 列 104/104 ✓）
- demo 站：复制/查看同源（demo 源文件全文 + import 重写 @aero/ui）、186 条相对导入清算、favicon.ico
- 双许可：`@aero/ui`=MIT、`@aero/playground`=GPL-3.0；`pnpm-workspace.yaml` 两包声明
- AeroUIResolver（`@aero/ui/resolver`）unplugin-vue-components 按需自动导入

### Changed
- **announce** 深底白字：`.aero-announce` 系列 `color: var(--ui-ink)` → `var(--ui-on-ink)`（修复深底横幅白字回归），`__text`/`__close` 改用新 token `--ui-on-ink-2`/`--ui-on-ink-3`（值 #CDE0EA/#8FA9BC，等价原 hex）
- **form** `onSubmit` prop → `submit`（改名，D6 批复；原命名与事件语义混淆）
- **demo dogfood**：badge/carousel/chip/dot-field/qrcode/icon 原生 input/button/label 改用库组件（AeroInput/AeroButton/AeroSegmented/AeroTypography）
- 主题色变量化：硬编码色改 `var(--ui-*)` 引用（button danger #8C1F1F → `var(--ui-err-deep)` 等）
- `demo-sources.generated.ts` 由 usage 片段拼装改为源文件全文（import 重写 @aero/ui），复制/查看同源

### Fixed
- **usePointerDrag 卸载 bug**：`onBeforeUnmount` 误以 undefined 触发 `options.onEnd`，拆 `cleanup()`（清监听）与 `handleEnd()`（cleanup+onEnd），卸载只走 cleanup
- **useRafScroll 目标漂移**：`getTarget()` 动态变化后 `stop()` 解绑错误对象、旧 target 泄漏；加 `boundTarget` 比对重绑
- **cropper maxSize 僵尸逻辑**：默认 250 使 `view-10` 分支永不生效，改默认 0（语义=自动），view=260 时自动 250 零变化
- **err-deep 等价**：sass `color.adjust(-28%)` 推导语义色未对齐原 #8C1F1F，改固定 hex
- announce 深底白字 bug（见 Changed）
- 4 处 vue-tsc 类型错误清零

### 不发布说明
本版本为源码仓库的同步审计收口，`npm pack` 干跑 + `tar -tf` 产物送审（不含 src/tests）。
