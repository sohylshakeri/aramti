import {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

import { useLocation } from 'react-router-dom'

const DESIGN_WIDTH = 1440

export default function ScaleWrapper({ children }) {
  const { pathname } = useLocation()

  const [scale, setScale] = useState(1)

  const hideBackgroundPattern =
    pathname.startsWith('/contact') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/auth/callback')

  function recalc() {
    const viewportWidth =
      document.documentElement.clientWidth

    const nextScale = Math.min(
      1,
      viewportWidth / DESIGN_WIDTH,
    )

    setScale(nextScale)
  }

  useLayoutEffect(() => {
    recalc()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', recalc)

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize',
        recalc,
      )
    }

    return () => {
      window.removeEventListener('resize', recalc)

      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          recalc,
        )
      }
    }
  }, [])

  return (
    <div className="scale-viewport">
      <div
        className={`scale-content${
          hideBackgroundPattern
            ? ' scale-content--no-pattern'
            : ''
        }`}
        style={{ zoom: scale }}
      >
        {children}
      </div>
    </div>
  )
}