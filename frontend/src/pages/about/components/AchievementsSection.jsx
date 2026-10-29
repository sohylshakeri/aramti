import { useTranslation } from '../../../app/i18n.jsx'

import AchievementItem from './AchievementItem.jsx'
import AchievementOneIllustration from './AchievementOneIllustration.jsx'
import AchievementTwoIllustration from './AchievementTwoIllustration.jsx'

export default function AchievementsSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'

  return (
    <section className="achievements">
      <div className="container achievements__inner">
        <AchievementItem
          title={
            isFarsi
              ? t('about.achievements.first.title')
              : t('about.hero.titleLine2')
          }
          description={
            isFarsi
              ? t('about.achievements.first.description')
              : t('about.hero.description')
          }
          illustration={<AchievementOneIllustration />}
        />

        <AchievementItem
          title={t('about.achievements.second.title')}
          description={t('about.achievements.second.description')}
          illustration={<AchievementTwoIllustration />}
          reverse
        />
      </div>
    </section>
  )
}
