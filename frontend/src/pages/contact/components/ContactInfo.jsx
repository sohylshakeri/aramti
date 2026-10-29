import { useTranslation } from '../../../app/i18n.jsx'
import { contactInfoItems } from '../../../content/contact.js'

export default function ContactInfo() {
  const { t } = useTranslation()

  return (
    <div className="contact-info">
      <h1 className="page-hero__title">
        {t('contact.hero.titleLine1')}
        <br />
        {t('contact.hero.titleLine2')}
      </h1>

      <p className="contact-info__subtitle">
        {t('contact.hero.subtitle')}
      </p>

      {contactInfoItems.map((item) => (
        <a
          className="info-card"
          key={item.id}
          href={item.href}
          target={
            item.external
              ? '_blank'
              : undefined
          }
          rel={
            item.external
              ? 'noopener noreferrer'
              : undefined
          }
        >
          <span
            className="info-card__icon"
            aria-hidden="true"
          >
            <img
              src={item.icon}
              alt=""
              draggable={false}
            />
          </span>

          <div>
            <strong>
              {t(
                `contact.info.${item.id}.label`,
              )}
            </strong>

            <span>
              {t(
                `common.footer.${item.id}`,
              )}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}