import { useTranslation } from '../../../app/i18n.jsx'
import { useAuth } from '../../../app/auth/AuthContext.jsx'
import facebookIcon from '../../../assets/icons/auth/facebook.svg'
import googleIcon from '../../../assets/icons/auth/google.svg'
import appleIcon from '../../../assets/icons/auth/apple.svg'
import { socialProviderIds } from '../../../content/auth.js'

const socialIcons = {
  facebook: facebookIcon,
  google: googleIcon,
  apple: appleIcon,
}

export default function AuthSocials() {
  const { t } = useTranslation()
  const { beginSocialAuth } = useAuth()

  return (
    <div className="auth-socials">
      <p className="auth-socials__label">{t('auth.common.signInWith')}</p>
      <div className="auth-socials__list">
        {socialProviderIds.map((providerId) => (
          <button
            key={providerId}
            type="button"
            className="auth-socials__button"
            aria-label={t(`auth.social.${providerId}`)}
            onClick={() => beginSocialAuth(providerId, '/')}
          >
            <img src={socialIcons[providerId]} alt="" />
          </button>
        ))}
      </div>
    </div>
  )
}
