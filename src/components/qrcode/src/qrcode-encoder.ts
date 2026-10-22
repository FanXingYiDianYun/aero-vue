/**
 * QR Code 编码器（无第三方依赖，ISO/IEC 18004 完整实现）
 * - 字节模式，版本 1-10 自动适配
 * - 纠错级别 L/M/Q/H
 * - GF(256) Reed-Solomon 纠错码
 * - 多块结构：数据码字交织 + EC 码字交织（v3-Q 起多块）
 * - 8 掩码按 ISO 罚分规则择优
 * - Format Information BCH(15,5) + Version Information BCH(18,6)
 * - 寻像/定时/对齐/暗模块全摆位
 */

// ---------- GF(256)（素多项式 0x11D） ----------
const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
;(function initGF() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]
})()
const gmul = (a: number, b: number) => (a && b ? EXP[LOG[a] + LOG[b]] : 0)

/** 生成多项式表（按 ecLen 懒计算；系数约定 a[0]=最高次，a[n]=常数项 1） */
const GEN_CACHE: Record<number, number[]> = {}
function genPoly(ecLen: number): number[] {
  if (!GEN_CACHE[ecLen]) {
    let g = [1]
    for (let i = 0; i < ecLen; i++) {
      const ng = new Array(g.length + 1).fill(0)
      for (let j = 0; j < g.length; j++) {
        ng[j] ^= g[j]
        ng[j + 1] ^= gmul(g[j], EXP[i])
      }
      g = ng
    }
    GEN_CACHE[ecLen] = g
  }
  return GEN_CACHE[ecLen]
}

/** RS 纠错码：对 data 求 mod g(x) 的余式（长度 ecLen） */
function rsEncode(data: number[], ecLen: number): number[] {
  const gen = genPoly(ecLen)
  const res = [...data, ...new Array(ecLen).fill(0)]
  for (let i = 0; i < data.length; i++) {
    const factor = res[i]
    if (factor === 0) continue
    for (let j = 1; j < gen.length; j++) res[i + j] ^= gmul(gen[j], factor)
  }
  return res.slice(data.length)
}

// ---------- 权威块结构表（v1-10 × L/M/Q/H，源自 ISO/IEC 18004 Table 13-22） ----------
interface BlockSpec {
  total: number // 该版本总码字数（数据+EC）
  ecPer: number // 每块 EC 码字数
  g1: number // 短块数
  d1: number // 短块数据码字数
  g2: number // 长块数
  d2: number // 长块数据码字数
}
type LevelKey = 'L' | 'M' | 'Q' | 'H'
const SPECS: Record<LevelKey, BlockSpec[]> = {
  L: [
    { total: 26, ecPer: 7, g1: 1, d1: 19, g2: 0, d2: 0 },
    { total: 44, ecPer: 10, g1: 1, d1: 34, g2: 0, d2: 0 },
    { total: 70, ecPer: 15, g1: 1, d1: 55, g2: 0, d2: 0 },
    { total: 100, ecPer: 20, g1: 1, d1: 80, g2: 0, d2: 0 },
    { total: 134, ecPer: 26, g1: 1, d1: 108, g2: 0, d2: 0 },
    { total: 172, ecPer: 18, g1: 2, d1: 68, g2: 0, d2: 0 },
    { total: 196, ecPer: 20, g1: 2, d1: 78, g2: 0, d2: 0 },
    { total: 242, ecPer: 24, g1: 2, d1: 97, g2: 0, d2: 0 },
    { total: 292, ecPer: 30, g1: 2, d1: 116, g2: 0, d2: 0 },
    { total: 346, ecPer: 18, g1: 2, d1: 68, g2: 2, d2: 69 },
  ],
  M: [
    { total: 26, ecPer: 10, g1: 1, d1: 16, g2: 0, d2: 0 },
    { total: 44, ecPer: 16, g1: 1, d1: 28, g2: 0, d2: 0 },
    { total: 70, ecPer: 26, g1: 1, d1: 44, g2: 0, d2: 0 },
    { total: 100, ecPer: 18, g1: 2, d1: 32, g2: 0, d2: 0 },
    { total: 134, ecPer: 24, g1: 2, d1: 43, g2: 0, d2: 0 },
    { total: 172, ecPer: 16, g1: 4, d1: 27, g2: 0, d2: 0 },
    { total: 196, ecPer: 18, g1: 4, d1: 31, g2: 0, d2: 0 },
    { total: 242, ecPer: 22, g1: 2, d1: 38, g2: 2, d2: 39 },
    { total: 292, ecPer: 22, g1: 3, d1: 36, g2: 2, d2: 37 },
    { total: 346, ecPer: 26, g1: 4, d1: 43, g2: 1, d2: 44 },
  ],
  Q: [
    { total: 26, ecPer: 13, g1: 1, d1: 13, g2: 0, d2: 0 },
    { total: 44, ecPer: 22, g1: 1, d1: 22, g2: 0, d2: 0 },
    { total: 70, ecPer: 18, g1: 2, d1: 17, g2: 0, d2: 0 },
    { total: 100, ecPer: 26, g1: 2, d1: 24, g2: 0, d2: 0 },
    { total: 134, ecPer: 18, g1: 2, d1: 15, g2: 2, d2: 16 },
    { total: 172, ecPer: 24, g1: 4, d1: 19, g2: 0, d2: 0 },
    { total: 196, ecPer: 18, g1: 2, d1: 14, g2: 4, d2: 15 },
    { total: 242, ecPer: 22, g1: 4, d1: 18, g2: 2, d2: 19 },
    { total: 292, ecPer: 20, g1: 4, d1: 16, g2: 4, d2: 17 },
    { total: 346, ecPer: 24, g1: 6, d1: 19, g2: 2, d2: 20 },
  ],
  H: [
    { total: 26, ecPer: 17, g1: 1, d1: 9, g2: 0, d2: 0 },
    { total: 44, ecPer: 28, g1: 1, d1: 16, g2: 0, d2: 0 },
    { total: 70, ecPer: 22, g1: 2, d1: 13, g2: 0, d2: 0 },
    { total: 100, ecPer: 16, g1: 4, d1: 9, g2: 0, d2: 0 },
    { total: 134, ecPer: 22, g1: 2, d1: 11, g2: 2, d2: 12 },
    { total: 172, ecPer: 28, g1: 4, d1: 15, g2: 0, d2: 0 },
    { total: 196, ecPer: 26, g1: 4, d1: 13, g2: 1, d2: 14 },
    { total: 242, ecPer: 26, g1: 4, d1: 14, g2: 2, d2: 15 },
    { total: 292, ecPer: 24, g1: 5, d1: 12, g2: 1, d2: 13 },
    { total: 346, ecPer: 28, g1: 6, d1: 15, g2: 2, d2: 16 },
  ],
}
// 对齐图形中心坐标（v2-10）
const ALIGN: Record<number, number[]> = {
  2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
  7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
}
const LEVEL_INDEX: Record<LevelKey, number> = { L: 1, M: 0, Q: 3, H: 2 } // Format Info 编码
export type ECLevel = LevelKey

