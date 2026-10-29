import { Link } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'

export default function AuthSwitchLink({ mode = 'signup' }) {
  const { t } = useTranslation()
  const isSignupTarget = mode === 'signup'

  return (
    <p className="auth-switch-link">
      <span>
        {t(
          isSignupTarget
            ? 'auth.common.noAccount'
            : 'auth.common.haveAccount',
        )}
      </span>{' '}
      <Link to={isSignupTarget ? '/signup' : '/login'}>
        {t(
          isSignupTarget
            ? 'auth.common.signUp'
            : 'auth.common.login',
        )}
      </Link>
    </p>
  )
}
