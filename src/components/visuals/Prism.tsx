import { MeshTransmissionMaterial } from '@react-three/drei'
import React from 'react'

export interface PrismProps {
  onPointerOver?: (e: React.PointerEvent) => void
  onPointerOut?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void
  [key: string]: unknown
}

export const Prism: React.FC<PrismProps> = ({ onPointerOver, onPointerOut, onPointerMove, ...props }) => {
  return (
    <group {...props}>
      <mesh
        visible={false}
        scale={1.9}
        rotation={[Math.PI / 2, Math.PI, 0]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerMove={onPointerMove}>
        <cylinderGeometry args={[1, 1, 1, 3, 1]} />
      </mesh>
      <mesh position={[0, 0, 0.6]} renderOrder={10} scale={2} dispose={null}>
        <cylinderGeometry args={[1, 1, 1, 3, 1]} />
        <MeshTransmissionMaterial
          clearcoat={1}
          transmission={1}
          thickness={0.9}
          roughness={0}
          anisotropy={0.1}
          chromaticAberration={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
