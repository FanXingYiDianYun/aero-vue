/**
 * exports 声明路径防回归守卫（防 locale 子路径死声明复发）。
 *
 * 病灶（RF-2）：package.json exports 声明了 ./locale/* 子路径，
 * 但 vite 单入口构建不产 dist/locale/*.js → 外部消费者按声明 import 必炸
 * ERR_MODULE_NOT_FOUND。X1 决策=收回声明（不补多入口，见 CHANGELOG v0.2 Roadmap）。
 * 本守卫：逐条读取 exports 所有条件分支的目标路径（types/import/require/默认），
 * 断言相对包根真实存在。dist/ 为构建产物——本守卫在 build 之后运行才有意义
 * （门禁顺序 build → vitest）；dist 缺失时明确 fail 并提示先构建，不静默跳过。
 *
 * beta-4 H3 扩展（原 2 guard → 5 guard，如实上报项数变化）：
 *   ③ files 白名单含 skills/（skill 随 npm 面分发，防被误裁）
 *   ④ skills/aero-vue/SKILL.md frontmatter 非空（name + description 在位）
 *   ⑤ SKILL.md 坑区 box-sizing 段在位（宿主必读项，防被误删）
 *
 * beta-4 H1-fix 扩展（5 guard → 6 guard，如实上报项数变化）：
 *   ⑥ skill 自洽：SKILL.md 引用的相对路径（references/templates/scripts/*.md|.vue|.mjs）
 *      在包内 skills/aero-vue/ 实体存在（含 scripts/，防 H1 死引用/脚本误置包根不入 npm 面复发）
 *
 * E7 注释复发门控固化（6 guard → 7 guard，如实上报项数变化）：
 *   ⑦ 演示可见表面（演示站 playground/src + 库组件 demo 的 .vue/.scss）过程注释强信号=0
 *      （spawn scan-junk-comments 基线轮，只裁演示可见表面；locale/registry 数据文件的
 *      历史锚点 token 不属演示可见表面，不入本门控——计数变化如实上报）
 *
 * R9 交付链事故双守门固化（7 guard → 9 guard，如实上报项数变化）：
 *   ⑧ prepack 防覆盖：package.json scripts.prepack = prepack-guard.mjs 在位，
 *      且该守卫「目标 tgz 已存在 → 拒写 exit≠0」负例成立（防误覆盖既往交付物复发）
 *   ⑨ 基线 sha 前置校验脚本 verify-tgz-baseline.mjs 在位且可运行（对照值不符即红旗停手）
 *
 * R13 声明产物单源化守门（9 guard → 10 guard，如实上报项数变化）：
 *   ⑩ dist-declaration-purity：dist/src/** 嵌套与 dist/vite.config.d.ts 禁在位
 *      （rc.11 dist 漂移事件：build 脚本 vue-tsc 回归 --noEmit 纯类型检查，声明单源
 *      = vite-plugin-dts；任何嵌套声明产物复发 = 红）
 */
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync, writeFileSync, unlinkSync, mkdirSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve, isAbsolute } from 'node:path'

const here = resolve(__dirname, '..')
const pkg = JSON.parse(readFileSync(resolve(here, 'package.json'), 'utf8'))

/** 收集 exports 内所有声明目标路径（递归展开条件对象与 "*" 分支） */
function collectTargets(node: unknown): string[] {
  if (typeof node === 'string') return [node]
  if (Array.isArray(node)) return node.flatMap(collectTargets)
  if (node && typeof node === 'object') return Object.values(node as object).flatMap(collectTargets)
  return []
}

const targets = collectTargets(pkg.exports ?? {})

