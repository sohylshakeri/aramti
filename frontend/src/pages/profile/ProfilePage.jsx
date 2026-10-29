import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '../../app/auth/AuthContext.jsx'
import * as authApi from '../auth/services/authApi.js'
import UserAvatar from '../../components/ui/UserAvatar.jsx'

import './ProfilePage.css'


function ProfileDetail({ label, value, icon }) {
  return (
    <div className="profile-detail">
      <div
        className="profile-detail__icon"
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="profile-detail__content">
        <span className="profile-detail__label">
          {label}
        </span>

        <span className="profile-detail__value">
          {value || 'ثبت نشده'}
        </span>
      </div>
    </div>
  )
}


export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    isReady,
    refreshUser,
  } = useAuth()

  // وضعیت فرم ویرایش
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // پیام‌های فرم
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // تصویر انتخاب‌شده
  const [avatarFile, setAvatarFile] = useState(null)

  // مقادیر فیلدهای فرم
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  // دریافت اطلاعات تازه از بک‌اند
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser()
    }
  }, [isAuthenticated, refreshUser])

  // همگام‌سازی فرم با اطلاعات کاربر
  useEffect(() => {
    setForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    })
  }, [user])

  // تغییر فیلدهای فرم
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // ذخیره تغییرات در بک‌اند
  const handleSave = async (event) => {
    event.preventDefault()

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await authApi.updateProfile({
        ...form,
        avatar: avatarFile,
      })

      await refreshUser()

      setAvatarFile(null)
      setIsEditing(false)

      setSuccessMessage(
        'اطلاعات پروفایل با موفقیت ذخیره شد.'
      )
    } catch (error) {
      setErrorMessage(
        error.message || 'ذخیره اطلاعات با خطا مواجه شد.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  // لغو ویرایش
  const handleCancel = () => {
    setForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    })

    setAvatarFile(null)
    setErrorMessage('')
    setSuccessMessage('')
    setIsEditing(false)
  }

  // نام کامل کاربر
  const firstName = user?.first_name || ''
  const lastName = user?.last_name || ''

  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'کاربر'

  // وضعیت بارگذاری
  if (!isReady) {
    return (
      <main className="profile-page">
        <div className="profile-page__loading">
          <span className="profile-loading-spinner" />
          <p>در حال بارگذاری پروفایل...</p>
        </div>
      </main>
    )
  }

  // محافظت از صفحه پروفایل
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="profile-page" dir="rtl">
      <div className="profile-page__container">

        {/* عنوان صفحه */}
        <header className="profile-page__heading">
          <div>
            <span className="profile-page__eyebrow">
              حساب کاربری
            </span>

            <h1>پروفایل من</h1>

            <p>
              اطلاعات حساب کاربری خود را مشاهده و مدیریت کن.
            </p>
          </div>

          <Link to="/" className="profile-page__back">
            <span aria-hidden="true">←</span>
            بازگشت به سایت
          </Link>
        </header>

        {/* کارت اصلی پروفایل */}
        <section className="profile-card">

          {/* هدر کارت */}
          <div className="profile-card__hero">
            <div className="profile-card__avatar">
              <UserAvatar user={user} />
            </div>

            <div className="profile-card__identity">
              <span className="profile-card__caption">
                حساب کاربری شما
              </span>

              <h2>{fullName}</h2>

              <p className="profile-card__username">
                @{user?.username || 'user'}
              </p>
            </div>

            <div className="profile-card__badge">
              <span className="profile-card__badge-dot" />
              واردشده
            </div>
          </div>

          {/* اطلاعات و فرم ویرایش */}
          <div className="profile-card__body">

            <div className="profile-section-heading">
              <div>
                <h3>اطلاعات شخصی</h3>

                <p>
                  اطلاعات حساب کاربری خود را مدیریت کن.
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="profile-page__edit-button"
                  onClick={() => {
                    setErrorMessage('')
                    setSuccessMessage('')

                    setForm({
                      first_name: user?.first_name || '',
                      last_name: user?.last_name || '',
                      phone: user?.phone || '',
                    })

                    setIsEditing(true)
                  }}
                >
                  ویرایش اطلاعات
                </button>
              )}
            </div>

            {/* پیام خطا */}
            {errorMessage && (
              <p
                className="profile-form-message profile-form-message--error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            {/* پیام موفقیت */}
            {successMessage && (
              <p
                className="profile-form-message profile-form-message--success"
                role="status"
              >
                {successMessage}
              </p>
            )}

            {isEditing ? (

              /* فرم ویرایش */
              <form
                className="profile-edit-form"
                onSubmit={handleSave}
              >
                <label>
                  نام

                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    maxLength={150}
                    autoComplete="given-name"
                  />
                </label>

                <label>
                  نام خانوادگی

                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    maxLength={150}
                    autoComplete="family-name"
                  />
                </label>

                <label>
                  شماره تلفن

                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={20}
                    autoComplete="tel"
                    placeholder="+989xxxxxxxxx"
                  />
                </label>

                <label>
                  تصویر پروفایل

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setAvatarFile(
                        event.target.files?.[0] || null
                      )
                    }}
                  />
                </label>

                {avatarFile && (
                  <p className="profile-form-file">
                    تصویر انتخاب‌شده: {avatarFile.name}
                  </p>
                )}

                <div className="profile-edit-form__actions">
                  <button
                    type="submit"
                    className="profile-page__edit-button"
                    disabled={isSaving}
                  >
                    {isSaving
                      ? 'در حال ذخیره...'
                      : 'ذخیره تغییرات'}
                  </button>

                  <button
                    type="button"
                    className="profile-page__cancel-button"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    انصراف
                  </button>
                </div>
              </form>

            ) : (

              /* نمایش اطلاعات کاربر */
              <div className="profile-details">
                <ProfileDetail
                  label="نام"
                  value={user?.first_name}
                  icon="ن"
                />

                <ProfileDetail
                  label="نام خانوادگی"
                  value={user?.last_name}
                  icon="ف"
                />

                <ProfileDetail
                  label="نام کاربری"
                  value={user?.username}
                  icon="@"
                />

                <ProfileDetail
                  label="آدرس ایمیل"
                  value={user?.email}
                  icon="✉"
                />

                <ProfileDetail
                  label="شماره تلفن"
                  value={user?.phone}
                  icon="ت"
                />
              </div>
            )}
          </div>

          {/* پایین کارت */}
          <footer className="profile-card__footer">
            <div className="profile-card__footer-icon">
              ✓
            </div>

            <p>
              اطلاعات حساب کاربری شما از طریق سامانه دریافت می‌شود.
            </p>
          </footer>
        </section>
      </div>
    </main>
  )
}