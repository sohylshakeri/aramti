import { useTranslation } from '../../../app/i18n.jsx'
import PageHero from '../../../components/ui/PageHero.jsx'

export default function AboutHeroSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'

  if (isFarsi) {
    return (
      <div className="about-hero">
        <PageHero word={t('about.hero.backgroundWord')}>
          <span className="eyebrow about-hero__eyebrow">
            <span className="rtl-inline-title rtl-inline-title--about-hero">
              <span>{t('about.hero.eyebrowPrefix')}</span>
              <span className="about-hero__eyebrow-accent">
                {t('about.hero.eyebrowAccent')}
              </span>
            </span>
          </span>
        </PageHero>
      </div>
    )
  }

  return (
    <div className="about-hero">
      <PageHero word={t('about.hero.backgroundWord')}>
        <span className="eyebrow about-hero__eyebrow">
          {t('about.hero.eyebrow')
            .split(' ')
            .map((word, index, words) => (
              <span
                key={`${word}-${index}`}
                className={
                  index === 1
                    ? 'about-hero__eyebrow-accent'
                    : undefined
                }
              >
                {word}
                {index < words.length - 1 ? ' ' : ''}
              </span>
            ))}
        </span>
      </PageHero>
    </div>
  )
}
