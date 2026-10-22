#!/usr/bin/env node
// H1 SKILL references 生成器：从 registry-struct.ts（富 props/events + AeroXxx + 分组）
// + 各组件 demo/basic.vue（最小示例）派生 skills/aero-vue/references/components/<key>.md 组件卡。
// 数据源真源 = playground registry-struct（与演示站同源，杜绝手抄幻觉）；api-matrix 名单交叉校验。
// 用法：node scripts/gen-skill-references.mjs（aero-vue 仓根）或主仓 node aero-vue/scripts/gen-skill-references.mjs（幂等，重跑 diff=0 即门禁二跑）
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// T 轮拓扑：ROOT = lib 仓根（本文件上 1 级）；registry-struct 真源在 sibling 子仓 PG（= 主仓上一级的 aero-ui-view）
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PG = resolve(ROOT, '..', 'aero-ui-view')
const structSrc = readFileSync(join(PG, 'src/locales/registry-struct.ts'), 'utf8')

// 提取 STRUCT 数组字面量：剥 interface 块 + 类型标注
function extractStruct(src) {
  let t = src
  // 剥所有 export interface … } 块
  t = t.replace(/export interface [\s\S]*?\n\}/g, '')
  // const STRUCT: StructGroup[] = [ ... ] → const STRUCT = [ ... ]
  t = t.replace(/const STRUCT: StructGroup\[\] =/, 'const STRUCT =')
  const start = t.indexOf('const STRUCT =')
  const arrStart = t.indexOf('[', start)
  // 配平取数组字面量
  let depth = 0, end = arrStart
  for (let i = arrStart; i < t.length; i++) {
    if (t[i] === '[') depth++
    else if (t[i] === ']') { depth--; if (depth === 0) { end = i; break } }
  }
  const literal = t.slice(arrStart, end + 1)
  return eval(literal) // 纯数据字面量（无标识符引用），eval 安全
}

const STRUCT = extractStruct(structSrc)
// 组名在 registry-zh.groups（按位对齐 struct 组序；struct 组对象本身无 name 字段）
const zhSrc = readFileSync(join(PG, 'src/locales/registry-zh.ts'), 'utf8')
const groupsArr = (() => {
  const m = zhSrc.match(/groups:\s*(\[[\s\S]*?\]),/)
  return m ? eval(m[1]) : STRUCT.map((_, i) => `Group ${i + 1}`)
})()
const items = STRUCT.flatMap((g, gi) => g.items.map((it) => ({ ...it, group: groupsArr[gi] ?? `Group ${gi + 1}` })))

// 组件中文名行数据源 = registry-zh items.<key>.title 的 CJK 段（机械抽取，禁新造译名；
// title 形态恒 = 「EnName 中文名」→ 取尾部连续 CJK 段）
const zhNames = (() => {
  const m = zhSrc.match(/items:\s*\{/)
  if (!m) return {}
  let j = m.index + m[0].length - 1, depth = 0
  for (; j < zhSrc.length; j++) {
    if (zhSrc[j] === '{') depth++
    else if (zhSrc[j] === '}') { depth--; if (!depth) break }
  }
  const obj = eval('(' + zhSrc.slice(m.index + m[0].length - 1, j + 1) + ')')
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const title = String(v?.title ?? '')
    out[k] = title.match(/[\u4e00-\u9fff（）()、]+$/) ? title.match(/[\u4e00-\u9fff（）()、]+$/)[0] : title
  }
  return out
})()

