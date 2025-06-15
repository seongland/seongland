import React, { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const StarfieldMaterial = shaderMaterial(
  { uTime: 0 },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform float uTime;
  varying vec2 vUv;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    float n = random(vUv * 100.0 + uTime * 0.1);
    float star = step(0.996, n);
    gl_FragColor = vec4(vec3(star), star);
  }
  `,
)

extend({ StarfieldMaterial })

export const GalaxyShader: React.FC<JSX.IntrinsicElements['mesh']> = props => {
  const material = useRef<any>()
  useFrame((_, delta) => {
    if (material.current) material.current.uTime += delta
  })
  return (
    <mesh {...props}>
      <sphereGeometry args={[50, 32, 32]} />
      {/* @ts-ignore */}
      <starfieldMaterial ref={material} key={StarfieldMaterial.key} side={THREE.BackSide} />
    </mesh>
  )
}

export default GalaxyShader
