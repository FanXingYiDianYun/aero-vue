// 自动生成：jsdom 测试环境 polyfill（勿手改）
// 组件依赖这些浏览器 API；jsdom 未实现 → 提供最小 stub，仅够 mount/卸载不抛错
import { vi } from 'vitest'

// 1. canvas / 2d context（cropper、watermark、qrcode 等）
function makeCtx2d() {
  return new Proxy({}, {
    get(_t, p) {
      if (p === 'canvas') return { width: 100, height: 100 }
      // toDataURL / measureText / getImageData 等返回合理值
      if (p === 'measureText') return (s) => ({ width: String(s).length * 8 })
      if (p === 'getImageData') return () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })
      if (p === 'createImageData') return () => ({ data: new Uint8ClampedArray(4) })
      if (p === 'toDataURL') return () => 'data:image/png;base64,'
      // 其余方法/属性 → no-op 函数
      return vi.fn()
    },
    set() { return true },
  })
}
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') return makeCtx2d()
    return null
  }
  HTMLCanvasElement.prototype.toBlob = function (cb) {
    cb(new Blob([''], { type: 'image/png' }))
  }
  HTMLCanvasElement.prototype.toDataURL = function () {
    return 'data:image/png;base64,'
  }
}

// 2. ResizeObserver（menu/segmented/collapse 等做实测定位）
class ROStub {
  constructor(cb) { this.cb = cb }
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ROStub
  window.ResizeObserver = ROStub
}

// 3. matchMedia（config-provider / theme 等可能查询）
if (typeof window.matchMedia === 'undefined') {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false },
  })
}

// 4. Pointer capture（usePointerDrag 等）—— jsdom 的 Element 无这方法
if (typeof Element !== 'undefined') {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = vi.fn()
    Element.prototype.releasePointerCapture = vi.fn()
  }
  // jsdom PointerEvent 可能缺
  if (typeof globalThis.PointerEvent === 'undefined') {
    globalThis.PointerEvent = class PointerEvent extends Event {
      constructor(type, init = {}) {
        super(type, init)
        this.pointerId = init.pointerId ?? 1
        this.clientX = init.clientX ?? 0
        this.clientY = init.clientY ?? 0
        this.pointerType = init.pointerType ?? 'mouse'
      }
    }
  }
}

// 5. requestAnimationFrame / cancelAnimationFrame（count-up / rAF 滚动）
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  let rafId = 0
  globalThis.requestAnimationFrame = (cb) => { rafId++; setTimeout(() => cb(performance.now()), 0) }
  globalThis.cancelAnimationFrame = (id) => { rafId-- }
}

// 6. IntersectionObserver（carousel 离屏暂停等）
class IOStub {
  constructor(cb) { this.cb = cb }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
if (typeof IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = IOStub
  window.IntersectionObserver = IOStub
}

// 7. Element.animate（WAAPI —— knob/sort-list/swipe-deck 弹跳）
if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  Element.prototype.animate = vi.fn(() => ({
    onfinish: null,
    cancel() {},
    finish() {},
    play() {},
    pause() {},
    addEventListener() {},
  }))
}

// 8. DOMMatrixReadOnly（slide-go/bottom-sheet 读 transform）—— jsdom 缺失
if (typeof globalThis.DOMMatrixReadOnly === 'undefined') {
  globalThis.DOMMatrixReadOnly = class DOMMatrixReadOnly {
    constructor(init) {
      this.m41 = 0
      this.f = 0
      if (typeof init === 'string') {
        // 简易解析 translateX(px)
        const m = init.match(/matrix\([\d.]+,\s*[\d.]+,\s*[\d.]+,\s*[\d.]+,\s*([\d.-]+),\s*([\d.-]+)/)
        if (m) { this.m41 = Number(m[1]); this.f = Number(m[2]) }
      }
    }
  }
}
