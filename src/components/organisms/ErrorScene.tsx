import * as THREE from 'three'
import React, { useRef } from 'react'
import { Canvas, extend, useFrame, type ThreeElements } from '@react-three/fiber'
import { CameraControls, Environment, Lightformer, MeshTransmissionMaterial, shaderMaterial } from '@react-three/drei'

export const ErrorScene: React.FC = () => {
  const background = true
  const blur = 0
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
        {/* Lightformer to illuminate the environment */}
        <Lightformer position={[20, 0, 10]} scale={[1, 1000, 1]} intensity={100} />
      </Environment>
      <CameraControls />
    </Canvas>
  )
}

type PortalMaterialType = THREE.ShaderMaterial & { uTime: number }

function Shader(props: ThreeElements['mesh']) {
  const ref = useRef<PortalMaterialType | null>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.uTime += delta
  })
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* @ts-expect-error - Custom shader material extended via extend() */}
      <portalMaterial ref={ref} key={PortalMaterial.key} uColorStart={[10, 5, 1]} uColorEnd="#334" side={THREE.BackSide} />
    </mesh>
  )
}

const PortalMaterial = shaderMaterial(
  { uTime: 0, uColorStart: new THREE.Color('hotpink'), uColorEnd: new THREE.Color('white') },
  `
  varying vec2 vUv;
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
  }
  `,
  `
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying vec2 vUv;

  // Simple noise function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 displacedUv = vUv + vec2(noise(vec2(vUv.x * 10.0 + uTime * 0.1, vUv.y * 10.0)), noise(vec2(vUv.y * 10.0, vUv.x * 10.0 + uTime * 0.1))) * 0.1;
    float strength = noise(displacedUv * 5.0 + uTime * 0.2);
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
extend({ PortalMaterial })

