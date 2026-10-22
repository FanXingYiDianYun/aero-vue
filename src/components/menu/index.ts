import menu from './src/menu.vue'
import { withInstall } from '../../utils/install'

export const AeroMenu = withInstall(menu, 'AeroMenu')
export default AeroMenu
export type { MenuItem } from './src/menu.vue'
