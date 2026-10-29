import { serviceIds } from './services.js'

export const portfolioFilterIds = [
  'all',
  ...serviceIds,
]

export const projects = [
  {
    id: 'app-development',

    primaryCategoryId: 'mobileApp',
    filterIds: [
      'uiUxDesign',
      'mobileApp',
    ],

    tone: 'sand',
  },

  {
    id: 'web-platform-launch',

    primaryCategoryId: 'website',
    filterIds: [
      'uiUxDesign',
      'website',
    ],

    tone: 'silver',
  },

  {
    id: 'digital-services-ui',

    primaryCategoryId: 'website',
    filterIds: [
      'uiUxDesign',
      'website',
    ],

    tone: 'amber',
  },

  {
    id: 'wellness-app',

    primaryCategoryId: 'mobileApp',
    filterIds: [
      'uiUxDesign',
      'mobileApp',
    ],

    tone: 'sand',
  },

  {
    id: 'showcase-site',

    primaryCategoryId: 'website',
    filterIds: [
      'uiUxDesign',
      'website',
    ],

    tone: 'silver',
  },

  {
    id: 'service-marketplace',

    primaryCategoryId: 'website',
    filterIds: [
      'uiUxDesign',
      'website',
    ],

    tone: 'amber',
  },
]