// ---------- 掩码条件（返回 true = 翻转） ----------
function maskBit(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0: return (r + c) % 2 === 0
    case 1: return r % 2 === 0
    case 2: return c % 3 === 0
    case 3: return (r + c) % 3 === 0
    case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0
    case 5: return ((r * c) % 2) + ((r * c) % 3) === 0
    case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0
    default: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
  }
}

// ---------- Format Info BCH(15,5)，生成多项式 G3=0x537，掩码 XOR 0x5412 ----------
function formatBits(level: ECLevel, mask: number): boolean[] {
  const data = (LEVEL_INDEX[level] << 3) | mask // 5 bit
  let rem = data << 10
  for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= 0x537 << (i - 10)
  const val = ((data << 10) | rem) ^ 0x5412
  const bits: boolean[] = []
  for (let i = 14; i >= 0; i--) bits.push(((val >> i) & 1) === 1)
  return bits // bits[0]=bit14(MSB) … bits[14]=bit0(LSB)
}

// ---------- Version Info BCH(18,6)，G18=0x1F25（v7+） ----------
function versionBits(ver: number): boolean[] {
  let rem = ver << 12
  for (let i = 17; i >= 12; i--) if ((rem >> i) & 1) rem ^= 0x1f25 << (i - 12)
  const val = (ver << 12) | rem
  const bits: boolean[] = []
  for (let i = 17; i >= 0; i--) bits.push(((val >> i) & 1) === 1)
  return bits // bits[0]=bit17(MSB) … bits[17]=bit0(LSB)
}

/**
 * 将 Format Information 写入矩阵（两处副本，ISO 18004 §8.9 摆位）
 * bit 序号 i（0=LSB）：竖向 i<6→(i,8)，i<8→(i+1,8)，否则→(n-15+i,8)；
 *                      横向 i<8→(8,n-1-i)，i=8→(8,7)，否则→(8,14-i)
 */
function writeFormat(m: boolean[][], level: ECLevel, mask: number): void {
  const n = m.length
  const fb = formatBits(level, mask) // fb[0]=bit14 … fb[14]=bit0
  for (let i = 0; i < 15; i++) {
    const mod = fb[14 - i]
    const vr = i < 6 ? i : i < 8 ? i + 1 : n - 15 + i
    const hc = i < 8 ? n - 1 - i : i < 9 ? 7 : 14 - i
    m[vr][8] = mod
    m[8][hc] = mod
  }
}

