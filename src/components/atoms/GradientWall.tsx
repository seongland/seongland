import React from 'react'
import { a } from '@react-spring/three'
import { useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'

export default function GradientWall({ color }: { color: any }) {
  const viewport = useThree(state => state.viewport)
  const data = useScroll()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, data.pages * 2]} />
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}
