/**
 * 全量组件注册表（app.use(AeroUI) 时遍历注册）
 */
import type { Plugin } from 'vue'
import { AeroActionButtons } from './components/action-buttons'
import { AeroAlert } from './components/alert'
import { AeroAnnounce } from './components/announce'
import { AeroAutocomplete } from './components/autocomplete'
import { AeroBottomSheet } from './components/bottom-sheet'
import { AeroKnob } from './components/knob'
import { AeroMobileCarousel } from './components/mobile-carousel'
import { AeroMobileStatCard } from './components/mobile-stat-card'
import { AeroMobileTabBar } from './components/mobile-tab-bar'
import { AeroPhone } from './components/phone'
import { AeroPullToRefresh } from './components/pull-to-refresh'
import { AeroSlideGo } from './components/slide-go'
import { AeroSortList } from './components/sort-list'
import { AeroSwipeDeck } from './components/swipe-deck'
import { AeroAvatar } from './components/avatar'
import { AeroAvatarGroup } from './components/avatar-group'
import { AeroBackTop } from './components/back-top'
import { AeroBadge } from './components/badge'
import { AeroBreadcrumb } from './components/breadcrumb'
import { AeroButton } from './components/button'
import { AeroButtonGroup } from './components/button-group'
import { AeroCard } from './components/card'
import { AeroCarousel } from './components/carousel'
import { AeroCascader } from './components/cascader'
import { AeroCheckbox } from './components/checkbox'
import { AeroCheckboxGroup } from './components/checkbox-group'
import { AeroChip } from './components/chip'
import { AeroCodeBlock } from './components/code-block'
import { AeroCollapse } from './components/collapse'
import { AeroColorPicker } from './components/color-picker'
import { AeroConfigProvider } from './components/config-provider'
import { AeroDatePicker } from './components/date-picker'
import { AeroDescriptions } from './components/descriptions'
import { AeroDialog } from './components/dialog'
import { AeroDivider } from './components/divider'
import { AeroDotField } from './components/dot-field'
import { AeroDrawer } from './components/drawer'
import { AeroDropdown } from './components/dropdown'
import { AeroEmpty } from './components/empty'
import { AeroForm } from './components/form'
import { AeroFormItem } from './components/form-item'
import { AeroGrid } from './components/grid'
import { AeroIcon } from './components/icon'
import { AeroIconButton } from './components/icon-button'
import { AeroImage } from './components/image'
import { AeroImageViewer } from './components/image-viewer'
import { AeroInput } from './components/input'
import { AeroInputNumber } from './components/input-number'
import { AeroInputTag } from './components/input-tag'
import { AeroLayout } from './components/layout'
import { AeroLink } from './components/link'
import { AeroLoading } from './components/loading'
import { AeroMarquee } from './components/marquee'
import { AeroIridescentThreads } from './components/iridescent-threads'
import { AeroParallaxBox } from './components/parallax-box'
import { AeroMenu } from './components/menu'
import { AeroMention } from './components/mention'
import { AeroMessageBox } from './components/message-box'
import { AeroMotionPresets } from './components/motion-presets'
import { AeroNotification } from './components/notification'
import { AeroOTP } from './components/otp'
import { AeroPageHeader } from './components/page-header'
import { AeroPagination } from './components/pagination'
import { AeroPopconfirm } from './components/popconfirm'
import { AeroPopover } from './components/popover'
import { AeroProgress } from './components/progress'
import { AeroQRCode } from './components/qrcode'
import { AeroRadio } from './components/radio'
import { AeroRadioGroup } from './components/radio-group'
import { AeroRate } from './components/rate'
import { AeroResult } from './components/result'
import { AeroRingProgress } from './components/ring-progress'
import { AeroScrollbar } from './components/scrollbar'
import { AeroSegmented } from './components/segmented'
import { AeroSelect } from './components/select'
import { AeroSkeleton } from './components/skeleton'
import { AeroSlider } from './components/slider'
import { AeroSpace } from './components/space'
import { AeroSearch } from './components/search'
import { AeroSpinner } from './components/spinner'
import { AeroStatistic } from './components/statistic'
import { AeroSteps } from './components/steps'
import { AeroSwitch } from './components/switch'
import { AeroTable } from './components/table'
import { AeroTabs } from './components/tabs'
import { AeroTag } from './components/tag'
import { AeroTerminal } from './components/terminal'
import { AeroTextarea } from './components/textarea'
import { AeroThemeSwitch } from './components/theme-switch'
import { AeroTimeline } from './components/timeline'
import { AeroTimePicker } from './components/time-picker'
import { AeroToast } from './components/toast'
import { AeroTooltip } from './components/tooltip'
import { AeroTour } from './components/tour'
import { AeroTransfer } from './components/transfer'
import { AeroTree } from './components/tree'
import { AeroTreeSelect } from './components/tree-select'
import { AeroTypography } from './components/typography'
import { AeroUpload } from './components/upload'
import { AeroWatermark } from './components/watermark'

export const allComponents = [
  AeroAlert, AeroAnnounce, AeroAutocomplete, AeroAvatar, AeroAvatarGroup, AeroBackTop, AeroBadge,
  AeroBreadcrumb, AeroButton, AeroButtonGroup, AeroCard, AeroCarousel, AeroCascader,
  AeroCheckbox, AeroCheckboxGroup, AeroChip, AeroCodeBlock, AeroCollapse, AeroColorPicker,
  AeroConfigProvider, AeroDatePicker, AeroDescriptions, AeroDialog, AeroDivider, AeroDotField,
  AeroDrawer, AeroDropdown, AeroEmpty, AeroForm, AeroFormItem, AeroGrid,
  AeroIcon, AeroIconButton, AeroImage, AeroImageViewer, AeroInput, AeroInputNumber,
  AeroInputTag, AeroLayout, AeroLink, AeroLoading, AeroMenu, AeroMention,
  AeroMessageBox, AeroMotionPresets, AeroNotification, AeroOTP, AeroPageHeader, AeroPagination,
  AeroPopconfirm, AeroPopover, AeroProgress, AeroQRCode, AeroRadio, AeroRadioGroup,
  AeroRate, AeroResult, AeroRingProgress, AeroScrollbar, AeroSearch, AeroSegmented, AeroSelect,
  AeroSkeleton, AeroSlider, AeroSpace, AeroSpinner, AeroStatistic, AeroSteps,
  AeroSwitch, AeroTable, AeroTabs, AeroTag, AeroTerminal, AeroTextarea,
  AeroThemeSwitch, AeroTimeline, AeroTimePicker, AeroToast, AeroTooltip, AeroTour,
  AeroTransfer, AeroTree, AeroTreeSelect, AeroTypography, AeroUpload, AeroWatermark,
  AeroMarquee, AeroParallaxBox, AeroIridescentThreads,
  // —— 移动端组件（demo 忠实还原） ——
  AeroActionButtons, AeroBottomSheet, AeroKnob, AeroMobileCarousel,
  AeroMobileStatCard, AeroMobileTabBar, AeroPhone, AeroPullToRefresh,
  AeroSlideGo, AeroSortList, AeroSwipeDeck,
] as unknown as Plugin[]
