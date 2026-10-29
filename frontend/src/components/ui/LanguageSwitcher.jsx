import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../app/i18n.jsx'

function GlobeIcon() {
  return (
    <svg
      className="language-switcher__globe"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2.8 16h26.4M16 2.5c3.6 3.7 5.4 8.2 5.4 13.5S19.6 25.8 16 29.5M16 2.5C12.4 6.2 10.6 10.7 10.6 16S12.4 25.8 16 29.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="language-switcher__chevron-icon"
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 1 6 5l5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FlagBadge({ language }) {
  if (language === 'fa') {
    return (
      <span className="language-flag language-flag--iran" aria-hidden="true">
        <span />
      </span>
    )
  }

  return (
    <span className="language-flag language-flag--us" aria-hidden="true">
      <span />
    </span>
  )
}

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)
  const currentLanguage = i18n.language === 'fa' ? 'fa' : 'en'

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher" ref={rootRef}>
      <GlobeIcon />

      <button
        type="button"
        className="language-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('common.language.menuLabel')}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{t(`common.language.codes.${currentLanguage}`)}</span>
        <span className="language-switcher__chevron">
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <div className="language-switcher__menu" role="menu">
          {['en', 'fa'].map((language) => {
            const isActive = currentLanguage === language

            return (
              <button
                key={language}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`language-switcher__option${
                  isActive ? ' language-switcher__option--active' : ''
                }`}
                onClick={() => changeLanguage(language)}
              >
                <FlagBadge language={language} />
                <span className="language-switcher__option-label">
                  {t(`common.language.names.${language}`)}
                </span>
                <span className="language-switcher__option-check" aria-hidden="true">
                  {isActive ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
