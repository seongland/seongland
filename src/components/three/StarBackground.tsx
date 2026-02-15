import { Canvas } from '@react-three/fiber'
import Stars from './Stars'

export default function StarBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 75 }} style={{ background: '#111418' }}>
        <Stars />
      </Canvas>
    </div>
  )
}
