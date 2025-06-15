import React from 'react'
import { Canvas } from '@react-three/fiber'
import { StarWarsTitle } from './StarWarsTitle'

export const TypeTitle: React.FC = () => {
  return (
    <div className="absolute top-[41vh] w-full h-[40vh]" style={{ pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <StarWarsTitle />
      </Canvas>
    </div>
  )
}
