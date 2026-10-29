import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import { useAuth } from '../../app/auth/AuthContext.jsx'
import emailIcon from '../../assets/icons/auth/email.svg'
import userIcon from '../../assets/icons/auth/user.svg'
import passwordIcon from '../../assets/icons/auth/password.svg'
import AuthField from './components/AuthField.jsx'
import AuthSocials from './components/AuthSocials.jsx'
import AuthSwitchLink from './components/AuthSwitchLink.jsx'
import { loginMethodIds } from '../../content/auth.js'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [method, setMethod] = useState('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod)
    setIdentifier('')
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login({
        method,
        identifier,
        password,
        remember: false,
      })
      navigate('/')
    } catch (error) {
      setErrorMessage(error.message || t('auth.errors.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form auth-form--login" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">{t('auth.login.title')}</h1>

      <div className="auth-login-tabs" role="tablist">
        {loginMethodIds.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={method === tab}
            className={`auth-login-tabs__button${
              method === tab ? ' auth-login-tabs__button--active' : ''
            }`}
            onClick={() => handleMethodChange(tab)}
          >
            {t(`auth.login.tabs.${tab}`)}
          </button>
        ))}
      </div>

      <div className="auth-form__fields auth-form__fields--login">
        <AuthField
          icon={method === 'email' ? emailIcon : userIcon}
          type={method === 'email' ? 'email' : 'text'}
          autoComplete={method === 'email' ? 'email' : 'username'}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder={t(`auth.login.placeholders.${method}`)}
          required
        />

        <AuthField
          icon={passwordIcon}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t('auth.common.password')}
          required
        />
      </div>

      <Link className="auth-form__forgot" to="/forgot-password">
        {t('auth.login.forgotPassword')}
      </Link>

      {errorMessage && (
        <p className="auth-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="auth-submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? t('auth.common.pleaseWait')
          : t('auth.common.continue')}
      </button>

      <AuthSocials />
      <AuthSwitchLink mode="signup" />
    </form>
  )
}
