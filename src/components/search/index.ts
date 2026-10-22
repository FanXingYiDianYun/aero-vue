import search from './src/search.vue'
import { withInstall } from '../../utils/install'

export const AeroSearch = withInstall(search, 'AeroSearch')
export type { AeroSearchOption } from './src/search.vue'
export default AeroSearch
