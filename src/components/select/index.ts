import select from './src/select.vue'
import { withInstall } from '../../utils/install'

export const AeroSelect = withInstall(select, 'AeroSelect')
export default AeroSelect
export * from './src/select.types'
