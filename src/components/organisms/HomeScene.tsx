import * as THREE from 'three'
import React, { useRef, Suspense, useMemo, useEffect, useLayoutEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls, Plane, MeshReflectorMaterial, Float, Stars, Sparkles } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap'

const { PI, sin, cos } = Math

// 3D Text component
interface Text3DProps {
  children: string
  vAlign?: 'center' | 'top' | 'bottom'
  hAlign?: 'center' | 'left' | 'right'
  size?: number
  color?: string
  i?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Text3D({
  children,
  vAlign = 'center',
  hAlign = 'center',
  size = 10,
  color = '#f7b77e',
  i = 0,
  ...props
}: Text3DProps) {
  const font = useLoader(FontLoader, '/bold.blob')
  const config = useMemo(
    () => ({
      font,
      size,
      height: 2,
      curveSegments: 30,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelOffset: 0.1,
      bevelSegments: 30,
    }),
    [font, size],
  )
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)

  useLayoutEffect(() => {
    const self = mesh.current
    if (!self) return
    const sizeVec = new THREE.Vector3()
    const geo = self.geometry as THREE.BufferGeometry
    geo.computeBoundingBox()
    if (geo.boundingBox) {
      geo.boundingBox.getSize(sizeVec)
      self.position.x = hAlign === 'center' ? -sizeVec.x / 2 : hAlign === 'right' ? 0 : -sizeVec.x
      self.position.y = vAlign === 'center' ? -sizeVec.y / 2 : vAlign === 'top' ? 0 : -sizeVec.y
    }
  }, [children, hAlign, vAlign])

  useEffect(() => {
    if (!mesh.current || !group.current) return
    const baseDelay = 1.5 + i * 0.1
    const rotationTween = gsap.to(mesh.current.rotation, {
      duration: 1.4,
      ease: 'power3.inOut',
      delay: baseDelay,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
      x: Math.PI * 0.5,
    })
    const floatTween = gsap.to(group.current.position, {
      duration: 1.4,
      ease: 'power3.inOut',
      delay: baseDelay,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
      y: 1.8,
    })
    return () => {
      rotationTween.kill()
      floatTween.kill()
    }
  }, [i])

  return (
    <group {...props} ref={group}>
      <mesh ref={mesh}>
        {/* @ts-expect-error - textGeometry extended */}
        <textGeometry args={[children, config]} />
        <meshStandardMaterial metalness={0.2} roughness={0.3} color={color} />
      </mesh>
    </group>
  )
}

// Letter in the ring
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

// Magic rotating ring of letters
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

// Reflective pavement
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

// Seeded random number generator for deterministic values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Pre-computed orb data to avoid Math.random during render
const orbData = Array.from({ length: 20 }, (_, i) => ({
  position: [
    (seededRandom(i * 3) - 0.5) * 100,
    seededRandom(i * 3 + 1) * 50 + 10,
    (seededRandom(i * 3 + 2) - 0.5) * 100,
  ] as [number, number, number],
  speed: 1 + seededRandom(i * 7),
  size: 0.5 + seededRandom(i * 11),
  hue: seededRandom(i * 13) * 60 + 20,
}))

// Floating decorative orbs
const FloatingOrbs: React.FC = () => {
  return (
    <>
      {orbData.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.5} floatIntensity={2}>
          <mesh position={orb.position}>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshStandardMaterial color={`hsl(${orb.hue}, 70%, 60%)`} metalness={0.8} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

interface HomeSceneProps {
  text?: string
}

export const HomeScene: React.FC<HomeSceneProps> = ({ text = 'SEONGLAND' }) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ fov: 30, position: [0, 90, 180] }}>
        <color attach="background" args={['#ebcfba']} />
        <fog attach="fog" args={['#ebcfba', 100, 300]} />
        <directionalLight position={[-40, 20, 20]} color="#c59cf1" intensity={1} />
        <directionalLight position={[10.5, 20, 10]} intensity={1.5} color="#e78f48" />
        <ambientLight color="#8d69cb" intensity={0.5} />

        <Suspense fallback={null}>
          <Pavement />
          <FloatingOrbs />
          <Sparkles count={200} scale={100} size={3} speed={0.4} color="#ffaa55" />
          <Stars radius={200} depth={100} count={3000} factor={6} saturation={0} fade speed={0.5} />
          <Environment preset="night" />
          <Magic text={text.toUpperCase()} radius={25} />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}

export default HomeScene
