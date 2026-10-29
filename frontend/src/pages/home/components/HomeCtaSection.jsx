import { Link } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'

export default function HomeCtaSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'

  return (
    <section className="section cta-band">
      <div className="container cta-band__inner">
        <div className="cta-band__content">
          <h2>
            {isFarsi ? (
              <span className="rtl-inline-title rtl-inline-title--cta">
                <span>{t('home.cta.titlePrefix')}</span>
                <span className="text-accent">
                  {t('home.cta.titleAccent')}
                </span>
                <span>{t('home.cta.titleSuffix')}</span>
              </span>
            ) : (
              <>
                {t('home.cta.titlePrefix')}{' '}
                <span className="text-accent">
                  {t('home.cta.titleAccent')}
                </span>
              </>
            )}
          </h2>

          <p>{t('home.cta.desc')}</p>
        </div>

        <Link
          to="/contact"
          className="btn cta-band__button"
        >
          <span>{t('home.cta.link')}</span>

          <svg
            className="cta-band__button-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 12H20M16.5 8.5L20 12L16.5 15.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  )
}
