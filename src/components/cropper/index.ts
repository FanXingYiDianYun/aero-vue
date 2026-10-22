import cropper from './src/cropper.vue'
import { withInstall } from '../../utils/install'

export const AeroCropper = withInstall(cropper, 'AeroCropper')
export default AeroCropper
export type { CropResult, CropFrameState, CropperLabels } from './cropper.types'
export { defaultCropperLabels } from './cropper.types'
