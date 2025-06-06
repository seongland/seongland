import React, { useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'

import { Stars } from '@/components/molecules/Stars'
import GradientWall from '@/components/molecules/Wall'
import { useThemeContext } from '@/hooks/useApp'

const WALL = {
  dark: ['#23262a', '#333639', '#202226', '#23262a'],
  light: ['#fff', '#fff', '#fff', '#fff'],
}
const INTERVAL = 30

export const TimelineSpace: React.FC<{ pages: number }> = ({ pages }) => {
  const height = useThree(state => Math.floor(state.size.height / INTERVAL) * INTERVAL)
  const { theme } = useThemeContext()
  const data = useScroll()
  const scrollMax = height * pages

  const colorSet = useMemo(() => WALL[theme], [theme])
  const [{ top }, set] = useSpring(() => ({ top: 0 }))
  useFrame(() => set.start({ top: data.range(0, 1) * scrollMax }))

  const starPosition = top.to(top => [0, -1 + top / 20, 0])
  const trainPosition = top.to(top => [0, -top / 10, 0])
  const wallColor = top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], colorSet)

  return (
    <>
      <GradientWall color={wallColor} />
      <Stars position={starPosition} />
      <a.group position={trainPosition}>
        <mesh>
          <boxGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </a.group>
    </>
  )
}

export default TimelineSpace
