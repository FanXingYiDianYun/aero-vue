import badge from './src/badge.vue'
import { withInstall } from '../../utils/install'

export const AeroBadge = withInstall(badge, 'AeroBadge')
export default AeroBadge
export * from './src/badge.types'
