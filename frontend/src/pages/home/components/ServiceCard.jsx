import { Link } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'
import { iconArrow } from '../../../content/home.js'

export default function ServiceCard({ service }) {
  const { t } = useTranslation()

  const contactUrl =
    `/contact?service=${service.contactOption}#contact-form`

  return (
    <Link
      className="service-card"
      to={contactUrl}
    >
      <div className="service-card__top">
        <span
          className="service-card__icon"
          style={{ '--icon': `url(${service.icon})` }}
          aria-hidden="true"
        />

        <span
          className="service-card__arrow"
          style={{ '--icon': `url(${iconArrow})` }}
          aria-hidden="true"
        />
      </div>

      <h3>{service.name}</h3>

      <p>
        {t(
          `home.services.items.${service.id}.desc`,
        )}
      </p>
    </Link>
  )
}