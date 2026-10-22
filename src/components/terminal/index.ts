import terminal from './src/terminal.vue'
import { withInstall } from '../../utils/install'

export const AeroTerminal = withInstall(terminal, 'AeroTerminal')
export default AeroTerminal
export type { TermLine } from './src/terminal.vue'
