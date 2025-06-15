import * as THREE from 'three'
import React, { useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'

// Portal-shader from user provided snippet
const PortalMaterial = shaderMaterial(
  { uTime: 0, uColorStart: new THREE.Color(10, 5, 1), uColorEnd: new THREE.Color('#334') },
  glsl`
  varying vec2 vUv;
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
  }
  `,
  glsl`
  #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying vec2 vUv;
  void main() {
    vec2 displacedUv = vUv + cnoise3(vec3(vUv * 10.0, uTime * 0.1));
    float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
    float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
    strength += outerGlow;
    strength += step(-0.2, strength) * 0.8;
    strength = clamp(strength, 0.0, 1.0);
    vec3 color = mix(uColorStart, uColorEnd, strength);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
  `
)

extend({ PortalMaterial })

export const GalaxyShader: React.FC<JSX.IntrinsicElements['mesh']> = props => {
  const ref = useRef<any>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.uTime += delta
  })
  return (
    <mesh {...props}>
      <sphereGeometry args={[1000, 64, 64]} />
      {/* @ts-ignore */}
      <portalMaterial ref={ref} side={THREE.BackSide} />
    </mesh>
  )
}

export default GalaxyShader
