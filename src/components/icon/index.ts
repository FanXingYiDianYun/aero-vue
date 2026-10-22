import icon from './src/icon.vue'
import { withInstall } from '../../utils/install'

export const AeroIcon = withInstall(icon, 'AeroIcon')
export default AeroIcon
// 图标路径集与名称类型（demo / 宿主可 import { iconPaths } from 'aero-vue'）
export { iconPaths } from './src/paths'
export type { AeroIconName } from './src/paths'
