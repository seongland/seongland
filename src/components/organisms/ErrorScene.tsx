import * as THREE from 'three'
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Environment, Lightformer, MeshTransmissionMaterial, shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import glsl from 'babel-plugin-glsl/macro'

export const ErrorScene: React.FC = () => {
  const { background, blur } = useControls({ background: true, blur: { value: 0, min: 0, max: 1 } })
  return (
    <Canvas>
      <color attach="background" args={['#223']} />
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={2}
          anisotropicBlur={2}
          chromaticAberration={0.2}
          envMapIntensity={0.1}
          thickness={0.1}
          distortionScale={0.1}
          distortion={2}
          temporalDistortion={0.2}
        />
      </mesh>
      <mesh position={[-1.2, -1.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial metalness={0} roughness={0} color="black" />
      </mesh>
      <mesh position={[1.2, -1.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial metalness={0} roughness={0.45} color="black" />
      </mesh>
      <Environment resolution={1024} frames={Infinity} background={background} blur={blur}>
        <Shader scale={1000} />
        <Lightformer position={[20, 0, 10]} scale={[1, 1000, 1]} intensity={100} onCreated={self => self.lookAt(0, 0, 0)} />
      </Environment>
      <CameraControls />
    </Canvas>
  )
}

function Shader(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<any>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.uTime += delta
  })
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* @ts-ignore */}
      <portalMaterial ref={ref} key={PortalMaterial.key} uColorStart={[10, 5, 1]} uColorEnd="#334" side={THREE.BackSide} />
    </mesh>
  )
}

const PortalMaterial = shaderMaterial(
  { uTime: 0, uColorStart: new THREE.Color('hotpink'), uColorEnd: new THREE.Color('white') },
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
  `,
)
// @ts-ignore
import { extend } from '@react-three/fiber'
extend({ PortalMaterial })
