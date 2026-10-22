export type AeroBadgeType = 'solid' | 'soft' | 'line' | 'dark' | 'ok' | 'warn' | 'err'

export interface AeroBadgeProps {
  /** 徽标配色类型（默认：'soft'） */
  type?: AeroBadgeType
  /** 前置圆点 */
  dot?: boolean
}
