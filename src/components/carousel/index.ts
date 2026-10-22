import carousel from './src/carousel.vue'
import { withInstall } from '../../utils/install'

export const AeroCarousel = withInstall(carousel, 'AeroCarousel')
export default AeroCarousel
export * from './src/carousel.types'
