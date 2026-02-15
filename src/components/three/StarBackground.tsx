import { Canvas } from '@react-three/fiber'
import Stars from './Stars'

export default function StarBackground() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: -1, pointerEvents: 'none',
    }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 75 }} style={{ background: 'transparent' }}>
        <Stars />
      </Canvas>
    </div>
  )
}
