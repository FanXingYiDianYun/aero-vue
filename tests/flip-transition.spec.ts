// InputTag 删除补位 FLIP——后续标签 TransitionGroup move 类 + translate transform
//
// 机制：Vue TransitionGroup onUpdated → recordPosition(旧位) / applyTranslation(新位)
// 把「旧left - 新left」写进 el.style.transform（First+Last+Play），挂 move 类 +
// transition（时长/缓动读 .itag-flip-move CSS 规则的 MotionPresets token）交给
// CSS 过渡补位；真实浏览器里 applyTranslation 写完 transform 立即清空
// style.transform，靠 transition 完成滑动。jsdom 下 CSS 过渡不真跑，故本用例
// 在 applyTranslation 写入瞬间（style.transform setter）抓下数值 + 校验 move 类，
// 作为「FLIP 补位已执行」证据。
// jsdom 说明：SFC <style> 不进 computedStyle；Vue hasCSSTransform 会克隆节点读
// computed，故 test 内 mock getComputedStyle 回退读元素 inline transition。
import { it, expect, describe, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroInputTag } from 'aero-vue'

function stubRect(el: HTMLElement, lefts: [number, number], callRef: { n: number }) {
  el.getBoundingClientRect = () => {
    const left = callRef.n === 0 ? lefts[0] : lefts[1]
    callRef.n++
    return { left, top: 0, width: 40, height: 20, right: left + 40, bottom: 20, x: left, y: 0 } as DOMRect
  }
}

describe('InputTag FLIP 补位', () => {
  let origGcs: typeof window.getComputedStyle
  beforeAll(() => {
    origGcs = window.getComputedStyle
    window.getComputedStyle = ((el: Element, pseudo?: string) => {
      const s = origGcs(el, pseudo) as CSSStyleDeclaration
      const inline = (el as HTMLElement).style
      const tp = (inline.transitionProperty || s.transitionProperty || '').split(',').map((x) => x.trim()).filter(Boolean)
      const td = (inline.transitionDuration || s.transitionDuration || '').split(',').map((x) => x.trim()).filter(Boolean)
      const object = s as unknown as Record<string, unknown>
      const getter = (val: string, arr: string[]) => ({ get: () => (val || arr.join(', ') || 'all 0s') })
      Object.defineProperty(object, 'transitionProperty', getter(tp[0] || '', tp))
      Object.defineProperty(object, 'transitionDuration', getter(td[0] || '', td))
      return s
    }) as typeof window.getComputedStyle
  })
  afterAll(() => {
    window.getComputedStyle = origGcs
  })

  it('删除标签后后续标签获 itag-flip-move 类 + 补位 transform', async () => {
    // test-utils 默认 stub 掉组件内 <TransitionGroup>（渲染成 transition-group-stub，
    // FLIP 逻辑不运行）→ 关闭该 stub 用真实 TransitionGroup
    const w = mount(AeroInputTag, {
      props: { modelValue: ['a', 'b', 'c'] },
      global: { stubs: { 'transition-group': false } },
    })

    const els = w.findAll('.aero-input-tag__chip').map((e) => e.element)
    expect(els.length).toBe(3)
    // 模拟布局：删 'a' 后 b/c 各左移 50px（首帧旧位 / 次帧新位）
    const refs: { n: number }[] = [{ n: 0 }, { n: 0 }, { n: 0 }]
    stubRect(els[0], [0, 0], refs[0])
    stubRect(els[1], [60, 10], refs[1])
    stubRect(els[2], [110, 60], refs[2])
    // 等价 itag-flip-move 类提供的 transition（SFC style 在 jsdom 不进 computed）
    for (const el of els) {
      const s = (el as HTMLElement).style
      s.transitionProperty = 'transform'
      s.transitionDuration = '0.3s'
      s.transitionTimingFunction = 'cubic-bezier(.3, 1.4, .4, 1)'
    }
    // 抓 applyTranslation 写入的 FLIP transform（真实浏览器随后清空，此处记录峰值）
    const applied = new Map<HTMLElement, string>()
    for (const el of els) {
      const style = (el as HTMLElement).style
      let cur = ''
      Object.defineProperty(style, 'transform', {
        configurable: true,
        get: () => cur,
        set: (v: string) => {
          cur = v
          if (v) applied.set(el, v)
        },
      })
    }

    await w.setProps({ modelValue: ['b', 'c'] })
    await nextTick()

    // 剩余节点 = b/c（move 类）+ 'a'（leave 类，尚未移除）
    const chips = w.findAll('.aero-input-tag__chip')
    const moved = chips.filter((c) => c.classes().includes('itag-flip-move'))
    expect(moved.length).toBe(2)
    expect(moved.map((c) => c.text())).toEqual(['b', 'c'])
    // FLIP 数值：旧位 - 新位 = 各左移 50px（First/Last/Play 证据）
    expect(applied.get(els[1])).toContain('translate(50px')
    expect(applied.get(els[2])).toContain('translate(50px')
    // 补位过渡属性（motion-presets token：--ui-dur-mid/--ui-spring）在 move 元素上生效
    expect(getComputedStyle(moved[0].element as HTMLElement).transitionProperty).toContain('transform')
  })
})

