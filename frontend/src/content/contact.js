import emailIcon from '../assets/icons/contact/emailC.svg'
import phoneIcon from '../assets/icons/contact/phone.svg'
import locationIcon from '../assets/icons/contact/location.svg'

import { siteContact } from './common.js'
import { serviceIds } from './services.js'

export const wantOptionIds = [
  ...serviceIds,
  'other',
]

export const contactInfoItems = [
  {
    id: 'email',
    icon: emailIcon,
    href: siteContact.email.href,
  },

  {
    id: 'phone',
    icon: phoneIcon,
    href: siteContact.phone.href,
  },

  {
    id: 'location',
    icon: locationIcon,
    href: siteContact.location.href,
    external: true,
  },
]