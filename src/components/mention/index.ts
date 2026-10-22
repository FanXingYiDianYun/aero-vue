import mention from './src/mention.vue'
import { withInstall } from '../../utils/install'

export const AeroMention = withInstall(mention, 'AeroMention')
export default AeroMention
export type { MentionOption } from './src/mention.vue'
