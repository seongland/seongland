import React from 'react'
import { SpringValue } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { Object3D } from 'three'

import { useStore } from '@/store/'

export default function Intersector({ mouse, root, set }: { mouse: SpringValue<number[]>; root: Object3D; set: Function }) {
  const { camera, raycaster } = useThree(state => state)
  const setClick = useStore(state => state.setClick)

  // Set Click Function
  setClick(e => {
    const { x, y } = { x: e.clientX, y: e.clientY }
    const mouse = [x - window.innerWidth / 2, y - window.innerHeight / 2]
    const coords = {
      x: mouse[0] / window.innerWidth,
      y: mouse[1] / window.innerHeight,
    }
    raycaster.setFromCamera(coords, camera)
    const intersect = raycaster.intersectObject(root, true)[0]?.object
    if (intersect?.userData?.click) intersect?.userData?.click(e)
    set({ mouse })
  })

  // Hover Effect
  useFrame(({ camera }) => {
    const coords = {
      x: mouse.animation.fromValues[0] / window.innerWidth,
      y: mouse.animation.fromValues[1] / window.innerHeight,
    }
    raycaster.setFromCamera(coords, camera)
    const intersect = raycaster.intersectObject(root, true)[0]?.object
    if (intersect?.userData?.click) document.body.style.cursor = 'pointer'
    else document.body.style.cursor = 'default'
  })
  return <></>
}
