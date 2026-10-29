import { useTranslation } from '../../../app/i18n.jsx'

export default function YearsSection() {
  const { t } = useTranslation()

  return (
    <section className="years-section">
      <div className="container">
        <h2 className="years-section__title">
          <span className="years-section__title-line">
            {t('about.years.heading.line1')}
          </span>

          <span className="years-section__title-line">
            <span className="years-section__title-accent">
              {t('about.years.heading.accent')}
            </span>{' '}
            {t('about.years.heading.line2')}
          </span>
        </h2>
      </div>
    </section>
  )
}