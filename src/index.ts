/**
 * Aero UI —— Vue 3 组件库入口
 * 支持全量注册 app.use(AeroUI) 与按需引入 import { AeroButton } from 'aero-vue'
 */
import type { App, Plugin } from 'vue'
import { allComponents } from './components-registry'
// 内置 webfont（JetBrains Mono，SIL OFL 1.1——许可全文见 src/styles/fonts/OFL.txt）；
// 随库构建进 dist/styles.css + woff2 资产，消费端引 aero-vue 即自动生效。
import './styles/fonts.scss'

// —— Basic 基础类 ——
export { AeroButton } from './components/button'
export { AeroButtonGroup } from './components/button-group'
export { AeroIcon, iconPaths, type AeroIconName } from './components/icon'
export { AeroIconButton } from './components/icon-button'
export { AeroLink } from './components/link'
export { AeroTypography } from './components/typography'
export { AeroDivider } from './components/divider'
export { AeroSpace } from './components/space'
export { AeroScrollbar } from './components/scrollbar'
export { AeroGrid } from './components/grid'
export { AeroLayout } from './components/layout'
export { AeroThemeSwitch } from './components/theme-switch'

// —— Form 表单类 ——
export { AeroInput } from './components/input'
export { AeroTextarea } from './components/textarea'
export { AeroInputNumber } from './components/input-number'
export { AeroInputTag } from './components/input-tag'
export { AeroSearch } from './components/search'
export type { AeroSearchOption } from './components/search'
export { AeroSelect } from './components/select'
export type { AeroSelectOption } from './components/select'
export { AeroCascader } from './components/cascader'
export { AeroTreeSelect } from './components/tree-select'
export { AeroDatePicker } from './components/date-picker'
export { AeroTimePicker } from './components/time-picker'
export { AeroCheckbox } from './components/checkbox'
export { AeroCheckboxGroup } from './components/checkbox-group'
export { AeroRadio } from './components/radio'
export { AeroRadioGroup } from './components/radio-group'
export { AeroSwitch } from './components/switch'
export { AeroSlider } from './components/slider'
export { AeroRate } from './components/rate'
export { AeroColorPicker } from './components/color-picker'
export { AeroUpload } from './components/upload'
export type { UploadFile, UploadStatus, BeforeUploadHook } from './components/upload'
export { AeroTransfer } from './components/transfer'
export { AeroAutocomplete } from './components/autocomplete'
export type { AutoSuggestion } from './components/autocomplete'
export { AeroMention } from './components/mention'
export { AeroOTP } from './components/otp'
export { AeroForm } from './components/form'
export { AeroFormItem } from './components/form-item'

// —— DataDisplay 数据展示类 ——
export { AeroTable } from './components/table'
export type { AeroTableColumn } from './components/table'
export { AeroTree } from './components/tree'
export type { AeroTreeNode } from './components/tree'
export { deriveCheckState, collectKeys, type TreeCheckState } from './components/tree'
export { AeroTimeline } from './components/timeline'
export type { AeroTimelineItem } from './components/timeline'
export { AeroTag } from './components/tag'
export { AeroBadge } from './components/badge'
export { AeroAvatar } from './components/avatar'
export { AeroAvatarGroup } from './components/avatar-group'
export { AeroCropper, defaultCropperLabels } from './components/cropper'
export type { CropResult, CropFrameState, CropperLabels } from './components/cropper'
export { AeroCard } from './components/card'
export { AeroCarousel } from './components/carousel'
export { AeroCollapse } from './components/collapse'
export { AeroDescriptions } from './components/descriptions'
export { AeroEmpty } from './components/empty'
export { AeroImage } from './components/image'
export { AeroImageViewer } from './components/image-viewer'
export { AeroPagination } from './components/pagination'
export { AeroProgress } from './components/progress'
export { AeroRingProgress } from './components/ring-progress'
export { AeroResult } from './components/result'
export { AeroSegmented } from './components/segmented'
export { AeroSkeleton } from './components/skeleton'
export { AeroSpinner } from './components/spinner'
export { AeroStatistic } from './components/statistic'
export { AeroQRCode } from './components/qrcode'
export { AeroWatermark } from './components/watermark'
export { AeroTerminal } from './components/terminal'
export type { TermLine } from './components/terminal'
export { AeroCodeBlock } from './components/code-block'
export { highlightLine } from './components/code-block'

// —— Navigation 导航类 ——
export { AeroMenu } from './components/menu'
export type { MenuItem } from './components/menu'
export { AeroTabs } from './components/tabs'
export { AeroBreadcrumb } from './components/breadcrumb'
export { AeroDropdown } from './components/dropdown'
export type { AeroDropdownItem } from './components/dropdown'
export { AeroSteps } from './components/steps'
export { AeroPageHeader } from './components/page-header'
export { AeroAnchor } from './components/anchor'
export { AeroAffix } from './components/affix'
export { AeroBackTop } from './components/back-top'
export { AeroTour } from './components/tour'

// —— Feedback 反馈类 ——
export { AeroDialog } from './components/dialog'
export { AeroDrawer } from './components/drawer'
export { AeroMessageBox } from './components/message-box'
export { AeroNotification } from './components/notification'
export { AeroAlert } from './components/alert'
export { AeroLoading } from './components/loading'
export { AeroPopover } from './components/popover'
export { AeroPopconfirm } from './components/popconfirm'
export { AeroTooltip } from './components/tooltip'
export { AeroToast } from './components/toast'
export { AeroChip } from './components/chip'
export { AeroAnnounce } from './components/announce'

// —— Others 配置/增强类 ——
export { AeroConfigProvider } from './components/config-provider'
export { AeroThemeProvider } from './components/theme-provider'
export { AeroMotionPresets } from './components/motion-presets'
export type { MotionName } from './components/motion-presets'
export { AeroDotField } from './components/dot-field'
export { AeroMarquee } from './components/marquee'
export { AeroIridescentThreads } from './components/iridescent-threads'
export { AeroParallaxBox } from './components/parallax-box'

// —— Mobile 移动端组件（demo 忠实还原） ——
export { AeroPhone } from './components/phone'
export { AeroMobileCarousel, type AeroMobileCarouselSlide } from './components/mobile-carousel'
export { AeroMobileStatCard, type AeroSparkPoint } from './components/mobile-stat-card'
export { AeroMobileTabBar, type AeroMobileTabItem } from './components/mobile-tab-bar'
export { AeroSwipeDeck, type AeroSwipeCard } from './components/swipe-deck'
export { AeroActionButtons } from './components/action-buttons'
export { AeroSlideGo } from './components/slide-go'
export { AeroSortList, type AeroSortItem } from './components/sort-list'
export { AeroBottomSheet } from './components/bottom-sheet'
export { AeroKnob } from './components/knob'
export { AeroPullToRefresh, type AeroPtrItem } from './components/pull-to-refresh'

// —— composables / utils / i18n ——
export * from './composables'
export { formatSize } from './utils'
export { AeroUIResolver } from './resolver'
export * from './locale'

// —— 全量注册 ——
const installer: Plugin = {
  install(app: App) {
    allComponents.forEach((c) => {
      const comp = c as { name?: string }
      if (comp.name) app.component(comp.name, c)
    })
  },
}

export default installer
