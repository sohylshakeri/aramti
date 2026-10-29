export default function AchievementItem({
  title,
  description,
  illustration,
  reverse = false,
}) {
  return (
    <div
      className={`achievement-item${
        reverse ? ' achievement-item--reverse' : ''
      }`}
    >
      <div className="achievement-item__content">
        <h2 className="achievement-item__title">
          {title}
        </h2>

        <p className="achievement-item__description">
          {description}
        </p>
      </div>

      <div
        className="achievement-item__visual"
        aria-hidden="true"
      >
        {illustration}
      </div>
    </div>
  )
}