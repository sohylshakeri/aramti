import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'
import Logo from '../../../components/ui/Logo.jsx'
import AuthVisual from './AuthVisual.jsx'

function getMode(pathname) {
  if (pathname.startsWith('/signup')) return 'signup'
  if (pathname.startsWith('/verify')) return 'verify'
  if (pathname.startsWith('/forgot-password')) return 'forgot'
  if (pathname.startsWith('/auth/callback')) return 'callback'
  return 'login'
}

export default function AuthLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const mode = getMode(pathname)

  return (
    <div className={`auth-page auth-page--${mode}`}>
      <header className="auth-header">
        <Logo />
        <button type="button" className="btn btn--primary auth-header__cta">
          {t('common.header.cta')}
        </button>
      </header>

      <main className="auth-stage">
        <AuthVisual />
        <section className="auth-panel">
          <div className="auth-panel__decoration" aria-hidden="true" />
          <Outlet />
        </section>
      </main>
    </div>
  )
}
