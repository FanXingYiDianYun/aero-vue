import table from './src/table.vue'
import { withInstall } from '../../utils/install'

export const AeroTable = withInstall(table, 'AeroTable')
export default AeroTable
export * from './src/table.types'
