import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as authApi from '../../pages/auth/services/authApi.js'

const AuthContext = createContext(null)

const LOCAL_USER_KEY = 'aramti-auth-user'
const SESSION_USER_KEY = 'aramti-auth-session-user'
const RETURN_TO_KEY = 'aramti-auth-return-to'

function parseStoredUser(storage, key) {
  try {
    const value = storage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function getStoredUser() {
  if (typeof window === 'undefined') return null

  return (
    parseStoredUser(localStorage, LOCAL_USER_KEY) ||
    parseStoredUser(sessionStorage, SESSION_USER_KEY)
  )
}

function clearStoredUser() {
  localStorage.removeItem(LOCAL_USER_KEY)
  sessionStorage.removeItem(SESSION_USER_KEY)
}

function persistUser(user, remember) {
  clearStoredUser()

  if (!user) return

  const storage = remember ? localStorage : sessionStorage
  const key = remember ? LOCAL_USER_KEY : SESSION_USER_KEY
  storage.setItem(key, JSON.stringify(user))
}

function resolveUser(payload) {
  return payload?.user || payload?.data?.user || payload || null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [isReady, setIsReady] = useState(false)

  const setAuthenticatedUser = useCallback((nextUser, remember = false) => {
    setUser(nextUser)
    persistUser(nextUser, remember)
  }, [])

const refreshUser = useCallback(async () => {
  // بدون Access Token، درخواست محافظت‌شده ارسال نمی‌کنیم.
  if (!authApi.getAccessToken()) {
    clearStoredUser()
    setUser(null)
    setIsReady(true)

    return null
  }

  try {
    const payload = await authApi.getCurrentUser()
    const nextUser = resolveUser(payload)

    if (nextUser) {
      const shouldRemember =
        Boolean(localStorage.getItem(LOCAL_USER_KEY))

      setAuthenticatedUser(nextUser, shouldRemember)
    }

    return nextUser
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      clearStoredUser()
      authApi.clearAuthTokens()
      setUser(null)
    }

    return null
  } finally {
    setIsReady(true)
  }
}, [setAuthenticatedUser])

useEffect(() => {
  refreshUser()
}, [refreshUser])

 const login = useCallback(
  async (credentials) => {
    const payload = await authApi.login(credentials)

    // ذخیره Access و Refresh Token دریافتی از Django
    authApi.saveAuthTokens(
      payload,
      credentials.remember
    )

    const nextUser = resolveUser(payload)

    if (nextUser) {
      setAuthenticatedUser(
        nextUser,
        credentials.remember
      )
    }

    return { payload, user: nextUser }
  },
  [setAuthenticatedUser],
)
  const signup = useCallback(async (details) => {
    const payload = await authApi.signup(details)
    return payload
  }, [])

const verify = useCallback(
  async (details) => {
    const payload = await authApi.verifyEmail(details)

    // ذخیره JWTهای دریافتی از بک‌اند
    authApi.saveAuthTokens(
      payload,
      details.remember
    )

    const nextUser = resolveUser(payload)

    if (nextUser) {
      setAuthenticatedUser(
        nextUser,
        details.remember
      )
    }

    return { payload, user: nextUser }
  },
  [setAuthenticatedUser],
)

  const logout = useCallback(async () => {
  try {
    await authApi.logout()
  } catch (error) {
    console.error('[Auth] Logout request failed:', error)
  } finally {
    clearStoredUser()
    authApi.clearAuthTokens()
    setUser(null)
  }
}, [])

  const beginSocialAuth = useCallback((provider, returnTo = '/') => {
    sessionStorage.setItem(RETURN_TO_KEY, returnTo)
    window.location.assign(authApi.getOAuthUrl(provider))
  }, [])

  const consumeReturnTo = useCallback(() => {
    const returnTo = sessionStorage.getItem(RETURN_TO_KEY) || '/'
    sessionStorage.removeItem(RETURN_TO_KEY)
    return returnTo
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      login,
      signup,
      verify,
      logout,
      refreshUser,
      beginSocialAuth,
      consumeReturnTo,
    }),
    [
      user,
      isReady,
      login,
      signup,
      verify,
      logout,
      refreshUser,
      beginSocialAuth,
      consumeReturnTo,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
