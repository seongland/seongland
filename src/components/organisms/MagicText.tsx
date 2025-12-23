import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, Suspense, useLayoutEffect } from 'react'
import { Canvas, useLoader, useFrame, type ThreeElements } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { Environment, OrbitControls, Plane } from '@react-three/drei'
import gsapLib from 'gsap'

export function Text({
  children,
  vAlign = 'center',
  hAlign = 'center',
  i,
  ...props
}: {
  children: string
  vAlign?: 'center' | 'top' | 'bottom'
  hAlign?: 'center' | 'left' | 'right'
  i: number
} & ThreeElements['group']) {
  const font = useLoader(FontLoader, '/bold.blob')
  const config = useMemo(
    () => ({
      font,
      size: 10,
      height: 2,
      curveSegments: 30,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelOffset: 0.1,
      bevelSegments: 30,
    }),
    [font],
  )
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)

  useLayoutEffect(() => {
    const self = mesh.current
    if (!self) return
    const sizeVec = new THREE.Vector3()
    const geo = self.geometry as THREE.BufferGeometry
    geo.computeBoundingBox()
    geo.boundingBox?.getSize(sizeVec)
    self.position.x = hAlign === 'center' ? -sizeVec.x / 2 : hAlign === 'right' ? 0 : -sizeVec.x
    self.position.y = vAlign === 'center' ? -sizeVec.y / 2 : vAlign === 'top' ? 0 : -sizeVec.y
  }, [children, hAlign, vAlign])

  useEffect(() => {
    if (!mesh.current || !group.current) return
    const baseDelay = 1.5 + i * 0.1
    const rotationTween = gsapLib.to(mesh.current.rotation, {
      duration: 1.4,
      ease: 'power3.inOut',
      delay: baseDelay,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
      x: Math.PI * 0.5,
    })
    const floatTween = gsapLib.to(group.current.position, {
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
        {/* @ts-ignore */}
        <textBufferGeometry args={[children, config]} />
        <meshStandardMaterial metalness={0.2} roughness={0.3} color="#f7b77e" />
      </mesh>
    </group>
  )
}

function Letter({ i, count, radius, l }: { i: number; count: number; radius: number; l: string }) {
  return (
    <Text
      hAlign="center"
      position={[radius * Math.sin((i / count) * Math.PI * 2), -0.8, radius * Math.cos((i / count) * Math.PI * 2)]}
      rotation={[0, (i / count) * Math.PI * 2, 0]}
      i={i}>
      {l}
    </Text>
  )
}

function Magic({
  text,
  count,
  radius,
  position,
}: {
  text: string
  count: number
  radius: number
  position?: [number, number, number]
}) {
  const ref = useRef<THREE.Group>(null)
  const rotationClock = useRef(0)
  useFrame((_, delta) => {
    rotationClock.current += delta * (Math.PI / 3)
    const group = ref.current
    if (!group) return
    group.rotation.y = Math.PI * 1.3 + (rotationClock.current % (Math.PI * 2))
  })
  return (
    <group ref={ref} position={position} rotation={[0, Math.PI * 1.3, 0]} scale={[-1, 1, 1]}>
      {text.split('').map((l, i) => (
        <Letter key={`l${i}`} l={l} radius={radius} i={i} count={count} />
      ))}
    </group>
  )
}

export const MagicTextRing: React.FC = () => {
  return (
    <Canvas camera={{ fov: 30, position: [0, 90, 180] }}>
      <color attach="background" args={['#ebcfba']} />
      <directionalLight position={[-40, 20, 20]} color="#c59cf1" />
      <directionalLight position={[10.5, 20, 10]} intensity={1.5} color="#e78f48" />
      <ambientLight color="#8d69cb" />
      <Suspense fallback={null}>
        <Plane rotation-x={-Math.PI * 0.5} position={[0, -7.9, 0]} args={[200, 200]} receiveShadow>
          <meshBasicMaterial color="#ffcda3" attach="material" transparent opacity={0.4} />
        </Plane>
        {/* Ground plane placeholder after removing Reflector */}
        <Environment preset="night" />
        <Magic text="PLAYGROUND" count={11} radius={25} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}
