import anchor from './src/anchor.vue'
import { withInstall } from '../../utils/install'

export const AeroAnchor = withInstall(anchor, 'AeroAnchor')
export default AeroAnchor
export type { AnchorItem } from './src/anchor.vue'
