import React from 'react'
import { Sparkles } from '@react-three/drei'

export const GalaxyShader: React.FC<JSX.IntrinsicElements['group']> = props => (
  <group {...props}>
    <Sparkles count={1500} scale={[100, 100, 100]} size={2} speed={0.4} color="#b0c6ff" />
  </group>
)

export default GalaxyShader
