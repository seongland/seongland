import React, { useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useSpring } from '@react-spring/three'

import Stars from '@/components/molecules/Stars'
import GradientWall from '@/components/molecules/Wall'

const DARK_WALL = ['#23262a', '#424242', '#232424', '#23262a']
const LIGHT_WALL = ['#fff', '#fff', '#fff', '#fff']

export const ScrollSpace: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const renderPer = 30
  const height = useThree(state => Math.floor(state.size.height / renderPer) * renderPer)
  const data = useScroll()
  const scrollMax = height * data.pages

  // Dark Mode
  const colorSet = useMemo(() => (isDarkMode ? DARK_WALL : LIGHT_WALL), [isDarkMode])
  const [{ top }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
  useFrame(() => set.start({ top: data.range(0, 1) * scrollMax }))

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
