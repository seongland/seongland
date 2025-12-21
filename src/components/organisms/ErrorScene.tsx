import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import {
  CameraControls,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  shaderMaterial,
  Float,
  Stars,
} from '@react-three/drei'

// Portal shader material for animated background
const PortalMaterial = shaderMaterial(
  { uTime: 0, uColorStart: new THREE.Color('hotpink'), uColorEnd: new THREE.Color('white') },
  // Vertex shader
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
  // Fragment shader with inline noise
  `
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying vec2 vUv;

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
    vec2 displacedUv = vUv + vec2(
      noise(vec2(vUv.x * 10.0 + uTime * 0.1, vUv.y * 10.0)),
      noise(vec2(vUv.y * 10.0, vUv.x * 10.0 + uTime * 0.1))
    ) * 0.1;
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

type PortalMaterialType = THREE.ShaderMaterial & { uTime: number }

// Animated shader background sphere
function ShaderSphere({ scale = 1000 }: { scale?: number }) {
  const ref = useRef<PortalMaterialType>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.uTime += delta
  })
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* @ts-expect-error - Custom shader material */}
      <portalMaterial ref={ref} uColorStart={[10, 5, 1]} uColorEnd="#334" side={THREE.BackSide} />
    </mesh>
  )
}

// Floating glass sphere with transmission material
function GlassSphere({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position}>
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
    </Float>
  )
}

// Metallic sphere
function MetalSphere({ position, roughness = 0 }: { position: [number, number, number]; roughness?: number }) {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial metalness={1} roughness={roughness} color="black" />
      </mesh>
    </Float>
  )
}

// Rotating torus knot
function TorusKnot() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(state => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <torusKnotGeometry args={[2, 0.5, 128, 32]} />
      <meshStandardMaterial color="#8844aa" metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

export const ErrorScene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <color attach="background" args={['#112']} />
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <GlassSphere position={[0, 1.2, 0]} />
        <MetalSphere position={[-2, -1, 0]} roughness={0} />
        <MetalSphere position={[2, -1, 0]} roughness={0.45} />
        <TorusKnot />

        <Environment resolution={1024} frames={Infinity} background blur={0}>
          <ShaderSphere />
          <Lightformer position={[20, 0, 10]} scale={[1, 1000, 1]} intensity={100} />
        </Environment>
      </Suspense>
      <CameraControls />
    </Canvas>
  )
}

export default ErrorScene
