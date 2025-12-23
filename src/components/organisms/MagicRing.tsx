import * as THREE from 'three'
import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Plane, MeshReflectorMaterial } from '@react-three/drei'
import gsap from 'gsap'
import { Text3D } from './Text3D'

const { PI, sin, cos } = Math

interface LetterProps {
  i: number
  count: number
  radius: number
  l: string
}

const Letter: React.FC<LetterProps> = ({ i, count, radius, l }) => {
  return (
    <group rotation={[0, 0, 0]}>
      <Text3D
        hAlign="center"
        position={[radius * sin((i / count) * PI * 2), -0.8, radius * cos((i / count) * PI * 2)]}
        rotation={[0, (i / count) * PI * 2, 0]}
        i={i}>
        {l}
      </Text3D>
    </group>
  )
}

interface MagicProps {
  text: string
  radius: number
  position?: [number, number, number]
}

const Magic: React.FC<MagicProps> = ({ text, radius, position }) => {
  const ref = useRef<THREE.Group>(null)
  const count = text.length

  useEffect(() => {
    if (!ref.current) return
    const tween = gsap.to(ref.current.rotation, {
      duration: 6,
      y: PI * 1.3 + PI * 2,
      repeat: -1,
      ease: 'power3.inOut',
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <group ref={ref} position={position} rotation={[0, PI * 1.3, 0]} scale={[-1, 1, 1]}>
      {text.split('').map((l, i) => (
        <Letter key={`l${i}`} l={l} radius={radius} i={i} count={count} />
      ))}
    </group>
  )
}

const Pavement: React.FC = () => {
  return (
    <>
      <Plane rotation-x={-PI * 0.5} position={[0, -7.9, 0]} args={[200, 200]} receiveShadow>
        <meshBasicMaterial color="#ffcda3" transparent opacity={0.4} />
      </Plane>
      <mesh position={[0, -8, 0]} rotation={[-PI * 0.5, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#ffcda3"
          metalness={0.5}
          mirror={0}
        />
      </mesh>
    </>
  )
}

interface MagicRingSceneProps {
  text?: string
  radius?: number
}

export const MagicRingScene: React.FC<MagicRingSceneProps> = ({ text = 'SEONGLAND', radius = 25 }) => {
  return (
    <Canvas camera={{ fov: 30, position: [0, 90, 180] }}>
      <color attach="background" args={['#ebcfba']} />
      <directionalLight position={[-40, 20, 20]} color="#c59cf1" />
      <directionalLight position={[10.5, 20, 10]} intensity={1.5} color="#e78f48" />
      <ambientLight color="#8d69cb" />
      <Suspense fallback={null}>
        <Pavement />
        <Environment preset="night" />
        <Magic text={text.toUpperCase()} radius={radius} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}

export default MagicRingScene
