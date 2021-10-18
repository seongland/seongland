import React, { useRef, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useSpring } from '@react-spring/three'

import Stars from '@/components/atoms/Stars'
import GradientWall from '@/components/atoms/GradientWall'

const DARK_WALL = ['#23262a', '#424242', '#232424', '#23262a']
const LIGHT_WALL = ['#fff', '#fff', '#fff', '#fff']

export default function ScrollSpace({ isDarkMode }: { isDarkMode: boolean }) {
  const height = useThree(state => state.viewport.height)
  const data = useScroll()
  const scrollMax = height * data.pages

  // Dark Mode
  const colorSet = useMemo(() => (isDarkMode ? DARK_WALL : LIGHT_WALL), [isDarkMode])
  const [{ top }] = useSpring(() => ({ top: 0 }))

  // Spring Props
  const starPosition = top.to(top => [0, -1 + top / 20, 0])
  const wallColor = top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], colorSet)

  // Ref JSX
  return (
    <>
      <GradientWall color={wallColor} />
      <Stars isDarkMode={isDarkMode} position={starPosition} />
    </>
  )
}
