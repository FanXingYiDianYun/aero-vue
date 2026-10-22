import tree from './src/tree.vue'
import { withInstall } from '../../utils/install'

export const AeroTree = withInstall(tree, 'AeroTree')
export default AeroTree
export * from './src/tree.types'
export { deriveCheckState, collectKeys, type TreeCheckState } from './src/derive-check-state'
