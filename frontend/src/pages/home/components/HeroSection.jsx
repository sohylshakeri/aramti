import { useTranslation } from '../../../app/i18n.jsx'
import HeroIllustration from './HeroIllustration.jsx'

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div>
          <h1 className="hero__title">
            {isFarsi ? (
              <span className="rtl-inline-title">
                <span className="text-accent">
                  {t('home.hero.titleAccent')}
                </span>
                <span>{t('home.hero.titlePrefix')}</span>
              </span>
            ) : (
              <>
                {t('home.hero.titlePrefix')}{' '}
                <span className="text-accent">
                  {t('home.hero.titleAccent')}
                </span>
              </>
            )}

            <br />

            {t('home.hero.titleLine2')}
          </h1>

          <p className="hero__subtitle">
            {t('home.hero.subtitleLine1')}
            <br />
            {t('home.hero.subtitleLine2')}
            <br />
            {t('home.hero.subtitleLine3')}
          </p>
        </div>

        <div
          className="hero__art"
          aria-hidden="true"
        >
          <HeroIllustration
            width={600}
            height={340}
            style={{ transform: 'translateY(-10px)' }}
          />
        </div>
      </div>
    </section>
  )
}
