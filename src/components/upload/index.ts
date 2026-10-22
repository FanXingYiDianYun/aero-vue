import upload from './src/upload.vue'
import { withInstall } from '../../utils/install'

export const AeroUpload = withInstall(upload, 'AeroUpload')
export default AeroUpload
export type { UploadFile, UploadStatus, BeforeUploadHook } from './src/upload.vue'
