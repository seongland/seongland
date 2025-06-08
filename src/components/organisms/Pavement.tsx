import React from 'react'
import { Plane, Reflector } from '@react-three/drei'

const { PI } = Math

const Pavement: React.FC = () => {
  return (
    <>
      <Plane rotation-x={-PI * 0.5} position={[0, -7.9, 0]} args={[200, 200]} receiveShadow>
        <meshBasicMaterial color="#ffcda3" transparent opacity={0.4} />
      </Plane>
      <Reflector clipBias={0.1} textureWidth={1024} textureHeight={1024} position={[0, -8, 0]} rotation={[-PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[200, 200]} />
      </Reflector>
    </>
  )
}

export default Pavement
