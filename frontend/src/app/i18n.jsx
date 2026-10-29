import { createContext, useContext, useEffect, useState } from 'react'
import en from '../locales/en/index.js'
import fa from '../locales/fa/index.js'

const resources = { en, fa }
const STORAGE_KEY = 'aramti-language'

const I18nContext = createContext(null)

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'
  return localStorage.getItem(STORAGE_KEY) || 'en'
}

function resolve(obj, path) {
  return path
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  function changeLanguage(lang) {
    setLanguage(lang)
  }

  function t(key) {
    const value = resolve(resources[language], key)
    if (value !== undefined) return value
    // fall back to English, then to the raw key so a missing
    // translation never crashes the page.
    const fallback = resolve(resources.en, key)
    return fallback !== undefined ? fallback : key
  }

  return (
    <I18nContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

// Shaped like react-i18next's useTranslation() on purpose: { t, i18n: { language, changeLanguage } }.
export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return { t: ctx.t, i18n: { language: ctx.language, changeLanguage: ctx.changeLanguage } }
}
