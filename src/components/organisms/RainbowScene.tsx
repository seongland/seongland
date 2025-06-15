import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Prism } from '../visuals/Prism'
import { Rainbow } from '../visuals/Rainbow'
import * as THREE from 'three'

export const RainbowScene: React.FC = () => {
  const rainbow = useRef<THREE.Mesh>(null!)

  useFrame(state => {
    if (rainbow.current)
      rainbow.current.position.set(
        (state.pointer.x * state.viewport.width) / 2,
        (state.pointer.y * state.viewport.height) / 2,
        0,
      )
  })

  return (
    <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 70 }}>
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.2} />
      <Rainbow ref={rainbow} />
      <Prism position={[0, -2, 0]} />
    </Canvas>
  )
}

export default RainbowScene
