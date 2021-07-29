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
      <Canvas className="canvas">
        <Scene top={top} mouse={mouse} />
      </Canvas>
      <div className="scroll-container" onScroll={onScroll} onMouseMove={onMouseMove}>
        <div style={{ height: '525vh' }} />
      </div>
      <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
    </>
  )
}

/** This component loads an image and projects it onto a plane */
function Image({ url, opacity, scale, ...props }) {
  const texture = React.useMemo(() => new THREE.TextureLoader().load(url), [url])
  return (
    <a.mesh {...props}>
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
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
  useFrame(() => {
    const r = 5 * Math.sin(THREE.MathUtils.degToRad((theta += 0.01)))
    const s = Math.cos(THREE.MathUtils.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
  })
  const [geo, mat, coords] = React.useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(1, 20, 20)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('peachpuff'), transparent: true })
    const coords = Array.from({ length: 1000 }).map(i => [
      Math.random() * 800 - 400,
      Math.random() * 800 - 400,
      Math.random() * 800 - 400,
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