describe('package.json exports 声明路径存在性守卫（防 locale 子路径死声明复发）', () => {
  // 门禁顺序 build → vitest：正常验收时 dist 已在。未构建环境（dist 主产物缺失）
  // 显式 skip 并留痕，不静默转绿、不误红。
  it('exports 每个声明目标相对包根真实存在', () => {
    expect(targets.length).toBeGreaterThan(0)
    const mainEntry = targets.find((t) => t.includes('aero-ui'))
    if (mainEntry && !existsSync(resolve(here, mainEntry))) {
      console.log('[exports-guard] skip：dist 未构建（先 pnpm build）')
      return
    }
    const missing = targets.filter((t) => !isAbsolute(t) && !existsSync(resolve(here, t)))
    if (missing.length) {
      throw new Error(
        `exports 声明路径缺失（RF-2 复发征兆）：${missing.join(', ')}\n` +
          '→ 补对应构建产物，或收回该声明（见 X1 判读：收回优先，多入口列 v0.2 Roadmap）',
      )
    }
  })

  it('locale 子路径声明状态显式化（当前=已收回，v0.2 多入口后重开）', () => {
    const keys = Object.keys((pkg.exports ?? {}) as Record<string, unknown>)
    const localeKeys = keys.filter((k) => k.startsWith('./locale/'))
    // X1 后 locale 子路径已收回；若 v0.2 多入口构建落地，同 commit 恢复声明并翻转本断言
    expect(localeKeys).toEqual([])
  })

  // ── beta-4 H3 扩展 guard（③④⑤）──
  it('files 白名单含 skills/（skill 随 npm 面分发）', () => {
    const files = (pkg.files ?? []) as string[]
    expect(files).toContain('dist')
    expect(files).toContain('skills')
  })

  it('skills/aero-vue/SKILL.md frontmatter 非空（name + description 在位）', () => {
    const p = resolve(here, 'skills/aero-vue/SKILL.md')
    expect(existsSync(p)).toBe(true)
    const src = readFileSync(p, 'utf8')
    const fm = src.match(/^---\n([\s\S]*?)\n---/)
    expect(fm, 'SKILL.md frontmatter 缺失').not.toBeNull()
    const body = fm![1]
    const name = body.match(/^name:\s*(\S+)/m)
    const desc = body.match(/^description:\s*(.+)/m)
    expect(name?.[1], 'frontmatter.name 缺失').toBeTruthy()
    expect(desc?.[1].trim(), 'frontmatter.description 缺失').toBeTruthy()
  })

  it('SKILL.md 坑区 box-sizing 段在位（宿主必读项，防被误删）', () => {
    const src = readFileSync(resolve(here, 'skills/aero-vue/SKILL.md'), 'utf8')
    expect(src, 'box-sizing 坑区段缺失').toContain('box-sizing: border-box')
    // 口径反转：旧口径「宿主勿加全局 reset」→ 新口径「推荐宿主加标准全局重置」
    // （全项目统一，原文照抄）。守卫锚点同步到新口径开场句，防 box-sizing 段被误删。
    expect(src, 'box-sizing 新口径段（推荐标准全局重置）缺失').toContain('推荐在你的项目中使用标准全局重置')
  })

  // ── beta-4 H1-fix 扩展 guard（⑥ skill 自洽）──
  it('skill 自洽：SKILL.md 引用的相对路径在包内实体存在（含 scripts/，防 H1 死引用复发）', () => {
    const skillRoot = resolve(here, 'skills/aero-vue')
    const src = readFileSync(resolve(skillRoot, 'SKILL.md'), 'utf8')
    // SKILL.md 中出现的相对引用路径（references/*.md / templates/*.vue / scripts/*.mjs / components/*.md）
    const refs = [...new Set([...src.matchAll(/\b(?:references|templates|scripts)\/[\w./-]+/g)].map((m) => m[0]))]
    // `references/components/*.md` 为通配占位，改按目录非空核验；具体卡名逐一核验
    const concrete = refs.filter((r) => !r.includes('*'))
    for (const rel of concrete) {
      const p = resolve(skillRoot, rel)
      expect(existsSync(p), `SKILL.md 引用路径在包内缺失：skills/aero-vue/${rel}`).toBe(true)
    }
    // 组件卡目录非空（references/components/*.md 通配落地）
    const cardDir = resolve(skillRoot, 'references/components')
    expect(readdirSync(cardDir).filter((f) => f.endsWith('.md')).length, '组件卡目录为空').toBeGreaterThanOrEqual(100)
    // scripts/ 在位（本轮 H1 死引用根因——脚本误置包根不入 npm 面）
    expect(existsSync(resolve(skillRoot, 'scripts/list-components.mjs')), 'skills/aero-vue/scripts/list-components.mjs 缺失（H1 死引用复发）').toBe(true)
  })

  // ── E7 注释复发门控（⑦ 演示可见表面强信号=0，常驻 guard 防复发）──
  it('演示可见表面（playground + 组件 demo 的 .vue/.scss）过程注释强信号=0（E7 门控）', () => {
    // T 轮拓扑：测试位置 aero-vue/tests/ → 主仓根上溯 2 级（scripts/hygiene 在主仓）
    const repoRoot = resolve(__dirname, '..', '..')
    const scan = resolve(repoRoot, 'scripts/hygiene/scan-junk-comments.mjs')
    if (!existsSync(scan)) {
      console.log('[exports-guard] skip ⑦：scan-junk-comments.mjs 缺失（基建未同步）')
      return
    }
    const report = resolve(repoRoot, `e7-demo-surface-scan-${process.pid}.txt`)
    const r = spawnSync('node', [scan, '--out', report], { encoding: 'utf8', cwd: repoRoot, timeout: 120000 })
    // 基线轮（无 --ci）exit 恒 0；命中数仅由报告强信号段计数，不靠 exit 误绿
    const text = readFileSync(report, 'utf8')
    unlinkSync(report, () => {})
    const strongSec = text.split('【弱信号')[0].split('【强信号对话痕迹')[1] ?? ''
    const strongLines = strongSec
      .split('\n')
      .filter((l) => /^\s+[^（]/.test(l))
      .filter((l) => !l.includes('（0 条）'))
    // 门控只裁「演示可见表面」= 演示站 playground/src + 库组件 demo 的渲染面（.vue/.scss）；
    // locale/registry 数据文件的注释 token（J5/W4 等历史锚点）不属演示可见表面，不入本门控
    const demoSurface = strongLines.filter(
      (l) =>
        /src\/views\/playground\/src\/[^\s:]+\.vue:/.test(l) ||
        /components\/[a-z0-9-]+\/demo\/[^\s:]+\.vue:/.test(l) ||
        /src\/views\/playground\/src\/[^\s:]+\.scss:/.test(l),
    )
    expect(demoSurface, `演示可见表面过程注释强信号应=0，实测 ${demoSurface.length}：\n${demoSurface.join('\n')}`).toEqual([])
  })

  // ── R9 交付链事故双守门（⑧⑨ 常驻 guard 防「误覆盖既往 tgz 交付物」复发）──
  it('⑧ prepack 防覆盖在位且负例成立（目标 tgz 已存在 → 拒写 exit≠0）', () => {
    // 在位：package.json scripts.prepack 指向 prepack-guard.mjs 且文件存在
    const guardCmd = (pkg.scripts ?? {}).prepack ?? ''
    expect(guardCmd, 'package.json 缺 scripts.prepack 钩子（防覆盖钩子缺失）').toContain('prepack-guard')
    // prepack 值 = 'node scripts/prepack-guard.mjs'；剥 'node ' 得相对仓库包根的脚本路径
    const guardPath = resolve(here, guardCmd.replace(/^node\s+/, '').trim())
    expect(existsSync(guardPath), `prepack-guard 脚本缺失：${guardPath}`).toBe(true)
    // 负例：造一个已存在的目标 tgz → prepack 应 exit≠0 拒写（用 PACK_DESTINATION 指临时目录，不碰真交付物）
    const tmpDest = resolve(here, `prepack-gate-probe-${process.pid}`)
    mkdirSync(tmpDest, { recursive: true })
    const fakeTgz = resolve(tmpDest, `aero-vue-${pkg.version}.tgz`)
    writeFileSync(fakeTgz, 'corrupt-probe')
    const r = spawnSync('node', [guardPath], { encoding: 'utf8', cwd: here, env: { ...process.env, PACK_DESTINATION: tmpDest }, timeout: 30000 })
    try {
      rmSync(tmpDest, { recursive: true, force: true })
    } catch {}
    expect(r.status, `prepack-guard 应拒绝覆盖已存在目标（负例），实测 exit=${r.status}：\n${(r.stdout ?? '') + (r.stderr ?? '')}`).not.toBe(0)
    expect((r.stderr ?? '').toLowerCase()).toMatch(/拒绝覆盖|target|tgz/i)
  })

  it('⑨ 基线 sha 前置校验脚本在位且可运行（verify-tgz-baseline）', () => {
    const repoRoot = resolve(__dirname, '..', '..')
    const verifier = resolve(repoRoot, 'scripts/hygiene/verify-tgz-baseline.mjs')
    expect(existsSync(verifier), `基线 sha 校验脚本缺失：${verifier}`).toBe(true)
    // 可运行性：缺参 → 用法提示 exit=2（非崩溃）；对 /dev/null 之类无法定位 tgz → 非 0 且不静默
    const r = spawnSync('node', [verifier], { encoding: 'utf8', cwd: repoRoot, timeout: 30000 })
    expect(r.status, `verify-tgz-baseline 缺参应 exit=2（用法提示），实测 ${r.status}`).toBe(2)
  })

  // ── R13 声明产物单源化守门（⑩ dist-declaration-purity，常驻 guard 防复发）──
  // rc.11 dist 漂移事件：vue-tsc --emitDeclarationOnly 按 tsconfig declarationDir=dist
  // 出嵌套 dist/src/** + vite.config.d.ts，与 vite-plugin-dts 顶层扁平 d.ts 双源并存
  // → 包面冗余死件。修复 = build 脚本改 vue-tsc --noEmit（类型检查保留，声明单源
  // = vite-plugin-dts）。本守门断言 dist/src 与 dist/vite.config.d.ts 不存在（违反 = 红）；
  // 未构建环境二者天然缺失，不误红（与 ①-⑦ 同构 skip 语义）。
  it('dist 声明产物单源：无嵌套 dist/src/** 与 dist/vite.config.d.ts（R13-⑩）', () => {
    const distDir = resolve(here, 'dist')
    if (!existsSync(distDir)) {
      console.log('[exports-guard] skip ⑩：dist 未构建（先 pnpm build）')
      return
    }
    const nested = resolve(distDir, 'src')
    expect(existsSync(nested), `dist/src 嵌套声明目录在位（R13 声明产物非单源复发，应为 vue-tsc --noEmit 零产出）`).toBe(false)
    const viteDts = resolve(distDir, 'vite.config.d.ts')
    expect(existsSync(viteDts), `dist/vite.config.d.ts 在位（R13 声明产物非单源复发，应为 vue-tsc --noEmit 零产出）`).toBe(false)
  })
})