const outDir = join(ROOT, 'skills/aero-vue/references/components')
let n = 0
const overLimit = []
for (const it of items) {
  const key = it.key // button / action-buttons / …
  const cmp = it.component // AeroButton / useParty() …
  // 完整示例（改判：「截断保留」撤销——半截代码比长卡更危险；
  // 单卡完整优先，示例区 = demo/basic.vue 的 script + template 全文，无 slice 截断）
  let example = ''
  const demoPath = join(ROOT, `src/components/${key}/demo/basic.vue`)
  if (existsSync(demoPath)) {
    const demo = readFileSync(demoPath, 'utf8')
    const tpl = demo.match(/<template>[\s\S]*?<\/template>/)?.[0] ?? ''
    const script = demo.match(/<script[\s\S]*?<\/script>/)?.[0] ?? ''
    example = (script || '') + (tpl ? '\n' + tpl : '')
  }
  // 类型列瘦身为纯类型信息，行为说明移至描述列（p[3]，registry-struct 第 4 元素）；
  // 含 p[3] 的卡（现仅 search）渲染 4 列，其余 101 卡 3 列零变化
  const withDesc = it.props?.some((p) => p[3])
  const propsTable = (it.props?.length ?? 0)
    ? (withDesc
      ? '| prop | 类型 | 默认 | 说明 |\n|---|---|---|---|\n' + it.props.map((p) => `| \`${p[0]}\` | ${p[1]} | ${p[2]} | ${p[3] ?? ''} |`).join('\n')
      : '| prop | 类型 | 默认 |\n|---|---|---|\n' + it.props.map((p) => `| \`${p[0]}\` | ${p[1]} | ${p[2]} |`).join('\n'))
    : '（无 props 表——组合式/配置型组件，见示例）'
  const eventsTable = it.events?.length
    ? '| event | payload |\n|---|---|\n' + it.events.map((e) => `| \`${e[0]}\` | ${e[1]} |`).join('\n')
    : ''
  // 指针行 = GitHub blob URL（owner 实锤 npm 用户不可达仓内相对路径）。
  // R0（1.0.0 GA）：布局回填 = 拆仓后公开仓根即 lib 根，指针 = src/components/<key>/demo/basic.vue
  //（公开仓布局 = 仓根即 lib 根）
  const pointer = existsSync(demoPath)
    ? `完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/${key}/demo/basic.vue\n`
    : ''
  const md = `# ${cmp}（${key}）

分组：${it.group}
中文名：${zhNames[key] ?? cmp}

${cmp.startsWith('use') ? `组合式函数，经包主入口引入：\n\n\`\`\`ts\nimport { ${cmp.replace('()', '')} } from 'aero-vue'\n\`\`\`\n` : `具名导入：\n\n\`\`\`ts\nimport { ${cmp.replace(/\(.*\)/, '')} } from 'aero-vue'\n\`\`\`\n`}
${propsTable ? `## props\n${propsTable}\n` : ''}
${eventsTable ? `## events\n${eventsTable}\n` : ''}
${example ? `## 最小示例（源自 demo/basic.vue）\n\`\`\`vue\n${example.trim()}\n\`\`\`\n${pointer}` : ''}
`
  // H2-1a 兜底上限：单卡体量 > 6KB = 停上报（禁静默截断、禁静默全量；P17 面）
  const mdBytes = Buffer.byteLength(md, 'utf8')
  if (mdBytes > 6 * 1024) {
    overLimit.push({ key, bytes: mdBytes })
    continue // 超限卡不落盘（需人工裁决）
  }
  writeFileSync(join(outDir, `${key}.md`), md)
  n++
}
if (overLimit.length) {
  console.error(`✗ 单卡体量超 6KB 兜底上限（停上报，禁静默截断/全量）：`)
  for (const o of overLimit) console.error(`  ${o.key} = ${o.bytes} bytes`)
  process.exit(1)
}

// 校验：导出名 = index.ts 字面 export{} ∪ 其 `export * from` 的再导出（composables/locale）
const indexTs = readFileSync(join(ROOT, 'src/index.ts'), 'utf8')
const literal = (s) => new Set([...s.matchAll(/export \{ ([^\}]+) \}/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().replace(/^type\s+/, '').split(/\s+/)[0]).filter(Boolean)))
const idx = new Set(literal(indexTs))
// index.ts 星导出的再导出目标（composables 等）逐并入
for (const star of [...indexTs.matchAll(/export \* from '\.\/([\w-]+)'/g)].map((m) => m[1])) {
  const p = join(ROOT, `src/${star}/index.ts`)
  if (existsSync(p)) for (const nm of literal(readFileSync(p, 'utf8'))) idx.add(nm)
}
const unresolved = []
for (const it of items) {
  const names = it.component.replace(/\(.*\)/, '').split('+').map((s) => s.trim()).filter(Boolean)
  for (const nm of names) {
    if (/^(Aero|use)/.test(nm) && !idx.has(nm)) unresolved.push(`${it.key}:${nm}`)
  }
}
console.log(`gen-skill-references: 生成 ${n} 组件卡 → skills/aero-vue/references/components/`)
console.log(`交叉校验：组件卡 ${n} 张；Aero*/use* 导出未解析 = ${unresolved.length}${unresolved.length ? '（' + unresolved.join(' ') + '）' : ''}`)
if (unresolved.length) process.exit(1)
