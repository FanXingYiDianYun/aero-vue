import sortList from './src/sort-list.vue'
import { withInstall } from '../../utils/install'

export const AeroSortList = withInstall(sortList, 'AeroSortList')
export default AeroSortList
export type { AeroSortItem } from './src/sort-list.vue'
