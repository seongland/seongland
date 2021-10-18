import React, { useRef, useMemo } from 'react'
import { SpringValue } from '@react-spring/three'
import { useThree } from '@react-three/fiber'

import Stars from '@/components/atoms/Stars'
import SpringText from '@/components/atoms/SpringText'
import GradientWall from '@/components/atoms/GradientWall'
import Intersector from '@/components/atoms/Intersector'
import siteConfig from '~/site-config'

const DARK_WALL = ['#23262a', '#424242', '#232424', '#23262a']
const LIGHT_WALL = ['#fff', '#fff', '#fff', '#fff']
const DARK_FONT = 'white'
const LIGHT_FONT = 'black'

export default function SpaceScene({
  top,
  isDarkMode,
  mouse,
  set,
}: {
  top: SpringValue<number>
  mouse: SpringValue<number[]>
  isDarkMode: boolean
  set: Function
}) {
  const renderPer = 30
  const height = useThree(state => Math.floor(state.size.height / renderPer) * renderPer)
  const scrollMax = height * 5.25

  // Dark Mode
  const color = useMemo(() => (isDarkMode ? DARK_FONT : LIGHT_FONT), [isDarkMode])
  const colorSet = useMemo(() => (isDarkMode ? DARK_WALL : LIGHT_WALL), [isDarkMode])

  // Spring Props
  const starPosition = top.to(top => [0, -1 + top / 20, 0])
  const titlePosition = top.to(top => [0, -0.5 + top / 200, 0])
  const exporePosition = top.to(top => [0, -18 + ((top * 10.5) / scrollMax) * 2, 0])
  const wallColor = top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], colorSet)

  // Ref JSX
  const intersectRoot = useRef(null)
  return (
    <>
      <GradientWall color={wallColor} />
      <Stars isDarkMode={isDarkMode} position={starPosition} />
      <group ref={intersectRoot}>
        <SpringText position={titlePosition} fontSize={50} color={color}>
          {siteConfig.title}
        </SpringText>
        <SpringText onClick={() => (location.href = '/wiki')} position={exporePosition} color={color} fontSize={50}>
          Click to Explore
        </SpringText>
      </group>
      <Intersector set={set} mouse={mouse} root={intersectRoot} />
    </>
  )
}
