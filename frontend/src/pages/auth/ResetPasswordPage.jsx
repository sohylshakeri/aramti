import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { resetPassword } from './services/authApi.js'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()

  const uid = searchParams.get('uid') || ''
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const isValidLink = Boolean(uid && token)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    if (!isValidLink) {
      setStatus({
        type: 'error',
        message: 'The password reset link is invalid or incomplete.',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword({
        uid,
        token,
        newPassword,
        confirmPassword,
      })

      setStatus({
        type: 'success',
        message: 'Your password has been reset successfully.',
      })

      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('[Password Reset] Failed:', error)

      let message =
        'Unable to reset your password. The link may be invalid or expired.'

      const payload = error.payload

      if (payload?.detail) {
        message = payload.detail
      } else if (payload && typeof payload === 'object') {
        const errors = Object.values(payload)
          .flatMap((value) =>
            Array.isArray(value) ? value : [value]
          )
          .filter((value) => typeof value === 'string')

        if (errors.length > 0) {
          message = errors.join(' ')
        }
      }

      setStatus({
        type: 'error',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      style={{
        maxWidth: '420px',
        margin: '80px auto',
        padding: '24px',
      }}
    >
      <h1>Reset Password</h1>

      <p>Enter your new password below.</p>

      {!isValidLink ? (
        <p role="alert" style={{ color: 'red' }}>
          The password reset link is invalid or incomplete.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="new-password">
              New password
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              required
              disabled={isSubmitting}
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="confirm-password">
              Confirm new password
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
              disabled={isSubmitting}
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px',
                marginTop: '6px',
              }}
            />
          </div>

          {status && (
            <p
              role={status.type === 'error' ? 'alert' : 'status'}
              style={{
                color: status.type === 'error' ? '#dc2626' : '#16a34a',
                marginBottom: '16px',
              }}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              cursor: isSubmitting ? 'wait' : 'pointer',
            }}
          >
            {isSubmitting ? 'Resetting password...' : 'Reset Password'}
          </button>
        </form>
      )}
    </main>
  )
}