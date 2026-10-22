import motionPresets from './src/motion-presets.vue'
import { withInstall } from '../../utils/install'

export const AeroMotionPresets = withInstall(motionPresets, 'AeroMotionPresets')
export default AeroMotionPresets
export type { MotionName } from './src/motion-presets.vue'
