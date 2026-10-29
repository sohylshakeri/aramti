import { useEffect, useState } from 'react'
import { useTranslation } from '../../../app/i18n.jsx'
import PageHero from '../../../components/ui/PageHero.jsx'
import {
  portfolioFilterIds,
} from '../../../content/portfolio.js'

import {
  getPortfolioProjects,
} from '../services/portfolioApi.js'
import PortfolioCard from './PortfolioCard.jsx'

export default function PortfolioSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'
  const [activeFilter, setActiveFilter] = useState('all')
  const visibleFilterIds = portfolioFilterIds
  const [portfolioProjects, setPortfolioProjects] = useState([])

  useEffect(() => {
    let isMounted = true

    getPortfolioProjects().then((data) => {
      if (isMounted) {
        setPortfolioProjects(data)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleProjects =
    activeFilter === 'all'
      ? portfolioProjects
      : portfolioProjects.filter((project) =>
          project.filterIds.includes(activeFilter),
        )

  return (
    <PageHero word={t('portfolio.hero.backgroundWord')}>
      <h1 className="portfolio-hero__title">
        {isFarsi ? (
          <span className="rtl-inline-title rtl-inline-title--portfolio">
            <span className="portfolio-hero__title-accent">
              {t('portfolio.hero.titleAccent')}
            </span>
            <span>{t('portfolio.hero.titleAfter')}</span>
          </span>
        ) : (
          <>
            {t('portfolio.hero.titleBefore')}{' '}
            <span className="portfolio-hero__title-accent">
              {t('portfolio.hero.titleAccent')}
            </span>{' '}
            {t('portfolio.hero.titleAfter')}
          </>
        )}
      </h1>

      <div className="pill-group center portfolio-filters">
        {visibleFilterIds.map((id) => (
          <button
            type="button"
            key={id}
            className={[
              'pill',
              activeFilter === id ? 'pill--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveFilter(id)}
          >
            {t(`portfolio.filters.${id}`)}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {visibleProjects.map((project) => (
          <PortfolioCard
            key={project.id}
            project={project}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        ))}
      </div>
    </PageHero>
  )
}
