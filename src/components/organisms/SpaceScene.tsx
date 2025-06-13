import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import type { Card } from '~/scripts/cards'
import FancyStars from './FancyStars'
import Pavement from './Pavement'
import CardRing from './CardRing'
import PortalMesh from './PortalMesh'

const SpaceScene: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const text = cards.map(c => c.title).join(' ')
  return (
    <Canvas camera={{ fov: 35, position: [0, 5, 15] }}>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <FancyStars />
        <Pavement />
        <PortalMesh />
        <Environment preset="sunset" />
        <CardRing text={text.toUpperCase()} radius={5} position={[0, 1, 0]} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default SpaceScene
