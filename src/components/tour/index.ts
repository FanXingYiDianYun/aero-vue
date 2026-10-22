import tour from './src/tour.vue'
import { withInstall } from '../../utils/install'

export const AeroTour = withInstall(tour, 'AeroTour')
export default AeroTour
export type { TourStep } from './src/tour.vue'
