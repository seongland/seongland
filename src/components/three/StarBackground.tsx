import { Canvas } from '@react-three/fiber'
import Stars from './Stars'
import { useState, useEffect } from 'react'

export default function StarBackground() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const check = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme !== 'light')
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const bgColor = isDark ? '#111418' : '#f5f0e8'
  const starColor = isDark ? 0xfefefe : 0x2d2926

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
        <Stars color={starColor} />
      </Canvas>
    </div>
  )
}
