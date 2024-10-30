import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    let timeoutId: NodeJS.Timeout

    const handler = (event: MediaQueryListEvent) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        setMatches(event.matches)
      }, 100)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [query])

  return matches
}
