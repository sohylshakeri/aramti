import { useEffect, useState } from 'react'

/**
 * Returns true while the given media query matches. Used only for the
 * rare case where a component needs different *behavior* on mobile
 * (not just different layout, which belongs in styles/mobile.css).
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const listener = (event) => setMatches(event.matches)

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', listener)
    return () => mediaQueryList.removeEventListener('change', listener)
  }, [query])

  return matches
}
