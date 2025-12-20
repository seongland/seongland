import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'

export const CenterPage: React.FC<{ children: React.ReactNode; page: number; pages: number }> = ({
  page,
  pages,
  children,
}) => {
  // Pages
  const state = useScroll()
  const pageStart: (page: number) => string = page => {
    const first = 0
    const last = state.fill.clientHeight - state.fixed.clientHeight
    return `${((last - first) / (pages - 1)) * (page - 1)}px`
  }
  const centered = useRef<HTMLDivElement>(null)
  useFrame(() => {
    if (centered.current) centered.current.style.top = pageStart(page)
  })

  return (
    <div ref={centered} className="flex absolute inset-0 justify-center h-screen w-screen" style={{ top: pageStart(page) }}>
      <div className="flex items-center container justify-center">{children}</div>
    </div>
  )
}

export default CenterPage
