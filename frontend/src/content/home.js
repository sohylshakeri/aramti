
import iconUiUx from '../assets/icons/ui-ux.svg'
import iconMobile from '../assets/icons/mobile.svg'
import iconMarketing from '../assets/icons/marketing.svg'
import iconSeo from '../assets/icons/seo.svg'
import iconEnterprise from '../assets/icons/enterprise.svg'
import iconMaintenance from '../assets/icons/maintenance.svg'
import iconArrow from '../assets/icons/arrow-up-right.svg'

export { iconArrow }

export const services = [
  {
    id: 'ui-ux',
    icon: iconUiUx,
    contactOption: 'uiUxDesign',
  },
  {
    id: 'android-ios',
    icon: iconMobile,
    contactOption: 'mobileApp',
  },
  {
    id: 'digital-marketing',
    icon: iconMarketing,
    contactOption: 'other',
  },
  {
    id: 'seo',
    icon: iconSeo,
    contactOption: 'seo',
  },
  {
    id: 'enterprise-solution',
    icon: iconEnterprise,
    contactOption: 'other',
  },
  {
    id: 'maintenance',
    icon: iconMaintenance,
    contactOption: 'other',
  },
]

export const highlights = [
  { id: 'portfolio', to: '/portfolio' },
  { id: 'about', to: '/about' },
  { id: 'team', to: '/about' },
  { id: 'contact', to: '/contact' },
  { id: 'services', to: '/#services' },
]

export const stats = [
  { id: 'projects-delivered', value: 384, plus: true },
  { id: 'developers', value: 30, plus: true },
  { id: 'hours-worked', value: 8839, plus: true },
  { id: 'global-footprints', value: 15, plus: true },
]

export const mapMarkers = [
  { id: 'customer-1', type: 'customer', x: 35, y: 40 },
  { id: 'customer-2', type: 'customer', x: 23, y: 33 },
  { id: 'customer-3', type: 'customer', x: 46, y: 49 },
  { id: 'customer-4', type: 'customer', x: 76, y: 68 },
  { id: 'review-1', type: 'review', x: 58, y: 32 },
  { id: 'review-2', type: 'review', x: 29, y: 52 },
  { id: 'review-3', type: 'review', x: 72, y: 42 },
  { id: 'review-4', type: 'review', x: 84, y: 66 },
]

export const mapReviews = [
  {
    id: 'review-1',
    markerId: 'review-1',
    avatar: '/customer-avatar.jpg',
  },
  {
    id: 'review-2',
    markerId: 'review-2',
    avatar: '/customer-avatar.jpg',
  },
  {
    id: 'review-3',
    markerId: 'review-3',
    avatar: '/customer-avatar.jpg',
  },
  {
    id: 'review-4',
    markerId: 'review-4',
    avatar: '/customer-avatar.jpg',
  },
]
