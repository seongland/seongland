import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import AnimatedText from './AnimatedText'

const { PI, sin, cos } = Math

interface Props {
  text: string
  radius: number
  position?: [number, number, number]
}

const Letter: React.FC<{ l: string; i: number; count: number; radius: number }> = ({ l, i, count, radius }) => {
  return (
    <group rotation={[0, 0, 0]}>
      <AnimatedText
        hAlign="center"
        position={[radius * sin((i / count) * PI * 2), -0.8, radius * cos((i / count) * PI * 2)]}
        rotation={[0, (i / count) * PI * 2, 0]}
        i={i}>
        {l}
      </AnimatedText>
    </group>
  )
}

const CardRing: React.FC<Props> = ({ text, radius, ...props }) => {
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

export default CardRing
