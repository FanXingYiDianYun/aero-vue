import configProvider from './src/config-provider.vue'
import { withInstall } from '../../utils/install'

export const AeroConfigProvider = withInstall(configProvider, 'AeroConfigProvider')
export default AeroConfigProvider
