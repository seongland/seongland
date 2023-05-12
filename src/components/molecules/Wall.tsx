import React from 'react'
import { a } from '@react-spring/three'
import { useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import type { Interpolation } from '@react-spring/three'

export default function GradientWall({ color }: { color: Interpolation<number, string> }) {
  const viewport = useThree(state => state.viewport)
  const data = useScroll()
  return (
    <mesh scale={[viewport.width * 25, viewport.height * 2, 1]}>
      <planeGeometry attach="geometry" args={[1, data.pages * 2]} />
      {/* @ts-ignore */}
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}
