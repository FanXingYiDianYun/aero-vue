import mobileTabBar from './src/mobile-tab-bar.vue'
import { withInstall } from '../../utils/install'

export const AeroMobileTabBar = withInstall(mobileTabBar, 'AeroMobileTabBar')
export default AeroMobileTabBar
export type { AeroMobileTabItem } from './src/mobile-tab-bar.vue'
