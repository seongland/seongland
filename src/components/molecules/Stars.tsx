import React, { useRef, useMemo, useEffect } from 'react'
import { MathUtils, SphereBufferGeometry, MeshBasicMaterial } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import { useSpring } from '@react-spring/three'

import type { Interpolation } from '@react-spring/three'
import type { GroupProps } from '@react-three/fiber'

const DARK = 0x242424
const LIGHT = 0xffffff

/** This component rotates a bunch of stars */
export const Stars: React.FC<{
  position: Interpolation
  isDarkMode: boolean
  theta?: number
  diff?: number
  cycle?: number
  spread?: number
  stars?: number
  segments?: number
  radius?: { star: number; galaxy: number }
}> = ({
  position,
  isDarkMode,
  theta = 90,
  cycle = 10,
  diff = 0.1,
  spread = 400,
  stars = 500,
  segments = 5,
  radius = { star: 1, galaxy: 5 },
}) => {
  const color = isDarkMode ? LIGHT : DARK
  const group = useRef<GroupProps>(null)
  const camera = useThree(state => state.camera)

  // create stars
  const [geo, mat, coords] = useMemo(() => {
    const geo = new SphereBufferGeometry(radius.star, segments, segments)
    const mat = new MeshBasicMaterial({ color })
    const coords = Array.from({ length: stars }).map(() => [
      Math.random() * spread * 2 - spread,
      Math.random() * spread * 2 - spread,
      Math.random() * spread * 2 - spread,
    ])
    return [geo, mat, coords]
  }, [color, spread, stars, radius.star, segments])

  // Mouse
  const [, set] = useSpring(() => ({
    mouse: [0, 0],
    onChange({ value }) {
      camera.position.set(-value.mouse[0] * 10, -value.mouse[1] * 3, camera.position.z)
    },
  }))
  useEffect(() => {
    window.addEventListener('touchmove', e => {
      const { clientX, clientY } = e.changedTouches[0]
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1
      set.start({ mouse: [x, y] })
    })
    window.addEventListener('mousemove', e => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1
      set.start({ mouse: [x, y] })
    })
  }, [set])

  // update
  useFrame(() => {
    const r = radius.galaxy * Math.sin(MathUtils.degToRad((theta += diff) / cycle))
    const s = Math.cos(MathUtils.degToRad(theta))
    // @ts-ignore
    group.current.rotation?.set(r, r, r)
    // @ts-ignore
    group.current.scale.set(s, s, s)
  })

  return (
    <a.group ref={group} position={position}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </a.group>
  )
}
