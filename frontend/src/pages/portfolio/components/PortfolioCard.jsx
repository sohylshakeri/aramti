import { useTranslation } from '../../../app/i18n.jsx'

export default function PortfolioCard({
  project,
  activeFilter,
  onFilterChange,
}) {
  const { t } = useTranslation()

  const isDesignActive = activeFilter === 'uiUxDesign'

  const secondaryFilterId =
    activeFilter === 'all' || isDesignActive
      ? project.primaryCategoryId
      : activeFilter

  const isSecondaryActive =
    activeFilter !== 'all' && !isDesignActive

  return (
    <article className="portfolio-card">
      <div
        className={`portfolio-card__image portfolio-card__image--${project.tone}`}
        aria-hidden="true"
      />

      <h3 className="portfolio-card__title">
        {t(`portfolio.projects.${project.id}.title`)}
      </h3>

      <div className="pill-group portfolio-card__tags">
        <button
          type="button"
          className={[
            'pill',
            'portfolio-card__tag',
            isDesignActive ? 'portfolio-card__tag--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onFilterChange('uiUxDesign')}
        >
          {t('portfolio.tags.design')}
        </button>

        <button
          type="button"
          className={[
            'pill',
            'portfolio-card__tag',
            isSecondaryActive ? 'portfolio-card__tag--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() =>
            onFilterChange(secondaryFilterId)
          }
        >
          {t(`portfolio.filters.${secondaryFilterId}`)}
        </button>
      </div>

      <p className="portfolio-card__description">
        {t(`portfolio.projects.${project.id}.desc`)}
      </p>
    </article>
  )
}