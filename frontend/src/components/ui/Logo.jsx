import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <svg width="77" height="72" viewBox="0 0 500 298" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M250 134.581L336.51 0L500 298H336.51L250 134.581L173.019 298H0L173.019 0L250 134.581Z"
          fill="#FFFF"
        />
      </svg>
      <div className="logo__text">
        <span className="logo__name">Aramti</span>
        <span className="logo__tag">Secure Technologies For A Carefree Life</span>
      </div>
    </Link>
  )
}