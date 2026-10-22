import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'

// P1：woff2 走正常打包管线（rebase+emit）而非 base64 内联。
// 根因：vite lib 模式 shouldInline 无条件 true（vite 源码 'if (config.build.lib) return true'），
// CSS 内 url('./fonts/*.woff2') 被强制转 base64 内联、资产管线不 emit 物理文件 →
// dist 无 woff2，消费端（无本机字体的 Windows）字体栈断链回退 generic monospace。
// 修法：build 收尾 ① 复制 4 个 woff2 到 dist/ 根目录（物理资产，消费端 bundler
// 可 rebase+emit）② 把 dist/styles.css 里 4 个 base64 数据块替换为相对
// url('./<同名>.woff2')（相对 CSS 位置，与 npm dist 布局一致，消费端 url() 相对解析命中）。
// dev 管线不受影响（vite dev 仍 rebase 为 /@fs 绝对路径直连源文件）。
function fontAssetsRebase(): Plugin {
  const OUT = resolve(__dirname, 'dist')
  return {
    name: 'aero:font-assets-rebase',
    apply: 'build',
    closeBundle() {
      const fontsDir = resolve(__dirname, 'src/styles/fonts')
      const woff2 = readdirSync(fontsDir).filter((f) => f.endsWith('.woff2')).sort()
      // ① 物理资产落 dist 根目录
      for (const f of woff2) copyFileSync(resolve(fontsDir, f), resolve(OUT, f))
      // ①' OFL 许可文本随包（字体合规：woff2 与 SIL OFL 1.1 文本同目录分发，消费端可核许可；I5-3）
      const ofl = resolve(fontsDir, 'OFL.txt')
      if (existsSync(ofl)) copyFileSync(ofl, resolve(OUT, 'OFL.txt'))
      // ② base64 → 相对 url()（逐块按源文件 base64 全量匹配，防误替换）
      const cssPath = resolve(OUT, 'styles.css')
      if (!existsSync(cssPath)) return
      let css = readFileSync(cssPath, 'utf8')
      let replaced = 0
      for (const f of woff2) {
        const b64 = Buffer.from(readFileSync(resolve(fontsDir, f))).toString('base64')
        const token = `data:font/woff2;base64,${b64}`
        const n = css.split(token).length - 1
        css = css.split(token).join(f)
        replaced += n
        // 相对 url：与 CSS 同目录 dist 根 → './<name>.woff2'
      }
      css = css.replace(/url\((JetBrainsMono-[A-Za-z-]+\.woff2)\)/g, "url('./$1')")
      writeFileSync(cssPath, css)
      const leftover = css.split('data:font/woff2').length - 1
      console.log(`[aero:font-assets-rebase] woff2 ×${woff2.length} 落 dist/；base64 块 ${replaced} → 相对 url()；残留 base64: ${leftover}`)
      if (leftover !== 0) console.warn('[aero:font-assets-rebase] 警告：仍有 base64 woff2 残留')
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      outDir: 'dist',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.demo.vue', 'src/**/demo/**'],
    }),
    fontAssetsRebase(),
  ],
  resolve: {
    alias: {
      'aero-vue': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/tokens.scss" as *;`,
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AeroUI',
      fileName: (format) => (format === 'es' ? 'aero-ui.js' : 'aero-ui.umd.cjs'),
      formats: ['es', 'umd'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue' },
        assetFileNames: (info) =>
          info.names?.[0]?.endsWith('.css') ? 'styles.css' : info.names?.[0] ?? '[name][extname]',
      },
    },
  },
})
