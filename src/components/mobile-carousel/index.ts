import mobileCarousel from './src/mobile-carousel.vue'
import { withInstall } from '../../utils/install'

export const AeroMobileCarousel = withInstall(mobileCarousel, 'AeroMobileCarousel')
export default AeroMobileCarousel
export type { AeroMobileCarouselSlide } from './src/mobile-carousel.vue'
