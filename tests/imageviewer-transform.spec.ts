// ImageViewer 缩放/旋转围绕图片中心（transform-origin: center）静态守卫——
// 防回退 0 0（绕左上角观感「歪」）；捏合锚点公式须含 origin=center 的左上角补差项。
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const here = resolve(__dirname, '..')

describe('ImageViewer 变换原点 center（非 0 0）', () => {
  it('aero-viewer__img transform-origin=center + 捏合公式含中心补差项', () => {
    const sfc = readFileSync(resolve(here, 'src/components/image-viewer/src/image-viewer.vue'), 'utf8')
    const style = sfc.slice(sfc.indexOf('<style'))
    // transform-origin 必须是 center（元素中心），不得回退 0 0
    expect(style).toMatch(/transform-origin:\s*center/)
    expect(style).not.toMatch(/transform-origin:\s*0\s+0/)
    // 捏合锚点须含中心补差（pinchOriginFix 补差项 C·(k/s0 − 1)）
    const script = sfc.slice(0, sfc.indexOf('</script>'))
    expect(script).toMatch(/pinchOriginFix|center\.value/)
    // 补差函数存在且基于 center ref
    expect(script).toMatch(/function\s+(pinchOriginFix|centerCompensate)/)
  })
})
