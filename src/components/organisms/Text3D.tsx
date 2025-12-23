import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, useLayoutEffect } from 'react'
import { useLoader, type ThreeElements } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap'

// Extend THREE namespace for textGeometry
declare module 'three' {
  interface BufferGeometry {
    boundingBox: THREE.Box3 | null
  }
}

interface Text3DProps {
  children: string
  vAlign?: 'center' | 'top' | 'bottom'
  hAlign?: 'center' | 'left' | 'right'
  size?: number
  color?: string
  i?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Text3D({
  children,
  vAlign = 'center',
  hAlign = 'center',
  size = 10,
  color = '#f7b77e',
  i = 0,
  ...props
}: Text3DProps & Omit<ThreeElements['group'], 'children'>) {
  const font = useLoader(FontLoader, '/bold.blob')
  const config = useMemo(
    () => ({
      font,
      size,
      height: 2,
      curveSegments: 30,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelOffset: 0.1,
      bevelSegments: 30,
    }),
    [font, size],
  )
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)

  useLayoutEffect(() => {
    const self = mesh.current
    if (!self) return
    const sizeVec = new THREE.Vector3()
    const geo = self.geometry as THREE.BufferGeometry
    geo.computeBoundingBox()
    if (geo.boundingBox) {
      geo.boundingBox.getSize(sizeVec)
      self.position.x = hAlign === 'center' ? -sizeVec.x / 2 : hAlign === 'right' ? 0 : -sizeVec.x
      self.position.y = vAlign === 'center' ? -sizeVec.y / 2 : vAlign === 'top' ? 0 : -sizeVec.y
    }
  }, [children, hAlign, vAlign])

  useEffect(() => {
    if (!mesh.current || !group.current) return
    const baseDelay = 1.5 + i * 0.1
    const rotationTween = gsap.to(mesh.current.rotation, {
      duration: 1.4,
      ease: 'power3.inOut',
      delay: baseDelay,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
      x: Math.PI * 0.5,
    })
    const floatTween = gsap.to(group.current.position, {
      duration: 1.4,
      ease: 'power3.inOut',
      delay: baseDelay,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.6,
      y: 1.8,
    })
    return () => {
      rotationTween.kill()
      floatTween.kill()
    }
  }, [i])

  return (
    <group {...props} ref={group}>
      <mesh ref={mesh}>
        {/* @ts-expect-error - textGeometry is extended */}
        <textGeometry args={[children, config]} />
        <meshStandardMaterial metalness={0.2} roughness={0.3} color={color} />
      </mesh>
    </group>
  )
}

export default Text3D
