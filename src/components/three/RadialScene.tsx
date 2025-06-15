import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

const inter = import('@pmndrs/assets/fonts/inter_regular.woff')

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
  const [hovered, hover] = useState<number | null>(null)
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y = -scroll.offset * (Math.PI * 2)
    state.events.update()
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return (
    <group ref={ref} {...props}>
      <Cards from={0} len={Math.PI * 2} onPointerOver={hover} onPointerOut={hover} />
      <ActiveCard hovered={hovered} />
    </group>
  )
}

type CardsProps = JSX.IntrinsicElements['group'] & {
  from?: number
  len?: number
  radius?: number
  onPointerOver: (index: number | null) => void
  onPointerOut: (index: number | null) => void
}

function Cards({ from = 0, len = Math.PI * 2, radius = 5.25, onPointerOver, onPointerOut, ...props }: CardsProps) {
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
              onPointerOver(i)
            }}
            onPointerOut={() => {
              hover(null)
              onPointerOut(null)
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
      easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta)
      easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta)
    }
  })
  return (
    <group {...props}>
      <Image ref={ref} transparent radius={0.075} url={url} scale={[1.618, 1, 1]} side={THREE.DoubleSide} />
    </group>
  )
}

type ActiveCardProps = JSX.IntrinsicElements['group'] & {
  hovered: number | null
}

function ActiveCard({ hovered, ...props }: ActiveCardProps) {
  const ref = useRef<THREE.Mesh>(null)
  const name = useMemo(() => generateWords(2).join(' '), [hovered])
  useLayoutEffect(() => {
    if (ref.current) ref.current.material.zoom = 0.8
  }, [hovered])
  useFrame((state, delta) => {
    if (!ref.current) return
    easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
    easing.damp(ref.current.material, 'opacity', hovered !== null, 0.3, delta)
  })
  const url = hovered !== null ? IMAGES[hovered % IMAGES.length] : IMAGES[0]
  return (
    <Billboard {...props}>
      <Text font={inter as any} fontSize={0.5} position={[2.15, 3.85, 0]} anchorX="left" color="black">
        {hovered !== null && `${name}\n${hovered}`}
      </Text>
      <Image ref={ref} transparent radius={0.3} position={[0, 1.5, 0]} scale={[3.5, 1.618 * 3.5, 0.2]} url={url} />
    </Billboard>
  )
}

export default RadialScene
