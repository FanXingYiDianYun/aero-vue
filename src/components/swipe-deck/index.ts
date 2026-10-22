import swipeDeck from './src/swipe-deck.vue'
import { withInstall } from '../../utils/install'

export const AeroSwipeDeck = withInstall(swipeDeck, 'AeroSwipeDeck')
export default AeroSwipeDeck
export type { AeroSwipeCard } from './src/swipe-deck.vue'
