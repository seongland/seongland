import { Canvas } from '@react-three/fiber'
import Stars from './Stars'
import { useState, useEffect } from 'react'

export default function StarBackground() {
  const [isDark, setIsDark] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme !== 'light')
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const bgColor = isDark ? '#111418' : '#f5f0e8'
  const starColor = isDark ? 0xfefefe : 0x2d2926

  const parallaxOffset = scrollY

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 75 }} style={{ background: bgColor }}>
        <Stars color={starColor} scrollOffset={parallaxOffset} />
      </Canvas>
    </div>
  )
}
