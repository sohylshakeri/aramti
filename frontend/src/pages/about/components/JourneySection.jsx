import { useTranslation } from '../../../app/i18n.jsx'
import { timelineItems } from '../../../content/about.js'
import TimelineRail from './TimelineRail.jsx'

export default function JourneySection() {
  const { t } = useTranslation()

  return (
    <section className="section">
      <div className="container">
        <div className="timeline">
          <div className="timeline__rail">
            <TimelineRail />
          </div>

          {timelineItems.map((item) => (
            <div
              className={[
                'timeline__row',
                item.reverse ? 'timeline__row--reverse' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={item.id}
            >
              <span className="timeline__year">
                {item.year}
              </span>

              <div className="timeline__content">
                <h3>
                  {t(`about.timeline.${item.id}.title`)}
                </h3>

                <p>
                  {t(`about.timeline.${item.id}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}