import codeBlock from './src/code-block.vue'
import { withInstall } from '../../utils/install'

export const AeroCodeBlock = withInstall(codeBlock, 'AeroCodeBlock')
export default AeroCodeBlock
export { highlightLine } from './src/highlight'
