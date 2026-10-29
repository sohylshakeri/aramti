import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import { useAuth } from '../../app/auth/AuthContext.jsx'

export default function AuthCallbackPage() {
  const { t } = useTranslation()
  const { refreshUser, consumeReturnTo } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState(t('auth.callback.loading'))

  useEffect(() => {
    let isMounted = true

    refreshUser().then((user) => {
      if (!isMounted) return

      if (user) {
        navigate(consumeReturnTo(), { replace: true })
      } else {
        setMessage(t('auth.callback.failed'))
      }
    })

    return () => {
      isMounted = false
    }
  }, [consumeReturnTo, navigate, refreshUser, t])

  return (
    <div className="auth-form auth-form--callback">
      <div className="auth-callback__spinner" aria-hidden="true" />
      <h1 className="auth-form__title">{message}</h1>
    </div>
  )
}
