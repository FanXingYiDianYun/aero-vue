#!/usr/bin/env node
/**
 * list-components.mjs —— 列出 aero-vue 全部组件（agent 跑脚本优于读长文）
 *
 * 居 skills/aero-vue/scripts/（随 npm 面分发，宿主 node_modules/aero-vue/skills/aero-vue/scripts/）。
 * 数据源 = 同级 ../references/components/*.md（gen-skill-references.mjs 生成物，与 102 组件卡同源，
 * 运行时读盘而非手抄清单 → 防漂移）。相对自身定位，可在包内任意位置执行。
 *
 * 用法（在 aero-vue 包目录或 node_modules/aero-vue 内）：
 *   node skills/aero-vue/scripts/list-components.mjs            # 全量（按分组）
 *   node skills/aero-vue/scripts/list-components.mjs table      # 查单卡（模糊匹配 key / AeroXxx）
 *   node skills/aero-vue/scripts/list-components.mjs --json     # JSON 输出（{key, name, group}）
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

// 本文件居 skills/aero-vue/scripts/ → 上 1 级 = skills/aero-vue/ → references/components
const CARD_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'components')

function parseCard(file) {
  const text = readFileSync(join(CARD_DIR, file), 'utf8')
  const title = /^# (.+?)（(.+?)）/m.exec(text)
  const group = /^分组：(.+)$/m.exec(text)
  return {
    key: title ? title[2] : file.replace(/\.md$/, ''),
    name: title ? title[1] : file.replace(/\.md$/, ''),
    group: group ? group[1] : '?',
  }
}

function cards() {
  const files = readdirSync(CARD_DIR).filter((f) => f.endsWith('.md'))
  const list = files.map(parseCard)
  const byGroup = new Map()
  for (const c of list) {
    if (!byGroup.has(c.group)) byGroup.set(c.group, [])
    byGroup.get(c.group).push(c)
  }
  return { list, byGroup }
}

const arg = process.argv[2]
if (arg === '--json') {
  console.log(JSON.stringify(cards().list, null, 2))
} else if (arg) {
  const { list } = cards()
  const hits = list.filter((c) => c.key.includes(arg) || c.name.toLowerCase().includes(arg.toLowerCase()))
  if (!hits.length) {
    console.error(`无匹配「${arg}」。全量：node ${process.argv[1].split('/').pop()} --json`)
    process.exit(1)
  }
  for (const c of hits) console.log(`${c.name.padEnd(26)} key=${c.key.padEnd(18)} 分组=${c.group}`)
} else {
  const { byGroup } = cards()
  for (const [g, items] of byGroup) {
    console.log(`\n${g}（${items.length}）`)
    for (const c of items) console.log(`  ${c.name}  (key=${c.key})`)
  }
  const n = [...byGroup.values()].reduce((a, b) => a + b.length, 0)
  console.log(`\n合计 ${n} 组件/组合式入口`)
}
