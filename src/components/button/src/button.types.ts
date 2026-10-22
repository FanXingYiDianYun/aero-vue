export type AeroButtonType = 'primary' | 'outline' | 'ghost' | 'danger' | 'dark'
export type AeroButtonSize = 'sm' | 'md' | 'lg'

export interface AeroButtonProps {
  /** 视觉类型 */
  type?: AeroButtonType
  /** 尺寸 */
  size?: AeroButtonSize
  /** 禁用 */
  disabled?: boolean
  /** 加载态（文字隐藏 + spinner） */
  loading?: boolean
  /** 块级撑满 */
  block?: boolean
  /** 正方形图标按钮（42px） */
  iconOnly?: boolean
  /** 关闭涟漪特效（默认开启） */
  ripple?: boolean
  /** 原生 type 属性 */
  nativeType?: 'button' | 'submit' | 'reset'
}
