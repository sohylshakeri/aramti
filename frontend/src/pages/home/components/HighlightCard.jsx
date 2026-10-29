
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'

const HighlightCard = forwardRef(function HighlightCard(
  {
    highlight,
    Illustration,
    onClick,
  },
  ref,
) {
  const { t } = useTranslation()

  return (
    <Link
      ref={ref}
      to={highlight.to}
      className="highlight-card"
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <div className="highlight-card__illustration">
        <Illustration />
      </div>

      <div className="highlight-card__content">
        <h3>{t(`home.highlights.${highlight.id}.title`)}</h3>
        <p>{t(`home.highlights.${highlight.id}.desc`)}</p>
      </div>
    </Link>
  )
})

export default HighlightCard
