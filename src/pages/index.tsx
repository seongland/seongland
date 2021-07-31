import * as React from 'react'
import { NextSeo } from 'next-seo'
import useDarkMode from 'use-dark-mode'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useSpring, a, SpringValue } from '@react-spring/three'

import { Footer } from '@/components/Footer'
import siteConfig from '~/site-config'
import type { NextPage } from '@/types/next'


const HomePage: NextPage = () => {
  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })
  const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
  const onMouseMove = React.useCallback(
    ({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  )
  const onScroll = React.useCallback(e => set({ top: e.target.scrollTop }), [])
  return (
    <>
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <Canvas style={{position: 'absolute', top: 0}}>
        <Scene top={top} mouse={mouse} />
      </Canvas>
      <div style={{
          position: "absolute",
          overflow: "auto",
          top: "0",
          width: "100%",
          height: "100vh",
          fontSize: "20em",
          fontWeight: 800
      }} onScroll={onScroll} onMouseMove={onMouseMove}>
        <div style={{ height: '525vh' }} />
      </div>
      <div style={{position: 'fixed'}}>
      <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}

/** This renders text via canvas and projects it as a sprite */
function Text({ children, position, opacity, color = 'white', fontSize = 410 }) {
  const {
    size: { width, height },
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree()
  const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
  const canvas = React.useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 2048
    const context = canvas.getContext('2d')
    context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = color
    context.fillText(children, 1024, 1024 - 410 / 2)
    return canvas
  }, [children, width, height])
  return (
    <a.sprite scale={[scale, scale, 1]} position={position}>
      <a.spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} premultiplyAlpha />
      </a.spriteMaterial>
    </a.sprite>
  )
}

/** This component creates a fullscreen colored plane */
function Background({ color }) {
  const { viewport } = useThree()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}

/** This component rotates a bunch of stars */
function Stars({ position }) {
  let group = React.useRef(null)
  let theta = 0
  const rFactor = 0.01
  const sFactor = 100
  useFrame(() => {
    const r = 5 * Math.sin(THREE.MathUtils.degToRad((theta += rFactor)))
    const s = Math.cos(THREE.MathUtils.degToRad(theta * sFactor))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
  })
  const [geo, mat, coords] = React.useMemo(() => {
    const width = 1
    const segments= 20
    const spread = 400
    const stars =1000
    const color =  0xffffff
    const geo = new THREE.SphereBufferGeometry(width, segments, segments)
    const mat = new THREE.MeshBasicMaterial({ color })
    const coords = Array.from({ length: stars }).map(() => [
      Math.random() * spread * 2 - spread,
      Math.random() * spread * 2 - spread,
      Math.random() * spread * 2 - spread,
    ])
    return [geo, mat, coords]
  }, [])
  return (
    <a.group ref={group} position={position}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </a.group>
  )
}

/** This component maintains the scene */
function Scene({ top, mouse }: { top: SpringValue<number>; mouse: SpringValue<number[]> }) {
  const { size } = useThree()
  const scrollMax = size.height * 4.5
  return (
    <>
      <a.spotLight intensity={1.2} color="white" position={mouse.to((x, y) => [x / 100, -y / 100, 6.5])} />
      <Background
        color={top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], ['#23262a', '#424242', '#232424', '#000'])}
      />
      <Stars position={top.to(top => [0, -1 + top / 20, 0])} />
      <Text opacity={top.to([0, 200], [1, 0])} position={top.to(top => [0, -1 + top / 200, 0])} fontSize={150}>
        {siteConfig.title}
      </Text>
      <Text opacity={1} position={top.to(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])} color="white" fontSize={100}>
        Explore
      </Text>
    </>
  )
}

export default HomePage
