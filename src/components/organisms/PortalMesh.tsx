import React from 'react'
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'

const PortalMesh: React.FC = () => {
  return (
    <>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={2}
          anisotropicBlur={2}
          chromaticAberration={0.2}
          envMapIntensity={0.1}
          thickness={0.1}
          distortionScale={0.1}
          distortion={2}
          temporalDistortion={0.2}
        />
      </mesh>
      <mesh position={[-1.2, -1.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial metalness={0} roughness={0} color="black" />
      </mesh>
      <mesh position={[1.2, -1.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial metalness={0} roughness={0.45} color="black" />
      </mesh>
      <Environment resolution={1024} frames={Infinity} background={false} blur={0}>
        <Lightformer position={[20, 0, 10]} scale={[1, 1000, 1]} intensity={100} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}

export default PortalMesh
