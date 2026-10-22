import pullToRefresh from './src/pull-to-refresh.vue'
import { withInstall } from '../../utils/install'

export const AeroPullToRefresh = withInstall(pullToRefresh, 'AeroPullToRefresh')
export default AeroPullToRefresh
export type { AeroPtrItem } from './src/pull-to-refresh.vue'
