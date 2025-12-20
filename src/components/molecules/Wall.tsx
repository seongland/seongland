// @ts-nocheck - Temporary: @react-spring/three types incompatible with React 19
import React from 'react'
import { a } from '@react-spring/three'
import { useThree } from '@react-three/fiber'
import type { Interpolation } from '@react-spring/three'

export default function GradientWall({ color }: { color: Interpolation<number, string> }) {
  const viewport = useThree(state => state.viewport)

  return (
    <mesh scale={[viewport.width * 25, viewport.height * 2, 1]}>
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}
