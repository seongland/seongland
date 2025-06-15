import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei'

function damp(value: number, target: number, lambda: number, dt: number) {
  return value + (target - value) * (1 - Math.exp(-lambda * dt))
}

function damp3(vec: THREE.Vector3, target: [number, number, number], lambda: number, dt: number) {
  vec.x = damp(vec.x, target[0], lambda, dt)
  vec.y = damp(vec.y, target[1], lambda, dt)
  vec.z = damp(vec.z, target[2], lambda, dt)
}

const inter = 'https://raw.githubusercontent.com/pmndrs/assets/master/fonts/inter_regular.woff'

const IMAGES = [
  '/image/angryface.png',
  '/image/emgsd.png',
  '/image/faithful.png',
  '/image/legacy.png',
  '/image/libvuln.png',
  '/image/mbtigpt.png',
  '/image/pointland.jpg',
  '/image/resrer.png',
  '/image/rtsum.png',
  '/image/saedataset.png',
]

function generateWords(count: number) {
  const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']
  const result = []
  for (let i = 0; i < count; i++) result.push(words[Math.floor(Math.random() * words.length)])
  return result
}

export const RadialScene: React.FC = () => (
  <Canvas dpr={[1, 1.5]}>
    <ScrollControls pages={4} infinite>
      <Scene position={[0, 1.5, 0]} />
    </ScrollControls>
  </Canvas>
)

function Scene(props: JSX.IntrinsicElements['group']) {
  const ref = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const [hovered, setHovered] = useState<number | null>(null)
  const handleHover = (index: number | null) => setHovered(index)
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y = -scroll.offset * (Math.PI * 2)
    state.events.update?.()
    damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return (
    <group ref={ref} {...props}>
      <Cards from={0} len={Math.PI * 2} onChange={handleHover} />
      <ActiveCard hovered={hovered} />
    </group>
  )
}

type CardsProps = JSX.IntrinsicElements['group'] & {
  from?: number
  len?: number
  radius?: number
  onChange: (index: number | null) => void
}

function Cards({ from = 0, len = Math.PI * 2, radius = 5.25, onChange, ...props }: CardsProps) {
  const [hovered, hover] = useState<number | null>(null)
  const amount = Math.round(len * 22)
  return (
    <group {...props}>
      {Array.from({ length: amount - 3 }, (_, i) => {
        const angle = from + (i / amount) * len
        const url = IMAGES[i % IMAGES.length]
        return (
          <Card
            key={angle}
            onPointerOver={e => {
              e.stopPropagation()
              hover(i)
              onChange(i)
            }}
            onPointerOut={() => {
              hover(null)
              onChange(null)
            }}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            url={url}
          />
        )
      })}
    </group>
  )
}

type CardProps = JSX.IntrinsicElements['group'] & {
  url: string
  active: boolean
  hovered: boolean
}

function Card({ url, active, hovered, ...props }: CardProps) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1
    if (ref.current) {
      damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta)
      damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta)
    }
  })
  return (
    <group {...props}>
      <Image ref={ref} transparent radius={0.075} url={url} scale={[1.618, 1]} side={THREE.DoubleSide} />
    </group>
  )
}

type ActiveCardProps = JSX.IntrinsicElements['group'] & {
  hovered: number | null
}

function ActiveCard({ hovered, ...props }: ActiveCardProps) {
  const ref = useRef<THREE.Mesh>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const name = useMemo(() => generateWords(2).join(' '), [hovered])
  useLayoutEffect(() => {
    if (ref.current) (ref.current.material as any).zoom = 0.8
  }, [hovered])
  useFrame((state, delta) => {
    if (!ref.current) return
    const mat = ref.current.material as any
    mat.zoom = damp(mat.zoom, 1, 0.5, delta)
    mat.opacity = damp(mat.opacity, hovered !== null ? 1 : 0, 0.3, delta)
  })
  const url = hovered !== null ? IMAGES[hovered % IMAGES.length] : IMAGES[0]
  return (
    <Billboard {...props}>
      <Text font={inter} fontSize={0.5} position={[2.15, 3.85, 0]} anchorX="left" color="black">
        {hovered !== null && `${name}\n${hovered}`}
      </Text>
      <Image ref={ref} transparent radius={0.3} position={[0, 1.5, 0]} scale={[3.5, 1.618 * 3.5]} url={url} />
    </Billboard>
  )
}

export default RadialScene
