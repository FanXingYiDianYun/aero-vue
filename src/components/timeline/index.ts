import timeline from './src/timeline.vue'
import { withInstall } from '../../utils/install'

export const AeroTimeline = withInstall(timeline, 'AeroTimeline')
export default AeroTimeline
export * from './src/timeline.types'
