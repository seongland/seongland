import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Prism } from '../visuals/Prism'
import { Rainbow } from '../visuals/Rainbow'
import * as THREE from 'three'

export const RainbowScene: React.FC = () => {
  const rainbow = useRef<THREE.Mesh>(null!)

  const RainbowFollower: React.FC = () => {
    useFrame(state => {
      if (rainbow.current)
        rainbow.current.position.set(
          (state.pointer.x * state.viewport.width) / 2,
          (state.pointer.y * state.viewport.height) / 2,
          0,
        )
    })
    return <Rainbow ref={rainbow} />
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RainbowFollower />
      <Prism position={[0, 0, 0]} />
    </Canvas>
  )
}

export default RainbowScene
