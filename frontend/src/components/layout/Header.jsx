import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import { useAuth } from '../../app/auth/AuthContext.jsx'
import { headerLinks } from '../../content/common.js'
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx'
import Logo from '../ui/Logo.jsx'
import UserAvatar from '../ui/UserAvatar.jsx'

function HeaderUserIcon() {
  return (
    <svg
      className="header-auth__icon"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5.5 26.5c0-5.2 4.7-8.5 10.5-8.5s10.5 3.3 10.5 8.5c0 1.7-4.7 3-10.5 3s-10.5-1.3-10.5-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Header() {
  const { t, i18n } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const navigationLinks =
    i18n.language === 'fa'
      ? [...headerLinks].reverse()
      : headerLinks

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />

        <nav className="nav" aria-label={t('common.nav.ariaLabel')}>
          {navigationLinks.map((link) => (
            <NavLink
              key={`${link.to}-${link.key}`}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                [
                  'nav__link',
                  isActive ? 'nav__link--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {t(`common.nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher />

        {isAuthenticated ? (
  <div className="header__user-actions">
    <Link to="/profile" className="header-auth">
      <UserAvatar user={user} />
      <span>پروفایل</span>
    </Link>

    <button
      type="button"
      className="header-auth header-auth--logout"
      onClick={handleLogout}
    >
      <span>{t('common.header.exit')}</span>
    </button>
  </div>
) : (
  <Link to="/login" className="header-auth">
    <HeaderUserIcon />
    <span>{t('common.header.login')}</span>
  </Link>
)}

          <Link
            to="/contact"
            className="btn btn--primary header__cta"
          >
            {t('common.header.cta')}
          </Link>
        </div>
      </div>
    </header>
  )
}