/**
 * AeroSearch 主副行翻转显示（text 机制移除后的双行行为）测试（等量替换，只增不删）。
 * 机制：主行 = label 恒定（label 命中位 <mark>）；副行 = description（query 非空且选项携
 * description 时统一显示小字 dimmed，description 命中位 <mark>）；query 空 = 仅主行。
 * 匹配算法 fuzzyMatch / props/events 公共 API 未动（AeroSearchOption.text 历史 API 已移除）。
 * jsdom 补 scrollIntoView 桩；watch(query) 更新 open 走 Vue 异步调度，setValue 后须 await nextTick。
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroSearch, type AeroSearchOption } from 'aero-vue'

beforeAll(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    writable: true,
    configurable: true,
    value: () => undefined,
  })
})

async function mountAndType(opts: AeroSearchOption[], q: string, extra: Record<string, unknown> = {}) {
  const w = mount(AeroSearch, { props: { options: opts, ...extra, limit: 12 } })
  w.find('input').trigger('focus')
  w.find('input').setValue(q)
  await nextTick()
  return w
}

// 主行 label 恒定、副行 description dimmed：n 经 description 'Nav' 命中（label 无 n），
// a 全 label 命中，na 经 description 双命中
const opts: AeroSearchOption[] = [
  { value: 'x1', label: 'Alpha', description: 'Nav' },
  { value: 'x2', label: 'Beta', description: 'Nav' },
  { value: 'y1', label: 'Gamma', description: 'Form' },
]

describe('AeroSearch 主副行翻转（label 主行 + description dimmed 副行）', () => {
  it('n 态：desc 命中项主行=label（无 mark）+ 副行=description（mark N）', async () => {
    const w = await mountAndType(opts, 'n', { showOptionDesc: true })
    expect(w.find('ul.aero-search__list').exists()).toBe(true)
    // n：Alpha/Beta label 无 n → 经 description 'Nav' 命中召回；Gamma label/description 均无 n 不召回
    const items = w.findAll('.aero-search__item')
    expect(items).toHaveLength(2)
    // 主行恒 label（Alpha/Beta，无 mark——n 不在 label 内）；副行 = description 'Nav' 且命中位 N 被 mark
    for (const it of items) {
      const main = it.findAll('span:not(.aero-search__sub)') // 主行 span（无 sub class）
      expect(main).toHaveLength(1)
      expect(main[0].text()).toMatch(/Alpha|Beta/) // 主行 = 组件名 label
      expect(main[0].html()).not.toContain('<mark>') // 主行无 n 命中位
      expect(it.find('.aero-search__sub mark').text()).toBe('N') // 副行 description 命中 N 高亮
      expect(it.find('.aero-search__sub').text()).toContain('Nav') // 副行文本 = description
    }
  })

  it('a 态：全 label 命中 → 主行 label（mark a）+ 副行 description（有 description 的才显示）', async () => {
    const w = await mountAndType(opts, 'a', { showOptionDesc: true })
    const items = w.findAll('.aero-search__item')
    expect(items).toHaveLength(3) // Alpha/Beta/Gamma label 均含 a
    // 主行 label 命中位 a 被 mark
    for (const it of items) {
      const mainMarks = it.findAll('span:not(.aero-search__sub) mark')
      // case 不敏感匹配命中位 mark 内容 = 原字符（Alpha 命中 'A'）→ 统一小写比较
      expect(mainMarks.map((m) => m.text().toLowerCase()).join('')).toBe('a')
    }
    // 副行：三项均携 description → 全显示副行；Gamma description 'Form' 无 a → 副行无 mark
    const subs = w.findAll('.aero-search__sub')
    expect(subs).toHaveLength(3)
    const gammaSub = items[2].find('.aero-search__sub')
    expect(gammaSub.html()).not.toContain('mark') // Form 无 a 命中位
  })

  it('na 态：description 子序列双命中（N+a）+ 主行 label 无 mark / 副行双 mark', async () => {
    const w = await mountAndType(opts, 'na', { showOptionDesc: true })
    const items = w.findAll('.aero-search__item')
    expect(items).toHaveLength(2) // Alpha/Beta 经 description 'Nav' 双命中；Gamma 'Form' 无 na
    for (const it of items) {
      const subMarks = it.findAll('.aero-search__sub mark').map((m) => m.text())
      expect(subMarks).toEqual(['N', 'a']) // 副行 description 命中 N+a
      // 主行 label（Alpha/Beta）无 na 子序列 → 主行无 mark
      const mainMarks = it.findAll('span:not(.aero-search__sub) mark')
      expect(mainMarks).toHaveLength(0)
    }
  })

  it('空 query：仅主行（无副行、无 mark）', async () => {
    const w = mount(AeroSearch, { props: { options: opts, limit: 12 } })
    w.find('input').trigger('focus')
    await nextTick()
    // focus 空态展开，shown = 原序全量，sub=''（query 空不出副行）
    const items = w.findAll('.aero-search__item')
    expect(items.length).toBe(3)
    expect(w.findAll('.aero-search__sub')).toHaveLength(0)
    for (const it of items) expect(it.html()).not.toContain('mark')
  })

  // group 字段硬红线 = 不参与匹配（防未来回归再造「万能词」）——
  // 同一选项集双臂对照：携 group（高频词 a/e）与 无 group，任意输入态召回逐项一致
  it('group 值不参与匹配（携高频词 group 与无 group 召回一致）', async () => {
    const withGroup: AeroSearchOption[] = [
      { value: 'x1', label: 'Alpha', description: 'Nav', group: 'a' },
      { value: 'x2', label: 'Beta', description: 'Nav', group: 'a' },
      { value: 'y1', label: 'Gamma', description: 'Form', group: 'e' },
      { value: 'z1', label: 'Omega', description: 'Xray', group: 'a' },
    ]
    const noGroup: AeroSearchOption[] = withGroup.map(({ group: _g, ...rest }) => rest as AeroSearchOption)
    const names = (w: Awaited<ReturnType<typeof mountAndType>>) =>
      w.findAll('.aero-search__item').map((i) => i.find('span:not(.aero-search__sub)').text())
    for (const q of ['a', 'e', 'z']) {
      const wNo = await mountAndType(noGroup, q)
      const wYes = await mountAndType(withGroup, q)
      expect(names(wYes)).toEqual(names(wNo)) // group 高频词 a/e 未渗入召回面
    }
    // 反向验证：z1（label/description 均不含 'z'）零召回，group 值不产生额外召回
    const wZ = await mountAndType(withGroup, 'z')
    expect(wZ.findAll('.aero-search__item')).toHaveLength(0)
    // 组标题面：groupBy='group' 时组标题 = group 值（与 description 解耦，渲染态由 G9 五态 DOM 断言复核）
    const wG = mount(AeroSearch, { props: { options: withGroup, limit: 12, groupBy: 'group' } })
    wG.find('input').trigger('focus')
    await nextTick()
    const groupTitles = wG.findAll('.aero-search__group').map((g) => g.text())
    expect(groupTitles.sort()).toEqual(['a', 'e'])
  })

  // ── showOptionDesc 新 prop：默认关 = 任何状态无副行；开 = 渲染副行 + 命中 mark ──
  it('默认关（showOptionDesc 缺省）：携 description 项在所有状态无副行', async () => {
    // n 态：Alpha/Beta 经 description 'Nav' 命中召回，但副行默认不渲染
    const wN = await mountAndType(opts, 'n')
    expect(wN.findAll('.aero-search__item')).toHaveLength(2) // 描述仍参与匹配召回（召回面不变）
    expect(wN.findAll('.aero-search__sub')).toHaveLength(0) // 副行默认关闭
    // a 态：全 label 命中，副行仍无
    const wA = await mountAndType(opts, 'a')
    expect(wA.findAll('.aero-search__item')).toHaveLength(3)
    expect(wA.findAll('.aero-search__sub')).toHaveLength(0)
    // 空 query：无副行
    const w0 = mount(AeroSearch, { props: { options: opts, limit: 12 } })
    w0.find('input').trigger('focus')
    await nextTick()
    expect(w0.findAll('.aero-search__sub')).toHaveLength(0)
  })

  it('开（showOptionDesc=true）：渲染副行 + 命中位 mark + 副行视觉可区分主行（计算样式）', async () => {
    // 注入副行规格的全局规则（scoped 0.8em/opacity 在 jsdom 不可解析 → 用等价具体值代表副行规格），
    // 用于验证「副行独立行 + 字号/颜色区别于主行」的结构与可区分性
    const st = document.createElement('style')
    st.textContent =
      '.aero-search__sub { display: block; font-size: 11px; color: rgb(126, 147, 168); }'
    document.head.appendChild(st)
    const w = await mountAndType(opts, 'na', { showOptionDesc: true })
    const items = w.findAll('.aero-search__item')
    expect(items).toHaveLength(2)
    for (const it of items) {
      const sub = it.find('.aero-search__sub')
      expect(sub.exists()).toBe(true) // 携 description 项渲染副行
      // 命中位 mark：na → N + a 均高亮
      expect(sub.findAll('mark').map((m) => m.text())).toEqual(['N', 'a'])
      // 主行 = label（Alpha/Beta，无 na 子序列 → 主行无 mark）
      const main = it.find('span:not(.aero-search__sub)')
      expect(main.findAll('mark')).toHaveLength(0)
      // 副行视觉可区分：font-size 与 color 均不同于主行（计算样式断言）
      const subFont = getComputedStyle(sub.element as HTMLElement).fontSize
      const mainFont = getComputedStyle(main.element as HTMLElement).fontSize
      const subColor = getComputedStyle(sub.element as HTMLElement).color
      const mainColor = getComputedStyle(main.element as HTMLElement).color
      expect(subFont).toBe('11px') // 副行小字（≤主行）
      expect(mainFont).not.toBe('11px') // 主行字号 ≠ 副行
      expect(subColor).toBe('rgb(126, 147, 168)') // 副行淡色（次要文本）
      expect(mainColor).not.toBe('rgb(126, 147, 168)') // 主行颜色 ≠ 副行
    }
    st.remove()
  })
})
