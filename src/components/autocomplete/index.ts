import autocomplete from './src/autocomplete.vue'
import { withInstall } from '../../utils/install'

export const AeroAutocomplete = withInstall(autocomplete, 'AeroAutocomplete')
export default AeroAutocomplete
export type { AutoSuggestion } from './src/autocomplete.vue'
