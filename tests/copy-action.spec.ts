// CodeBlock 复制回退路径——jsdom 无 navigator.clipboard（等价非安全上下文），
// 断言 execCommand('copy') 回退被调用且 textarea 携带源码；双败时不显示已复制。
import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AeroCodeBlock } from 'aero-vue'

const CODE = "const a = 1\nconsole.log(a)"

describe('code-block copy fallback', () => {
  let cleanup: (() => void) | null = null
  afterEach(() => { cleanup?.(); cleanup = null })

  it('无 clipboard → execCommand 回退被调用，textarea 值=源码，is-copied 出现', async () => {
    // jsdom：navigator.clipboard 本就 undefined（writeText 抛 TypeError → 走回退）
    const calls: Array<{ tag: string; value: string }> = []
    let ret = true
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: (cmd: string) => {
        if (cmd !== 'copy') return false
        const ta = document.querySelector('textarea')
        calls.push({ tag: cmd, value: ta ? ta.value : '' })
        return ret
      },
    })
    cleanup = () => { delete (document as any).execCommand }

    const w = mount(AeroCodeBlock, { props: { code: CODE } })
    await w.find('.aero-cw__copy').trigger('click')
    await nextTick()
    await new Promise((r) => setTimeout(r, 0)) // 等 onCopy 的 try/catch microtask 排空
    await nextTick()

    expect(calls.length).toBe(1)
    expect(calls[0].value).toBe(CODE)
    expect(w.find('.aero-cw__copy.is-copied').exists()).toBe(true)
    // 临时 textarea 必须已移除（不留 DOM 垃圾）
    expect(document.querySelector('textarea')).toBe(null)
  })

  it('两路都失败 → console.warn 且不显示已复制（禁止撒谎）', async () => {
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: () => false,
    })
    cleanup = () => { delete (document as any).execCommand }
    const warns: unknown[][] = []
    const origWarn = console.warn
    console.warn = (...a: unknown[]) => { warns.push(a) }
    cleanup = () => { console.warn = origWarn; delete (document as any).execCommand }

    const w = mount(AeroCodeBlock, { props: { code: CODE } })
    await w.find('.aero-cw__copy').trigger('click')
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    await nextTick()

    expect(warns.length).toBe(1)
    expect(String(warns[0][0])).toContain('copy failed')
    expect(w.find('.aero-cw__copy.is-copied').exists()).toBe(false)
  })
})
