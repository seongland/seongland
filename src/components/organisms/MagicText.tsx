import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Environment, OrbitControls, Plane } from '@react-three/drei'
import gsap from 'gsap'

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
} & JSX.IntrinsicElements['group']) {
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

  useEffect(() => {
    const self = mesh.current
    if (!self) return
    const sizeVec = new THREE.Vector3()
    const geo = self.geometry as THREE.BufferGeometry
    geo.computeBoundingBox()
    geo.boundingBox?.getSize(sizeVec)
    self.position.x += hAlign === 'center' ? -sizeVec.x / 2 : hAlign === 'right' ? 0 : -sizeVec.x
    self.position.y += vAlign === 'center' ? -sizeVec.y / 2 : vAlign === 'top' ? 0 : -sizeVec.y
  }, [children, hAlign, vAlign])

  useEffect(() => {
    gsap.defaults({
      duration: 1.4,
      ease: 'power3.inOut',
      delay: 1.5 + i * 0.1,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
    })
    gsap.to(mesh.current?.rotation ?? {}, {
      x: Math.PI * 0.5,
    })
    gsap.to(group.current?.position ?? {}, {
      y: 1.8,
    })
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
  useEffect(() => {
    gsap.to(ref.current?.rotation ?? {}, {
      duration: 6,
      y: Math.PI * 1.3 + Math.PI * 2,
      repeat: -1,
      ease: 'power3.inOut',
    })
  }, [])
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
