import React from 'react'
import { Plane, MeshReflectorMaterial } from '@react-three/drei'

const { PI } = Math

const Pavement: React.FC = () => {
  return (
    <>
      <Plane rotation-x={-PI * 0.5} position={[0, -7.9, 0]} args={[200, 200]} receiveShadow>
        <meshBasicMaterial color="#ffcda3" transparent opacity={0.4} />
      </Plane>
      <mesh position={[0, -8, 0]} rotation={[-PI * 0.5, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial blur={[0, 0]} mixBlur={0} mixStrength={0.5} resolution={1024} />
      </mesh>
    </>
  )
}

export default Pavement
