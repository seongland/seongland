import React from 'react'
import { Stars } from '@react-three/drei'

const FancyStars: React.FC = () => {
  return <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
}

export default FancyStars
