import React, { useRef } from 'react'
import { SpringValue } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { Object3D } from 'three'

import Stars from '@/components/atoms/Stars'
import SpringText from '@/components/atoms/SpringText'
import GradientWall from '@/components/atoms/GradientWall'
import siteConfig from '~/site-config'
import { useStore } from '@/store/'

const DARK_WALL = ['#23262a', '#424242', '#232424', '#000']
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
  const colorSet = isDarkMode ? DARK_WALL : LIGHT_WALL
  const { size } = useThree()
  const scrollMax = size.height * 4.5
  const color = isDarkMode ? DARK_FONT : LIGHT_FONT
  const root = useRef(null)
  return (
    <>
      <GradientWall color={top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], colorSet)} />
      <Stars isDarkMode={isDarkMode} position={top.to(top => [0, -1 + top / 20, 0])} />

      <group ref={root}>
        <SpringText position={top.to(top => [0, -1 + top / 200, 0])} fontSize={50} color={color}>
          {siteConfig.title}
        </SpringText>
        <SpringText
          onClick={() => (location.href = '/wiki')}
          position={top.to(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])}
          color={color}
          fontSize={50}
        >
          Click to Explore
        </SpringText>
      </group>

      <Intersector set={set} mouse={mouse} root={root.current} />
    </>
  )
}

function Intersector({ mouse, root, set }: { mouse: SpringValue<number[]>; root: Object3D; set: Function }) {
  const { raycaster } = useThree()
  const setClick = useStore(state => state.setClick)

  useFrame(({ camera }) => {
    const coords = {
      x: mouse.animation.fromValues[0] / window.innerWidth,
      y: mouse.animation.fromValues[1] / window.innerHeight,
    }
    setClick(e => {
      const { x, y } = { x: e.clientX, y: e.clientY }
      const mouse = [x - window.innerWidth / 2, y - window.innerHeight / 2]
      set({ mouse })
      const coords = {
        x: mouse[0] / window.innerWidth,
        y: mouse[1] / window.innerHeight,
      }
      raycaster.setFromCamera(coords, camera)
      const intersect = raycaster.intersectObject(root, true)[0]?.object
      if (intersect?.userData?.click) intersect?.userData?.click(e)
    })
    raycaster.setFromCamera(coords, camera)
    const intersect = raycaster.intersectObject(root, true)[0]?.object
    if (intersect?.userData?.click) document.body.style.cursor = 'pointer'
    else document.body.style.cursor = 'default'
  })
  return <></>
}
