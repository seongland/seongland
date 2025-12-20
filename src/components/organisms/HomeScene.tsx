import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import type { Card } from '~/scripts/cards'
import CardRing from './CardRing'
import Pavement from './Pavement'

const HomeScene: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const text = cards.map(c => c.title).join(' ')
  return (
    <Canvas camera={{ fov: 30, position: [0, 90, 180] }}>
      {/* background color */}
      <color attach="background" args={['#ebcfba']} />
      <directionalLight position={[-40, 20, 20]} color="#c59cf1" />
      <directionalLight position={[10.5, 20, 10]} intensity={1.5} color="#e78f48" />
      <ambientLight color="#8d69cb" />
      <Suspense fallback={null}>
        <Pavement />
        <Environment preset="night" />
        <CardRing text={text.toUpperCase()} radius={25} position={[0, 0, 0]} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default HomeScene
