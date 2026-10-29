import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import emailIcon from '../../assets/icons/auth/email.svg'
import AuthField from './components/AuthField.jsx'
import { requestPasswordReset } from './services/authApi.js'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await requestPasswordReset({ email })
      setIsSent(true)
    } catch (error) {
      setErrorMessage(error.message || t('auth.errors.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form auth-form--forgot" onSubmit={handleSubmit}>
      <div className="auth-forgot__badge" aria-hidden="true">
        <span>@</span>
      </div>

      <h1 className="auth-form__title">{t('auth.forgot.title')}</h1>
      <p className="auth-forgot__description">
        {isSent ? t('auth.forgot.sent') : t('auth.forgot.description')}
      </p>

      {!isSent && (
        <AuthField
          icon={emailIcon}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('auth.signup.placeholders.email')}
          required
        />
      )}

      {errorMessage && (
        <p className="auth-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      {!isSent && (
        <button
          type="submit"
          className="auth-submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t('auth.common.pleaseWait')
            : t('auth.forgot.sendLink')}
        </button>
      )}

      <Link className="auth-forgot__back" to="/login">
        <span aria-hidden="true">←</span>
        <span>{t('auth.forgot.backToLogin')}</span>
      </Link>
    </form>
  )
}
