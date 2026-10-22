/**
 * 裁剪结果：多尺寸导出的单档。
 * @property size  目标边长 px
 * @property url   dataURL（png）
 * @property blob  对应 Blob（供上传/下载）
 */
export interface CropResult {
  size: number
  url: string
  blob: Blob
}

export interface CropFrameState {
  cx: number
  cy: number
  size: number
  rot: number
}

/** 工具栏文案（i18n：默认中文，可整体覆盖）。
 * 缺省值不内联中文——取 zh-cn 词包 cropper 组（词包是唯一文案真源，
 * 避免 src 域 CJK；脱离词包的兜底行为不变：未传 labels 时回落中文） */
import { zhCn } from '../../locale/zh-cn'

export interface CropperLabels {
  upload: string
  enlarge: string
  shrink: string
  rotate90: string
  reset: string
  export: string
  hint: string
  empty: string
  ready: string
  /** 画布 meta 行（框尺寸 + 旋转角），可整体覆盖 */
  metaFrame?: (size: number, rot: number) => string
}

export const defaultCropperLabels: CropperLabels = { ...zhCn.cropper }
