const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/$/, '')

const AUTH_BASE_PATH =
  import.meta.env.VITE_AUTH_BASE_PATH || '/api/auth'

const ACCESS_TOKEN_KEY = 'aramti-auth-access-token'
const REFRESH_TOKEN_KEY = 'aramti-auth-refresh-token'

function apiUrl(path) {
  return `${API_BASE_URL}${AUTH_BASE_PATH}${path}`
}

// پیدا کردن محل ذخیره توکن‌ها
function getTokenStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  if (
    sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  ) {
    return sessionStorage
  }

  if (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    localStorage.getItem(ACCESS_TOKEN_KEY)
  ) {
    return localStorage
  }

  return null
}

function getStoredToken(key) {
  if (typeof window === 'undefined') {
    return null
  }

  return (
    sessionStorage.getItem(key) ||
    localStorage.getItem(key)
  )
}

export function getAccessToken() {
  return getStoredToken(ACCESS_TOKEN_KEY)
}

function getRefreshToken() {
  return getStoredToken(REFRESH_TOKEN_KEY)
}

// ذخیره توکن‌ها در حافظه پایدار مرورگر
export function saveAuthTokens(payload, remember = false) {
  if (!payload?.access || !payload?.refresh) {
    return false
  }

  clearAuthTokens()

  const storage = remember
    ? localStorage
    : sessionStorage

  storage.setItem(ACCESS_TOKEN_KEY, payload.access)
  storage.setItem(REFRESH_TOKEN_KEY, payload.refresh)

  return true
}

// جایگزینی Access Token پس از Refresh
function updateAccessToken(accessToken) {
  const storage = getTokenStorage()

  if (!storage) {
    return false
  }

  storage.setItem(ACCESS_TOKEN_KEY, accessToken)

  return true
}

// پاک‌کردن توکن‌ها از هر دو محل ذخیره
export function clearAuthTokens() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)

  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}

// خواندن کوکی
function readCookie(name) {
  if (typeof document === 'undefined') {
    return ''
  }

  const prefix = `${name}=`

  const item = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return item
    ? decodeURIComponent(item.slice(prefix.length))
    : ''
}

// پردازش پاسخ API
async function parseResponse(response) {
  const contentType =
    response.headers.get('content-type') || ''

  const payload = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    let message =
      payload?.message ||
      payload?.detail ||
      `Request failed with status ${response.status}`

    if (payload && typeof payload === 'object') {
      const validationMessages = Object.values(payload)
        .flatMap((value) =>
          Array.isArray(value) ? value : [value]
        )
        .filter((value) => typeof value === 'string')

      if (
        validationMessages.length > 0 &&
        !payload.detail &&
        !payload.message
      ) {
        message = validationMessages.join(' ')
      }
    }

    const error = new Error(message)

    error.status = response.status
    error.payload = payload

    throw error
  }

  return payload
}

// درخواست‌های عمومی احراز هویت
async function request(path, options = {}) {
  const method = options.method || 'GET'
  const csrfToken = readCookie('csrftoken')

  const headers = {
    Accept: 'application/json',

    ...(options.body
      ? { 'Content-Type': 'application/json' }
      : {}),

    ...(csrfToken && method !== 'GET' && method !== 'HEAD'
      ? { 'X-CSRFToken': csrfToken }
      : {}),

    ...options.headers,
  }

  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    ...options,
    method,
    headers,
  })

  return parseResponse(response)
}

// تمدید Access Token با Refresh Token
async function refreshAccessToken() {
  const refresh = getRefreshToken()

  if (!refresh) {
    return false
  }

  let response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/token/refresh/`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      }
    )
  } catch {
    // خطای شبکه نباید به‌عنوان توکن نامعتبر تفسیر شود.
    return false
  }

  if (!response.ok) {
    clearAuthTokens()
    return false
  }

  const payload = await response.json()

  if (!payload?.access) {
    clearAuthTokens()
    return false
  }

  updateAccessToken(payload.access)

  return true
}

// درخواست‌هایی که نیاز به احراز هویت دارند
async function authenticatedRequest(url, options = {}) {
  const method = options.method || 'GET'

const performRequest = () => {
  const access = getAccessToken()

  const isFormData =
    typeof FormData !== 'undefined' &&
    options.body instanceof FormData

  const headers = {
    Accept: 'application/json',

    ...(
      options.body && !isFormData
        ? { 'Content-Type': 'application/json' }
        : {}
    ),

    ...options.headers,

    ...(access
      ? { Authorization: `Bearer ${access}` }
      : {}),
  }

  return fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include',
  })
}

  let response = await performRequest()

  // اگر درخواست به‌دلیل احراز هویت رد شد، تمدید توکن را امتحان می‌کنیم.
  if (
    (response.status === 401 || response.status === 403) &&
    getRefreshToken()
  ) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      response = await performRequest()
    }
  }

  return parseResponse(response)
}

// دریافت اطلاعات پروفایل
export function getCurrentUser() {
  return authenticatedRequest(
    `${API_BASE_URL}/accounts/profile/`
  )
}

// به‌روزرسانی پروفایل کاربر
export function updateProfile({
  first_name,
  last_name,
  phone,
  avatar,
}) {
  const formData = new FormData()

  formData.append('first_name', first_name ?? '')
  formData.append('last_name', last_name ?? '')
  formData.append('phone', phone ?? '')

  if (avatar instanceof File) {
    formData.append('avatar', avatar)
  }

  return authenticatedRequest(
    `${API_BASE_URL}/accounts/profile/`,
    {
      method: 'PATCH',
      body: formData,
    }
  )
}

// ورود
export function login({
  method,
  identifier,
  password,
  remember,
}) {
  return request('/login/', {
    method: 'POST',
    body: JSON.stringify({
      method,
      identifier,
      password,
      remember,
    }),
  })
}

// ثبت‌نام
export function signup({
  username,
  email,
  phone,
  password,
  remember,
}) {
  return request('/signup/', {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      phone,
      password,
      remember,
    }),
  })
}

// تأیید ایمیل
export function verifyEmail({
  email,
  code,
  verificationId,
  remember,
}) {
  return request('/verify-email/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      code,
      verificationId,
      remember,
    }),
  })
}

// ارسال مجدد کد تأیید
export function resendVerification({
  email,
  verificationId,
}) {
  return request('/resend-verification/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      verificationId,
    }),
  })
}

// درخواست لینک بازیابی رمز
export function requestPasswordReset({ email }) {
  return request('/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// ثبت رمز جدید
export function resetPassword({
  uid,
  token,
  newPassword,
  confirmPassword,
}) {
  return request('/reset-password/', {
    method: 'POST',
    body: JSON.stringify({
      uid,
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  })
}

// خروج از حساب
export function logout() {
  const refresh = getRefreshToken()

  if (!refresh) {
    return Promise.resolve(null)
  }

  return authenticatedRequest(
    `${API_BASE_URL}/accounts/logout/`,
    {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }
  )
}

// آدرس OAuth
export function getOAuthUrl(provider) {
  const returnTo =
    `${window.location.origin}/auth/callback`

  const search = new URLSearchParams({
    return_to: returnTo,
  })

  return `${apiUrl(`/oauth/${provider}/`)}?${search.toString()}`
}