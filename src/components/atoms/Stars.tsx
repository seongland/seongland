import React, { useRef, useMemo } from 'react'
import { MathUtils, SphereBufferGeometry, MeshBasicMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { a } from '@react-spring/three'

import type { Interpolation } from '@react-spring/three'
import type { GroupProps } from '@react-three/fiber'

/** This component rotates a bunch of stars */
export default function Stars({ position, isDarkMode }: { position: Interpolation; isDarkMode: boolean }) {
  const group = useRef<GroupProps>(null)
  let theta = 90
  const tDiff = 0.1
  const rFactor = 5
  const rSlow = 10
  useFrame(() => {
    const r = rFactor * Math.sin(MathUtils.degToRad((theta += tDiff) / rSlow))
    const s = Math.cos(MathUtils.degToRad(theta))
    // @ts-ignore
    group.current.rotation.set(r, r, r)
    // @ts-ignore
    group.current.scale.set(s, s, s)
  })
  const [geo, mat, coords] = useMemo(() => {
    const width = 1
    const segments = 20
    const spread = 400
    const stars = 1000
    const color = isDarkMode ? 0xffffff : 0x242424
    const geo = new SphereBufferGeometry(width, segments, segments)
    const mat = new MeshBasicMaterial({ color })
    const coords = Array.from({ length: stars }).map(() => [
      Math.random() * spread * 2 - spread,
      Math.random() * spread * 2 - spread,
      Math.random() * spread * 2 - spread,
    ])
    return [geo, mat, coords]
  }, [isDarkMode])
  return (
    <a.group ref={group} position={position}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </a.group>
  )
}