/**
 * 编码为 n×n 布尔矩阵（true=深色模块）
 * @param text 内容（UTF-8 字节模式）
 * @param level 纠错级别，默认 M
 */
export function encodeQR(text: string, level: ECLevel = 'M'): boolean[][] {
  const bytes = new TextEncoder().encode(text)

  // —— 版本选择：mode(4)+count(8|16)+data 所需码字 ≤ 数据容量 ——
  let ver = 1
  while (ver <= 10) {
    const s = SPECS[level][ver - 1]
    const cap = s.total - s.ecPer * (s.g1 + s.g2)
    const need = Math.ceil((4 + (ver <= 9 ? 8 : 16) + bytes.length * 8) / 8)
    if (need <= cap) break
    ver++
  }
  if (ver > 10) throw new Error('AeroQRCode: content exceeds version 10 capacity (~2.7KB)')

  const spec = SPECS[level][ver - 1]
  const blocks = spec.g1 + spec.g2
  const dataCw = spec.total - spec.ecPer * blocks
  if (bytes.length > 255 && ver <= 9) throw new Error('AeroQRCode: internal error (counter bit width)')

  // —— 位流：mode(0100) + count + data + terminator + 字节对齐 + pad(0xEC,0x11) ——
  const bits: boolean[] = []
  const push = (v: number, w: number) => {
    for (let i = w - 1; i >= 0; i--) bits.push(((v >> i) & 1) === 1)
  }
  push(4, 4)
  push(bytes.length, ver <= 9 ? 8 : 16)
  for (const b of bytes) push(b, 8)
  const term = Math.min(4, dataCw * 8 - bits.length)
  if (term > 0) push(0, term)
  while (bits.length % 8) bits.push(false)
  const cw: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) if (bits[i + j]) b |= 1 << (7 - j)
    cw.push(b)
  }
  for (let pi = 0; cw.length < dataCw; pi++) cw.push(pi % 2 === 0 ? 0xec : 0x11)

  // —— 分块（前 g1 块取 d1，其余取 d2）→ RS → 交织 ——
  const dataBlocks: number[][] = []
  {
    let off = 0
    for (let b = 0; b < blocks; b++) {
      const len = b < spec.g1 ? spec.d1 : spec.d2
      dataBlocks.push(cw.slice(off, off + len))
      off += len
    }
  }
  const ecBlocks = dataBlocks.map((blk) => rsEncode(blk, spec.ecPer))
  const maxData = Math.max(spec.d1, spec.d2)
  const finalCw: number[] = []
  for (let i = 0; i < maxData; i++)
    for (const blk of dataBlocks) if (i < blk.length) finalCw.push(blk[i])
  for (let i = 0; i < spec.ecPer; i++)
    for (const blk of ecBlocks) finalCw.push(blk[i])

  const allBits: boolean[] = []
  for (const b of finalCw)
    for (let i = 7; i >= 0; i--) allBits.push(((b >> i) & 1) === 1)

  // —— 矩阵与功能图形 ——
  const n = 17 + 4 * ver
  const mk = (): boolean[][] => Array.from({ length: n }, () => Array(n).fill(false))
  const mods = mk()   // 已放置的功能图形值
  const isFn = mk()   // 功能图形/保留区标记

  const setFn = (r: number, c: number, v: boolean) => {
    if (r < 0 || c < 0 || r >= n || c >= n) return
    mods[r][c] = v
    isFn[r][c] = true
  }

  // 寻像图形（7×7：实心外环 + 白环 + 3×3 实心核）与分隔符白圈（外扩 1 圈留白）
  const finder = (r0: number, c0: number) => {
    for (let i = -1; i <= 7; i++)
      for (let j = -1; j <= 7; j++) {
        const on =
          i >= 0 && i <= 6 && j >= 0 && j <= 6 &&
          (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4))
        setFn(r0 + i, c0 + j, on)
      }
  }
  finder(0, 0)
  finder(0, n - 7)
  finder(n - 7, 0)

  // 定时图形（第 6 行/列；(6,7)/(7,6) 由循环天然跳过，落点奇偶正确）
  for (let i = 8; i < n - 8; i++) {
    setFn(6, i, i % 2 === 0)
    setFn(i, 6, i % 2 === 0)
  }

  // 对齐图形（v2+；跳过与寻像重叠的三角）
  if (ver >= 2) {
    for (const r of ALIGN[ver])
      for (const c of ALIGN[ver]) {
        if ((r <= 8 && c <= 8) || (r <= 8 && c >= n - 9) || (r >= n - 9 && c <= 8)) continue
        for (let i = -2; i <= 2; i++)
          for (let j = -2; j <= 2; j++)
            setFn(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1)
      }
  }

  // 暗模块（恒定深色，不参与掩码）
  setFn(n - 8, 8, true)

  // Format / Version 信息预留区（先占位标 fn，最后写入真实位）
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) { isFn[8][i] = true; isFn[i][8] = true }
  }
  for (let i = 0; i < 8; i++) { isFn[8][n - 1 - i] = true; isFn[n - 1 - i][8] = true }
  if (ver >= 7) {
    for (let r = 0; r < 6; r++)
      for (let c = n - 11; c < n - 8; c++) { isFn[r][c] = true; isFn[c][r] = true }
  }

  // —— 数据蛇形摆放（右下角起，两列一组自下而上/自上而下交替；跳过 col6） ——
  {
    let bitIdx = 0
    const total = allBits.length
    for (let right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5
      for (let vert = 0; vert < n; vert++) {
        // 列对（right, right-1）：偶数列（right≡0(mod4)，位于奇数行顶行）自下而上，
        // 奇数列（right≡1(mod4)，位于偶数行顶行）自上而下（跳过定时列 6）
        const upward = right % 4 === 0
        const r = upward ? n - 1 - vert : vert
        for (let j = 0; j < 2; j++) {
          const c = right - j
          if (c < 0 || isFn[r][c]) continue
          mods[r][c] = bitIdx < total ? allBits[bitIdx++] : false
        }
      }
    }
  }

  // —— 掩码择优（ISO 罚分 R1-R4） ——
  const applyMask = (mask: number): boolean[][] => {
    const out = mods.map((row) => row.slice())
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (!isFn[r][c] && maskBit(mask, r, c)) out[r][c] = !out[r][c]
    return out
  }
  const penalty = (m: boolean[][]): number => {
    let score = 0
    // 行/列内 ≥5 连续同色 → 3+(len-5)
    const lineScore = (get: (i: number, j: number) => boolean) => {
      for (let i = 0; i < n; i++) {
        let run = 1
        for (let j = 1; j < n; j++) {
          if (get(i, j) === get(i, j - 1)) run++
          else { if (run >= 5) score += 3 + (run - 5); run = 1 }
        }
        if (run >= 5) score += 3 + (run - 5)
      }
    }
    lineScore((r, c) => m[r][c])
    lineScore((c, r) => m[r][c])
    // 2×2 同色块 ×3
    for (let r = 0; r < n - 1; r++)
      for (let c = 0; c < n - 1; c++) {
        const v = m[r][c]
        if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3
      }
    // 1:1:3:1:1 图样（1011101）前后带 4 模块空白 → 11 位窗口 0x5D0/0x05D，×40
    for (let i = 0; i < n; i++) {
      let bCol = 0
      let bRow = 0
      for (let j = 0; j < n; j++) {
        bCol = ((bCol << 1) & 0x7ff) | (m[i][j] ? 1 : 0)
        if (j >= 10 && (bCol === 0x5d0 || bCol === 0x05d)) score += 40
        bRow = ((bRow << 1) & 0x7ff) | (m[j][i] ? 1 : 0)
        if (j >= 10 && (bRow === 0x5d0 || bRow === 0x05d)) score += 40
      }
    }
    // 深色占比每偏离 50% 达 5% 计 10 分
    let dark = 0
    for (const row of m) for (const v of row) if (v) dark++
    const k = Math.abs(Math.ceil((dark * 100) / (n * n) / 5) - 10)
    score += k * 10
    return score
  }
  let best = 0
  let bestScore = Infinity
  // 罚分须在「已含正确格式信息」的完整矩阵上计算：格式信息位也参与 R1-R4 评分
  for (let mask = 0; mask < 8; mask++) {
    const cand = applyMask(mask)
    writeFormat(cand, level, mask)
    const s = penalty(cand)
    if (s < bestScore) { bestScore = s; best = mask }
  }
  const final = applyMask(best)

  // —— Format Info 写入（ISO 18004 §8.9）——
  writeFormat(final, level, best)
  final[n - 8][8] = true // 暗模块（固定深色）

  // —— Version Info（v7+）：bit i → (i/3, i%3 + n-11) 及其转置（ISO 18004 §8.10） ——
  if (ver >= 7) {
    const vb = versionBits(ver) // vb[0]=bit17 … vb[17]=bit0；取 bit i = vb[17-i]
    for (let i = 0; i < 18; i++) {
      const r = Math.floor(i / 3)
      const c = (i % 3) + n - 11
      const mod = vb[17 - i]
      final[r][c] = mod
      final[c][r] = mod
    }
  }

  return final
}
