import React, { useMemo, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useSpring } from '@react-spring/three'

import { Stars } from '@/components/molecules/Stars'
import GradientWall from '@/components/molecules/Wall'
import { Rainbow } from '@/components/visuals/Rainbow'
import { Prism } from '@/components/visuals/Prism'
import * as THREE from 'three'
import { useThemeContext } from '@/hooks/useApp'

const WALL = {
  dark: ['#23262a', '#333639', '#202226', '#23262a'],
  light: ['#fff', '#fff', '#fff', '#fff'],
}
const INTERVAL = 30

export const ScrollSpace: React.FC = () => {
  const height = useThree(state => Math.floor(state.size.height / INTERVAL) * INTERVAL)
  const { theme } = useThemeContext()
  const data = useScroll()
  const scrollMax = height * data.pages

  // Dark Mode
  const colorSet = useMemo(() => WALL[theme], [theme])
  const [{ top }, set] = useSpring(() => ({ top: 0 }))
  const rainbow = useRef<THREE.Mesh>(null)
  useFrame(state => {
    set.start({ top: data.range(0, 1) * scrollMax })
    if (rainbow.current)
      rainbow.current.position.set(
        (state.pointer.x * state.viewport.width) / 2,
        (state.pointer.y * state.viewport.height) / 2,
        0,
      )
  })

  // Spring Props
  const starPosition = top.to(top => [0, -1 + top / 20, 0])
  const wallColor = top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], colorSet)

  // Ref JSX
  return (
    <>
      <GradientWall color={wallColor} />
      <Stars position={starPosition} />
      <Rainbow ref={rainbow} />
      <Prism position={[0, -1, 0]} />
    </>
  )
}
