import React, { useRef, useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap'

interface Props {
  children: string
  vAlign?: 'center' | 'top' | 'bottom'
  hAlign?: 'center' | 'left' | 'right'
  i?: number
  [key: string]: any
}

export default function AnimatedText({ children, vAlign = 'center', hAlign = 'center', i = 0, ...props }: Props) {
  const font = useLoader(FontLoader, '/fonts/helvetiker_bold.typeface.json')
  const config = useMemo(
    () => ({
      font,
      size: 10,
      height: 2,
      curveSegments: 30,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelOffset: 0.1,
      bevelSegments: 30,
    }),
    [font],
  )
  const group = useRef<THREE.Group>(null!)
  const text = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    if (!text.current) return
    const sizeV = new THREE.Vector3()
    ;(text.current.geometry as TextGeometry).computeBoundingBox()
    ;(text.current.geometry as TextGeometry).boundingBox!.getSize(sizeV)
    text.current.position.x += hAlign === 'center' ? -sizeV.x / 2 : hAlign === 'right' ? 0 : -sizeV.x
    text.current.position.y += vAlign === 'center' ? -sizeV.y / 2 : vAlign === 'top' ? 0 : -sizeV.y

    gsap.defaults({
      duration: 1.4,
      ease: 'power3.inOut',
      delay: 1.5 + i * 0.1,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
    })
    gsap.to(text.current.rotation, {
      x: Math.PI * 0.5,
    })
    gsap.to(group.current.position, {
      y: 1.8,
    })
  }, [hAlign, vAlign, i])

  return (
    <group {...props} ref={group}>
      <mesh ref={text}>
        {/* @ts-ignore */}
        <textGeometry args={[children, config]} />
        <meshStandardMaterial metalness={0.2} roughness={0.3} color={'#f7b77e'} />
      </mesh>
    </group>
  )
}
