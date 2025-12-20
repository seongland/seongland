import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import NeonText from './NeonText'

const { PI, sin, cos } = Math

interface Props {
  text: string
  radius: number
  position?: [number, number, number]
}

const Letter: React.FC<{ l: string; i: number; count: number; radius: number }> = ({ l, i, count, radius }) => (
  <group rotation={[0, 0, 0]}>
    <NeonText
      hAlign="center"
      position={[radius * sin((i / count) * PI * 2), -0.8, radius * cos((i / count) * PI * 2)]}
      rotation={[0, (i / count) * PI * 2, 0]}
      i={i}>
      {l}
    </NeonText>
  </group>
)

const MagicRing: React.FC<Props> = ({ text, radius, ...props }) => {
  const ref = useRef<THREE.Group>(null!)
  const count = text.length

  useEffect(() => {
    gsap.to(ref.current.rotation, {
      duration: 6,
      y: PI * 1.3 + PI * 2,
      repeat: -1,
      ease: 'power3.inOut',
    })
  }, [])

  return (
    <group ref={ref} rotation={[0, PI * 1.3, 0]} scale={[-1, 1, 1]} {...props}>
      {text.split('').map((l, i) => (
        <Letter key={i} l={l} i={i} count={count} radius={radius} />
      ))}
    </group>
  )
}

export default MagicRing
