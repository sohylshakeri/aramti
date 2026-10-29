import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'

import {
  getContactServices,
  submitContactForm,
} from '../services/contactApi.js'

const initialForm = {
  name: '',
  contact: '',
  want: [],
  message: '',
}

// تقسیم سرویس‌ها به ردیف‌های سه‌تایی
function createOptionRows(options, rowSize = 3) {
  const rows = []

  for (let index = 0; index < options.length; index += rowSize) {
    rows.push(options.slice(index, index + rowSize))
  }

  return rows
}

// اعتبارسنجی ایمیل
function isValidEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  return emailPattern.test(value.trim())
}

// اعتبارسنجی شماره تلفن
function isValidPhone(value) {
  const normalized = value.replace(/[\s()-]/g, '')
  const phonePattern = /^\+?[1-9]\d{7,14}$/

  return phonePattern.test(normalized)
}

// اطلاعات تماس باید ایمیل یا شماره تلفن معتبر باشد.
function isValidContact(value) {
  return isValidEmail(value) || isValidPhone(value)
}

export default function ContactForm() {
  const { t } = useTranslation()
  const location = useLocation()

  const [form, setForm] = useState(initialForm)
  const [services, setServices] = useState([])

  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // دریافت سرویس‌ها از بک‌اند
  useEffect(() => {
    let isMounted = true

    getContactServices()
      .then((data) => {
        if (isMounted) {
          setServices(data)
        }
      })
      .catch((error) => {
        console.error('[Contact] Failed to load services:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const optionRows = createOptionRows(services, 3)

  // رفتن به قسمت فرم در صورت وجود hash در URL
  useEffect(() => {
    if (location.hash !== '#contact-form') {
      return
    }

    const frameId = requestAnimationFrame(() => {
      const formElement = document.getElementById('contact-form')

      if (!formElement) {
        return
      }

      const headerOffset = 100

      const targetPosition =
        formElement.getBoundingClientRect().top +
        window.scrollY -
        headerOffset

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [location.hash])

  // بررسی اعتبار فیلدها
  const nameInvalid =
    submitAttempted && !form.name.trim()

  const contactInvalid =
    submitAttempted && !isValidContact(form.contact)

  const submitHasError =
    nameInvalid || contactInvalid

  // تغییر مقدار فیلدهای فرم
  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))

    // پیام قبلی پس از ویرایش اطلاعات پاک می‌شود.
    setSubmitStatus(null)
  }

  // انتخاب یا لغو انتخاب سرویس
  const toggleWantOption = (id) => {
    setForm((currentForm) => {
      const selected = currentForm.want.includes(id)

      return {
        ...currentForm,
        want: selected
          ? currentForm.want.filter(
              (selectedId) => selectedId !== id
            )
          : [...currentForm.want, id],
      }
    })

    setSubmitStatus(null)
  }

  // ارسال فرم به بک‌اند
  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log('[Contact] Submit handler triggered')

    // جلوگیری از ارسال هم‌زمان چند درخواست
    if (isSubmitting) {
      console.log('[Contact] Submission already in progress')
      return
    }

    setSubmitAttempted(true)
    setSubmitStatus(null)

    const validName = Boolean(form.name.trim())
    const validContact = isValidContact(form.contact)

    console.log('[Contact] Validation:', {
      validName,
      validContact,
    })

    // اعتبارسنجی اولیه قبل از ارسال درخواست
    if (!validName || !validContact) {
      setSubmitStatus('validation-error')
      return
    }

    // ساخت داده‌های ارسالی مطابق API بک‌اند
    const payload = {
      name: form.name.trim(),
      contact: form.contact.trim(),
      services: form.want,
      message: form.message.trim(),
    }

    console.log('[Contact] Sending payload:', payload)

    setIsSubmitting(true)

    try {
      const data = await submitContactForm(payload)

      console.log('[Contact] API success:', data)

      // فقط پس از موفقیت درخواست، فرم پاک می‌شود.
      setForm(initialForm)
      setSubmitAttempted(false)
      setSubmitStatus('success')
    } catch (error) {
      console.error('[Contact] API error:', error)

      // در صورت خطا، اطلاعات فرم حفظ می‌شوند.
      setSubmitStatus('error')
    } finally {
      // پایان وضعیت ارسال، چه موفق و چه ناموفق
      setIsSubmitting(false)
    }
  }

  return (
    <form
      id="contact-form"
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="contact-form__title">
        {t('contact.form.title')}
      </h2>

      <p className="contact-form__hint">
        {t('contact.form.hint')}
      </p>

      {/* نام و اطلاعات تماس */}
      <div className="contact-form__row">
        <input
          className="
            contact-form__input
            contact-form__input--name
          "
          type="text"
          value={form.name}
          disabled={isSubmitting}
          aria-invalid={nameInvalid}
          placeholder={t('contact.form.namePlaceholder')}
          onChange={(event) =>
            updateField('name', event.target.value)
          }
        />

        <input
          className="
            contact-form__input
            contact-form__input--contact
          "
          type="text"
          value={form.contact}
          disabled={isSubmitting}
          aria-invalid={contactInvalid}
          placeholder={t('contact.form.contactPlaceholder')}
          onChange={(event) =>
            updateField('contact', event.target.value)
          }
        />
      </div>

      {nameInvalid && (
        <p
          role="alert"
          style={{
            color: '#d97706',
            marginTop: '8px',
          }}
        >
          Please enter your name.
        </p>
      )}

      {contactInvalid && (
        <p
          className="contact-form__error"
          role="alert"
          style={{
            color: '#dc2626',
            marginTop: '8px',
          }}
        >
          {t('contact.form.invalidContact')}
        </p>
      )}

      {/* انتخاب سرویس‌ها */}
      <p className="contact-form__label">
        {t('contact.form.wantLabel')}
      </p>

      <div className="contact-form__options">
        {optionRows.map((row, rowIndex) => (
          <div
            className="contact-form__options-row"
            key={`option-row-${rowIndex}`}
          >
            {row.map((service) => {
              const selected = form.want.includes(service.id)

              return (
                <button
                  key={service.id}
                  type="button"
                  disabled={isSubmitting}
                  aria-pressed={selected}
                  className={[
                    'contact-form__option',
                    selected
                      ? 'contact-form__option--active'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => toggleWantOption(service.id)}
                >
                  {service.name}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* پیام کاربر */}
      <p className="contact-form__message-label">
        {t('contact.form.messageLabel')}
      </p>

      <textarea
        className="contact-form__message"
        value={form.message}
        disabled={isSubmitting}
        placeholder={t('contact.form.messagePlaceholder')}
        onChange={(event) =>
          updateField('message', event.target.value)
        }
      />

      {/* پیام اعتبارسنجی */}
      {submitStatus === 'validation-error' && (
        <p
          role="alert"
          style={{
            color: '#d97706',
            marginTop: '12px',
          }}
        >
          Please enter a valid name and email address or phone number.
        </p>
      )}

      {/* پیام موفقیت */}
      {submitStatus === 'success' && (
        <p
          role="status"
          aria-live="polite"
          style={{
            color: '#16a34a',
            marginTop: '12px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#f0fdf4',
          }}
        >
          Your request has been submitted successfully.
        </p>
      )}

      {/* پیام خطا */}
      {submitStatus === 'error' && (
        <p
          role="alert"
          style={{
            color: '#dc2626',
            marginTop: '12px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#fef2f2',
          }}
        >
          We couldn't submit your request. Please try again.
        </p>
      )}

      {/* دکمه ارسال */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={[
          'contact-form__submit',
          submitHasError
            ? 'contact-form__submit--error'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isSubmitting
          ? 'Submitting...'
          : t('contact.form.submit')}
      </button>
    </form>
  )
}