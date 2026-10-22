export interface AeroTableColumn {
  key: string
  title: string
  width?: string
  /** mono 字体列（代码感） */
  mono?: boolean
}

export interface AeroTableProps {
  columns: AeroTableColumn[]
  data: Record<string, any>[]
  /** 空态文案 */
  emptyText?: string
}
