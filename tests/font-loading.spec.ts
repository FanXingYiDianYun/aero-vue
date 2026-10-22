// 等宽字体真加载——静态守卫（防未来被删回归）。
// 渲染级证据（document.fonts.check/renderedFonts）在本机装字体的 agent 机上被污染，
// 本测试只做「文件/字符串」静态断言，环境无关：
// ① index.ts（库主入口）import 链上存在 styles/fonts.scss partial
// ② fonts.scss 内 @font-face 'JetBrains Mono' 条目数 === 实际 woff2 权重文件数
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const here = resolve(__dirname, '..')

describe('p1: 等宽字体打包链路静态守卫', () => {
  it('index.ts import 链含 fonts partial，且 @font-face 条目数 = woff2 权重文件数', () => {
    const index = readFileSync(resolve(here, 'src/index.ts'), 'utf8')
    expect(index).toMatch(/import\s+['"]\.\/styles\/fonts\.scss['"]/)

    const fonts = readFileSync(resolve(here, 'src/styles/fonts.scss'), 'utf8')
    // 只数规则块（@font-face { ），注释中的 "@font-face" 字样不计
    const faceCount = (fonts.match(/@font-face\s*\{/g) ?? []).length
    expect(faceCount).toBeGreaterThan(0)
    expect(fonts).toMatch(/font-family:\s*['"]?JetBrains Mono['"]?/)

    // 实际 woff2 权重文件数（Regular+Medium = 2 档 × latin/latin-ext = 4）
    const woff2Files = readdirSync(resolve(here, 'src/styles/fonts')).filter((f) => f.endsWith('.woff2')).length
    expect(woff2Files).toBe(faceCount)

    // 每个 @font-face src 引用的 woff2 文件真实存在
    const refs = [...fonts.matchAll(/url\('\.\/fonts\/([^']+\.woff2)'\)/g)].map((m) => m[1])
    expect(refs.length).toBe(faceCount)
    for (const r of refs) {
      expect(existsSync(resolve(here, `src/styles/fonts/${r}`)), r).toBe(true)
    }

    // 字体栈 token 首族名与 @font-face family 逐字符一致（防别名/引号漂移）
    const tokens = readFileSync(resolve(here, 'src/styles/tokens.scss'), 'utf8')
    const mono = tokens.match(/--ui-font-mono:\s*['"]?([^'",;]+)/)?.[1]?.trim()
    const faceFamily = fonts.match(/font-family:\s*['"]?([^'"},;]+)/)?.[1]?.trim()
    expect(mono).toBe('JetBrains Mono')
    expect(faceFamily).toBe(mono)
  })

  // 最终 CSS 含 --ui-font-mono 定义（防 partial 脱链回归——token 若未进
  // 最终 CSS，消费端 var(--ui-font-mono) 无值 → 元素回落 UA 默认 monospace）
  it('dist/styles.css 含 --ui-font-mono 定义 + @font-face + 物理 woff2（构建后可验证）', () => {
    const cssPath = resolve(here, 'dist/styles.css')
    if (!existsSync(cssPath)) return // 未构建时跳过（门禁 build.sh 先于 vitest，构建后必过）
    const css = readFileSync(cssPath, 'utf8')
    // --ui-font-mono 定义（:root 块内）
    expect(css).toMatch(/--ui-font-mono:\s*(["']?)(JetBrains Mono)\1/)
    // @font-face 块数 = woff2 权重文件数（防部分规则被树摇/压缩丢掉）
    const faceCount = (css.match(/@font-face/g) ?? []).length
    const woff2Files = readdirSync(resolve(here, 'src/styles/fonts')).filter((f) => f.endsWith('.woff2')).length
    expect(faceCount).toBe(woff2Files)
    // 无 base64 内联残留（P1 根因回归：lib 模式 shouldInline 恒 true）
    expect(css).not.toContain('data:font/woff2')
    // 相对 url() 引用且物理资产在 dist 根
    expect(css).toMatch(/url\(['"]?\.?\/?JetBrainsMono-[A-Za-z-]+\.woff2/)
    const distWoff2 = readdirSync(resolve(here, 'dist')).filter((f) => f.endsWith('.woff2'))
    expect(distWoff2).toHaveLength(woff2Files)
  })

  // UA 守卫——code-block 组件内 code{font-family:inherit} 静态存在
  // （浏览器 UA code{font-family:monospace} 的元素自身声明压过 pre 继承值，
  //  body 正文实际落在 generic monospace；inherit 回 pre 的 var(--ui-font-mono)）
  it('code-block SFC 含 code{font-family:inherit} UA 守卫（防删回归）', () => {
    const sfc = readFileSync(resolve(here, 'src/components/code-block/src/code-block.vue'), 'utf8')
    const cwCodeBlock = sfc.slice(sfc.indexOf('&__code-zone'))
    expect(cwCodeBlock).toMatch(/code\s*\{[^}]*font-family:\s*inherit/s)
  })
})
