import { useEffect } from 'react'
import { useScroll } from '@react-three/drei'

const KEY = 'scroll-offset'

export const ScrollRestoration: React.FC = () => {
  const state = useScroll()

  useEffect(() => {
    const el = state.el
    if (!el) return

    // Restore
    const stored = sessionStorage.getItem(KEY)
    if (stored) {
      const offset = parseFloat(stored)
      const length =
        el[state.horizontal ? 'scrollWidth' : 'scrollHeight'] - el[state.horizontal ? 'clientWidth' : 'clientHeight']
      state.scroll.current = offset
      state.offset = offset
      el[state.horizontal ? 'scrollLeft' : 'scrollTop'] = offset * length
    }

    const save = () => {
      sessionStorage.setItem(KEY, `${state.offset}`)
    }
    window.addEventListener('beforeunload', save)
    return () => {
      save()
      window.removeEventListener('beforeunload', save)
    }
  }, [state])

  return null
}

export default ScrollRestoration
