import { useTranslation } from '../../../app/i18n.jsx'

export default function TeamMemberCard({ member }) {
  const { t, i18n } = useTranslation()
  const {
    id,
    name,
    specialty,
    image,
  } = member

  const memberNumber = String(id).match(/\d+/)?.[0]

const displayName =
  name?.trim() ||
  `${t('about.team.fallbackName')}${memberNumber ? ` ${memberNumber}` : ''}`

const displaySpecialty =
  specialty?.trim() ||
  t('about.team.fallbackRole')

  return (
    <article className="team-card">
      <div className="team-card__photo">
        {image ? (
          <img
            src={image}
            alt={displayName}
            loading="lazy"
            draggable={false}
            onDragStart={(event) => {
              event.preventDefault()
            }}
          />
        ) : (
          <div
            className="team-card__photo-placeholder"
            aria-hidden="true"
          />
        )}
      </div>

      <strong>{displayName}</strong>
      <span>{displaySpecialty}</span>
    </article>
  )
}
