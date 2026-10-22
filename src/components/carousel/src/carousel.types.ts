export interface AeroCarouselSlide {
  /** 主标语（西文轴） */
  en: string
  /** 副文案 */
  zh?: string
  /** 角标 chip */
  chip?: string
  /** 背景：a=品牌 b=墨色 c=浅底 */
  tone?: 'a' | 'b' | 'c'
}
