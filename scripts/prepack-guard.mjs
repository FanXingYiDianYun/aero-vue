#!/usr/bin/env node
// pack 防覆盖守门（交付事故固化，守卫⑧）：
// 一切交付 pack 落盘前检查目标 tgz 是否已存在 → 存在即报错拒写（exit 1 + 明确提示）。
// 挂 npm `prepack` 生命周期：npm pack（run-all pack 步 / 手动交付）自动先跑本守卫，
// 稳定交付目录约定 = PACK_DESTINATION 环境变量（默认见代码常量）。
// 事故背景：历史轮 run-all 曾在版本 bump 前执行，pack 以旧 version 落盘
// 覆盖了 D6 交付的原始 rc.6 tgz（sha e52d2ac2… 本地失传）。
// 处置提示：目标已存在 = 人工裁决（改名留证 / 确认后删除重打），禁止静默覆盖。
import { readFileSync, existsSync } from 'node:fs'

const here = new URL('..', import.meta.url).pathname
const pkg = JSON.parse(readFileSync(here + 'package.json', 'utf8'))
const dest = process.env.PACK_DESTINATION || '/home/ztk'
const target = `${dest}/aero-vue-${pkg.version}.tgz`

if (existsSync(target)) {
  let sha = '(sha256 不可算)'
  try {
    const { spawnSync } = await import('node:child_process')
    sha = (spawnSync('sha256sum', [target]).stdout ?? '').toString().trim().split(' ')[0]
  } catch {}
  console.error(
    `[prepack-guard] 拒绝覆盖：目标 tgz 已存在\n` +
      `  target   = ${target}\n` +
      `  现有 sha = ${sha}\n` +
      `  版本     = ${pkg.version}\n` +
      `处置 = 人工裁决：对照归档记录值确认后，\n` +
      `       改名留证（.corrupt-<日期>）或显式删除再重打；本守卫禁止静默覆盖。`,
  )
  process.exit(1)
}
console.log(`[prepack-guard] 目标不存在 → 放行 pack：${target}`)
