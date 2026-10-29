import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import { useAuth } from '../../app/auth/AuthContext.jsx'
import { resendVerification } from './services/authApi.js'
import AuthSocials from './components/AuthSocials.jsx'
import AuthSwitchLink from './components/AuthSwitchLink.jsx'

const VERIFICATION_SECONDS = 120

function readPendingVerification() {
  try {
    const value = sessionStorage.getItem(
      'aramti-pending-verification',
    )

    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export default function VerificationPage() {
  const { t } = useTranslation()
  const { verify } = useAuth()
  const navigate = useNavigate()

  const [pending, setPending] = useState(
    readPendingVerification,
  )

  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(
    VERIFICATION_SECONDS,
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // شمارش معکوس تا فعال‌شدن امکان ارسال مجدد کد
  useEffect(() => {
    if (seconds <= 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(value - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [seconds])

  // پذیرش فقط ارقام و حداکثر شش رقم
  const handleCodeChange = (event) => {
    setCode(
      event.target.value.replace(/\D/g, '').slice(0, 6),
    )
  }

  // تأیید ایمیل
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!pending?.email || !pending?.verificationId) {
      setErrorMessage(t('auth.verify.missingRequest'))
      return
    }

    if (code.length !== 6 || isSubmitting) {
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await verify({
        email: pending.email,
        verificationId: pending.verificationId,
        remember: pending.remember,
        code,
      })

      sessionStorage.removeItem(
        'aramti-pending-verification',
      )

      navigate('/', { replace: true })
    } catch (error) {
      console.error('[Email Verification] Failed:', error)

      setErrorMessage(
        error.message || t('auth.errors.generic'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // درخواست ارسال مجدد کد
  const handleResend = async () => {
    if (
      !pending?.email ||
      !pending?.verificationId ||
      isResending
    ) {
      setErrorMessage(t('auth.verify.missingRequest'))
      return
    }

    setErrorMessage('')
    setIsResending(true)

    try {
      const payload = await resendVerification({
        email: pending.email,
        verificationId: pending.verificationId,
      })

      const nextVerificationId =
        payload?.verificationId ||
        payload?.verification_id ||
        payload?.data?.verificationId

      if (!nextVerificationId) {
        throw new Error(
          'Could not resend the verification code. Please try again.',
        )
      }

      const nextPending = {
        ...pending,
        verificationId: nextVerificationId,
      }

      sessionStorage.setItem(
        'aramti-pending-verification',
        JSON.stringify(nextPending),
      )

      setPending(nextPending)
      setCode('')
      setSeconds(VERIFICATION_SECONDS)
    } catch (error) {
      console.error('[Email Verification] Resend failed:', error)

      setErrorMessage(
        error.message || t('auth.errors.generic'),
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form
      className="auth-form auth-form--verify"
      onSubmit={handleSubmit}
    >
      <h1 className="auth-form__title">
        {t('auth.verify.title')}
      </h1>

      <p className="auth-form__label">
        {t('auth.verify.label')}
      </p>

      <label className="auth-verification-field">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={handleCodeChange}
          placeholder={t('auth.verify.placeholder')}
          aria-label={t('auth.verify.placeholder')}
          aria-invalid={Boolean(errorMessage)}
          required
          minLength={6}
          maxLength={6}
          disabled={isSubmitting}
        />

        {seconds > 0 ? (
          <span className="auth-verification-field__timer">
            {seconds}
            {t('auth.verify.secondsSuffix')}
          </span>
        ) : (
          <button
            type="button"
            className="auth-verification-field__resend"
            disabled={isResending || isSubmitting}
            onClick={handleResend}
          >
            {isResending
              ? t('auth.common.pleaseWait')
              : t('auth.verify.resend')}
          </button>
        )}
      </label>

      {errorMessage && (
        <p className="auth-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="auth-submit"
        disabled={
          isSubmitting ||
          isResending ||
          code.length !== 6
        }
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