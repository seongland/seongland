import React, { useRef, useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap'

interface Props {
  children: string
  vAlign?: 'center' | 'top' | 'bottom'
  hAlign?: 'center' | 'left' | 'right'
  i?: number
  color?: string
  [key: string]: any
}

export default function NeonText({
  children,
  vAlign = 'center',
  hAlign = 'center',
  i = 0,
  color = '#f7b77e',
  ...props
}: Props) {
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
  const mesh = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    if (!mesh.current) return
    const sizeV = new THREE.Vector3()
    ;(mesh.current.geometry as TextGeometry).computeBoundingBox()
    ;(mesh.current.geometry as TextGeometry).boundingBox!.getSize(sizeV)
    mesh.current.position.x += hAlign === 'center' ? -sizeV.x / 2 : hAlign === 'right' ? 0 : -sizeV.x
    mesh.current.position.y += vAlign === 'center' ? -sizeV.y / 2 : vAlign === 'top' ? 0 : -sizeV.y

    gsap.defaults({
      duration: 1.4,
      ease: 'power3.inOut',
      delay: 1.5 + i * 0.1,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
    })
    gsap.to(mesh.current.rotation, {
      x: Math.PI * 0.5,
    })
    gsap.to(group.current.position, {
      y: 1.8,
    })
  }, [hAlign, vAlign, i])

  return (
    <group ref={group} {...props}>
      <mesh ref={mesh}>
        {/* @ts-ignore */}
        <textGeometry args={[children, config]} />
        <meshStandardMaterial metalness={0.2} roughness={0.3} color={color} />
      </mesh>
    </group>
  )
}
