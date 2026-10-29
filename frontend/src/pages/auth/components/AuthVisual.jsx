import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'

export default function AuthVisual() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const useLightDots = pathname === '/login'

  return (
    <section className="auth-visual" aria-hidden="true">
      <span className="auth-visual__beam" />
      <span className="auth-visual__orb" />

      <div className="auth-visual__glass">
        <p className="auth-visual__message">
          <span>{t('auth.visual.welcome')}</span>
          <span>{t('auth.visual.explore')}</span>
        </p>

        <div
          className={`auth-visual__dots${
            useLightDots ? ' auth-visual__dots--light' : ''
          }`}
        >
          <span />
          <span />
          <span className="auth-visual__dot--active" />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
