
import reviewQuoteIcon from '../../../assets/icons/review-quote.svg'

export default function CustomerReviewCard({
  quote,
  name,
  role,
  avatar,
  className = '',
  style,
}) {
  const cardClassName = [
    'customer-review-card',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      className={cardClassName}
      style={style}
    >
      <div className="customer-review-card__content">
        <img
          className="customer-review-card__quote-icon"
          src={reviewQuoteIcon}
          alt=""
          aria-hidden="true"
        />

        <p className="customer-review-card__quote">
          {quote}
        </p>
      </div>

      <div className="customer-review-card__person">
        <img
          className="customer-review-card__avatar"
          src={avatar}
          alt=""
        />

        <div className="customer-review-card__person-text">
          <strong className="customer-review-card__name">
            {name}
          </strong>
          <span className="customer-review-card__role">
            {role}
          </span>
        </div>
      </div>
    </article>
  )
}
