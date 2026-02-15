import { useRef, useState, useMemo, useEffect } from 'react'
import { MathUtils, SphereGeometry, MeshBasicMaterial, Color } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'

function generateStarCoords(count: number, spread: number): number[][] {
  return Array.from({ length: count }).map(() => [
    Math.random() * spread * 2 - spread,
    Math.random() * spread * 2 - spread,
    Math.random() * spread * 2 - spread,
  ])
}

export default function Stars({
  count = 200,
  spread = 350,
  radius = { star: 1, galaxy: 5 },
  segments = 5,
  cycle = 10,
  diff = 0.1,
  color = 0xfefefe,
  scrollOffset = 0,
}: {
  count?: number
  spread?: number
  radius?: { star: number; galaxy: number }
  segments?: number
  cycle?: number
  diff?: number
  color?: number
  scrollOffset?: number
}) {
  const group = useRef<Group>(null)
  const thetaRef = useRef(90)
  const camera = useThree(state => state.camera)
  const [coords] = useState(() => generateStarCoords(count, spread))

  const geo = useMemo(() => new SphereGeometry(radius.star, segments, segments), [radius.star, segments])
  const mat = useMemo(() => new MeshBasicMaterial({ color }), [])

  // Update material color when prop changes
  useEffect(() => {
    mat.color = new Color(color)
  }, [color, mat])

  useEffect(() => {
    const onMove = (x: number, y: number) => {
      camera.position.x = -x * 25
      camera.position.y = -y * 3
    }
    const handleMouse = (e: MouseEvent) => {
      onMove((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    const handleTouch = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      onMove((t.clientX / window.innerWidth) * 2 - 1, -(t.clientY / window.innerHeight) * 2 + 1)
    }
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
    }
  }, [camera])

  useFrame(() => {
    thetaRef.current += diff
    const r = radius.galaxy * Math.sin(MathUtils.degToRad(thetaRef.current / cycle))
    const s = Math.cos(MathUtils.degToRad(thetaRef.current))
    if (group.current) {
      group.current.rotation.set(r, r, r)
      group.current.scale.set(s, s, s)
      // Parallax: shift star group Y position based on scroll
      group.current.position.y = scrollOffset * 0.05
    }
  })

  return (
    <group ref={group}>
      {coords.map(([x, y, z], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[x, y, z]} />
      ))}
    </group>
  )
}
