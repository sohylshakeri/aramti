import { useEffect, useState } from 'react'

import { useTranslation } from '../../../app/i18n.jsx'
import { getHomeStats } from '../services/homeApi.js'

export default function WhyUsSection() {
  const { t, i18n } = useTranslation()

  const isFarsi = i18n.language === 'fa'

  const [stats, setStats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    getHomeStats()
      .then((data) => {
        if (!isMounted) {
          return
        }

        const orderedStats = [...data].sort(
          (a, b) => a.order - b.order,
        )

        setStats(orderedStats)
        setHasError(false)
      })
      .catch((error) => {
        console.error(
          '[Home Stats] Failed to load statistics:',
          error,
        )

        if (isMounted) {
          setHasError(true)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="section">
      <div className="container why-us">
        <div className="why-us__head">
          <h2 className="section__title">
            {isFarsi ? (
              <span className="rtl-inline-title">
                <span className="text-accent">
                  {t('home.whyUs.titleAccent')}
                </span>

                <span>
                  {t('home.whyUs.titlePrefix')}
                </span>
              </span>
            ) : (
              <>
                {t('home.whyUs.titlePrefix')}{' '}

                <span className="text-accent">
                  {t('home.whyUs.titleAccent')}
                </span>
              </>
            )}
          </h2>

          <p className="why-us__desc">
            {t('home.whyUs.desc')}
          </p>
        </div>

        <div
          className="why-us__stats"
          aria-busy={isLoading}
        >
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="stat"
            >
              <span className="stat__number">
                {stat.value}

                {stat.plus && (
                  <span className="stat__plus">
                    +
                  </span>
                )}
              </span>

              <span className="stat__label">
                {t(`home.stats.${stat.key}`)}
              </span>
            </div>
          ))}
        </div>

        {hasError && (
          <p
            className="why-us__error"
            role="alert"
          >
            {t('home.stats.loadError')}
          </p>
        )}
      </div>
    </section>
  )
}