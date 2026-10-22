export interface AeroTreeNode {
  key: string
  label: string
  children?: AeroTreeNode[]
  /** 禁用勾选 */
  disabled?: boolean
}
