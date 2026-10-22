import type { AeroIconName } from '../../icon/src/paths'

export interface AeroDropdownItem {
  key: string
  label: string
  icon?: AeroIconName
  /** 描述小字 */
  desc?: string
  disabled?: boolean
  /** 危险项（红字） */
  danger?: boolean
  divided?: boolean
}
