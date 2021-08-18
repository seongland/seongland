import React, { useEffect, MutableRefObject } from 'react'
import { SpringValue } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { Object3D } from 'three'

import { useStore } from '@/store/'

export default function Intersector({
  mouse,
  root,
  set,
}: {
  mouse: SpringValue<number[]>
  root: MutableRefObject<Object3D>
  set: Function
}) {
  const camera = useThree(state => state.camera)
  const raycaster = useThree(state => state.raycaster)
  const setClick = useStore(state => state.setClick)

  // Set Click Function
  useEffect(() => {
    setClick(e => {
      const { x, y } = { x: e.clientX, y: e.clientY }
      const mouse = [x - window.innerWidth / 2, y - window.innerHeight / 2]
      const coords = { x: mouse[0] / window.innerWidth, y: mouse[1] / window.innerHeight }
      raycaster.setFromCamera(coords, camera)
      const intersect = raycaster.intersectObject(root.current, true)[0]?.object
      if (intersect?.userData?.click) intersect?.userData?.click(e)
      set({ mouse })
    })
  }, [root, camera, raycaster, set, setClick])

  // Hover Effect
  let current = null
  useFrame(({ camera }) => {
    if (root) {
      const coor = mouse.animation.fromValues
      const coords = { x: coor[0] / window.innerWidth, y: coor[1] / window.innerHeight }
      raycaster.setFromCamera(coords, camera)
      const intersect = raycaster.intersectObject(root.current, true)[0]?.object
      if (current && current.userData?.leave && intersect !== current) current.userData.leave(current)
      current = intersect
      if (intersect?.userData?.hover) intersect.userData.hover(intersect)
    }
  })
  return <></>
}
