export type AeroMarqueeVariant = 'brand' | 'type'

export interface AeroMarqueeProps {
  /** 展示模式：brand=品牌行（图标+词），type=大字带（描边/实底交替） */
  variant?: AeroMarqueeVariant
  /** 顶层提示文案（brand 模式），如「他们都在用」 */
  caption?: string
  /** 内容项：brand 模式用 icon+text；type 模式用 text，solid 标实底 */
  items?: { icon?: string; text: string; solid?: boolean }[]
  /** 速度（秒），默认 brand 28 / type 34 */
  duration?: number
  /** hover 暂停 */
  pauseOnHover?: boolean
}
