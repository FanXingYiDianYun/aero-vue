import type { AeroIconName } from '../../icon/src/paths'

export interface AeroTimelineItem {
  /** 节点图标 */
  icon?: AeroIconName
  /** 日期行文字 */
  date?: string
  /** 小徽章文字（品牌底旋转贴纸） */
  chip?: string
  /** 标题 */
  title: string
  /** 描述 */
  desc?: string
}
