export default function CustomerMapMarker({
  type = 'customer',
  x,
  y,
  isActive = false,
  label = '',
  onClick,
  className = '',
}) {
  const markerClassName = [
    'customer-map-marker',
    `customer-map-marker--${type}`,
    isActive ? 'is-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const markerStyle = {
    left: `${x}%`,
    top: `${y}%`,
  }

  if (type === 'review') {
    return (
      <button
        type="button"
        className={markerClassName}
        style={markerStyle}
        aria-label={label}
        aria-pressed={isActive}
        onClick={onClick}
      />
    )
  }

  return (
    <span
      className={markerClassName}
      style={markerStyle}
      aria-hidden="true"
    />
  )
}