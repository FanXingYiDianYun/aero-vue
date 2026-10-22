/**
 * 礼花特效（useParty）—— 1:1 移植 DEMO.html party()
 * WAAPI 事件驱动、有限时长（符合 GPU 隔离方案，非常驻动画）
 * prefers-reduced-motion 下静默不渲染
 */
const reduceMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** 在视口坐标 (x,y) 触发礼花：礼花环 + 🎉 + 32 彩带 + 5 星芒 */
export function party(x: number, y: number) {
  if (reduceMotion()) return
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--ui-brand').trim() || '#0EBFFF'
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--ui-ink').trim() || '#0C1B2A'
  const ok = getComputedStyle(document.documentElement).getPropertyValue('--ui-ok').trim() || '#12B886'

  // —— 礼花环（ringPop） ——
  const ring = document.createElement('span')
  ring.className = 'aero-party-ring'
  ring.style.left = x + 'px'
  ring.style.top = y + 'px'
  document.body.appendChild(ring)
  setTimeout(() => ring.remove(), 600)

  // —— 🎉 弹出 ——
  const pop = document.createElement('div')
  pop.className = 'aero-party-emoji'
  pop.textContent = '🎉'
  pop.style.left = x + 'px'
  pop.style.top = y + 'px'
  document.body.appendChild(pop)
  pop
    .animate(
      [
        { transform: 'translate(-50%,-50%) scale(.2) rotate(-24deg)', opacity: 0 },
        { transform: 'translate(-50%,-135%) scale(1.25) rotate(10deg)', opacity: 1, offset: 0.35 },
        { transform: 'translate(-50%,-210%) scale(1) rotate(-6deg)', opacity: 0 },
      ],
      { duration: 950, easing: 'cubic-bezier(.2,.8,.3,1)' },
    )
    .onfinish = () => pop.remove()

  // —— 32 条彩带（丝带/纸屑混合形态） ——
  const colors = [brand, ok, '#FFD166', '#FF8FA3', '#B5A9FF', ink]
  for (let i = 0; i < 32; i++) {
    const rib = document.createElement('i')
    rib.className = 'aero-party-ribbon'
    const w = 4 + Math.random() * 5
    const h = 9 + Math.random() * 13
    const c = colors[Math.floor(Math.random() * colors.length)]
    const round = Math.random()
    rib.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:${
      round > 0.55 ? '99px' : round > 0.3 ? '2px 7px 99px 2px' : '2px'
    }`
    document.body.appendChild(rib)
    const ang = (-20 - Math.random() * 140) * (Math.PI / 180)
    const dist = 70 + Math.random() * 130
    const tx = Math.cos(ang) * dist
    const ty = Math.sin(ang) * dist
    const r1 = Math.random() * 520 - 260
    const r2 = r1 + (Math.random() * 360 - 180)
    rib
      .animate(
        [
          { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) rotate(${r1}deg)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(calc(-50% + ${tx * 1.18}px),calc(-50% + ${ty + 165}px)) rotate(${r2}deg)`,
            opacity: 0,
          },
        ],
        { duration: 950 + Math.random() * 550, easing: 'cubic-bezier(.2,.75,.35,1)' },
      )
      .onfinish = () => rib.remove()
  }

  // —— 5 星芒 ——
  for (let i = 0; i < 5; i++) {
    const sp = document.createElement('span')
    sp.className = 'aero-party-star'
    sp.textContent = '✦'
    sp.style.cssText = `left:${x}px;top:${y}px;color:${brand};font-size:${10 + Math.random() * 8}px`
    document.body.appendChild(sp)
    const a = Math.random() * Math.PI * 2
    const d = 34 + Math.random() * 44
    sp
      .animate(
        [
          { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) scale(1.1)`,
            opacity: 0,
          },
        ],
        { duration: 620, easing: 'ease-out' },
      )
      .onfinish = () => sp.remove()
  }
}

export function useParty() {
  return { party }
}
