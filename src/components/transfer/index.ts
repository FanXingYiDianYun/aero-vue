import transfer from './src/transfer.vue'
import { withInstall } from '../../utils/install'

export const AeroTransfer = withInstall(transfer, 'AeroTransfer')
export default AeroTransfer
export type { TransferItem } from './src/transfer.vue'
