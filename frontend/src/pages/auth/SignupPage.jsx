import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import { useAuth } from '../../app/auth/AuthContext.jsx'
import userIcon from '../../assets/icons/auth/user.svg'
import emailIcon from '../../assets/icons/auth/email.svg'
import phoneIcon from '../../assets/icons/auth/phone.svg'
import passwordIcon from '../../assets/icons/auth/password.svg'
import AuthField from './components/AuthField.jsx'
import AuthSocials from './components/AuthSocials.jsx'
import AuthSwitchLink from './components/AuthSwitchLink.jsx'

export default function SignupPage() {
  const { t } = useTranslation()
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    remember: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const payload = await signup(form)
      const verificationId =
        payload?.verificationId ||
        payload?.verification_id ||
        payload?.data?.verificationId ||
        ''

      sessionStorage.setItem(
        'aramti-pending-verification',
        JSON.stringify({
          email: form.email,
          verificationId,
          remember: form.remember,
        }),
      )

      navigate('/verify')
    } catch (error) {
      setErrorMessage(error.message || t('auth.errors.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form auth-form--signup" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">{t('auth.signup.title')}</h1>
      <p className="auth-form__label">{t('auth.signup.detailsLabel')}</p>

      <div className="auth-form__fields auth-form__fields--signup">
        <AuthField
          icon={userIcon}
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(event) => updateField('username', event.target.value)}
          placeholder={t('auth.signup.placeholders.username')}
          required
        />
        <AuthField
          icon={emailIcon}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder={t('auth.signup.placeholders.email')}
          required
        />
        <AuthField
          icon={phoneIcon}
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          placeholder={t('auth.signup.placeholders.phone')}
          required
        />
        <AuthField
          icon={passwordIcon}
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder={t('auth.common.password')}
          required
        />
      </div>

      <label className="auth-remember">
        <input
          type="checkbox"
          checked={form.remember}
          onChange={(event) => updateField('remember', event.target.checked)}
        />
        <span className="auth-remember__control" aria-hidden="true" />
        <span>{t('auth.signup.rememberMe')}</span>
      </label>

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
      <AuthSwitchLink mode="login" />
    </form>
  )
}
