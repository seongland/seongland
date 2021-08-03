import React, { useCallback, useMemo, useRef } from 'react'
import { NextSeo } from 'next-seo'
import useDarkMode from 'use-dark-mode'
import { MathUtils, SphereBufferGeometry, MeshBasicMaterial, Object3D } from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useSpring, a, SpringValue } from '@react-spring/three'
import { Text } from '@react-three/drei'

import { Footer } from '@/components/molecules/Footer'
import siteConfig from '~/site-config'
import type { NextPage } from '@/types/next'
import { useStore } from '@/store/'

import styles from './index.module.css'

const HomePage: NextPage = () => {
  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })
  const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))

  return (
    <>
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <ViewPort set={set} />
      <Canvas className={styles.canvas}>
        <Scene set={set} top={top} mouse={mouse} isDarkMode={darkMode.value} />
      </Canvas>
      <div className={styles.footer}>
        <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}

function ViewPort({ set }) {
  // Event
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  )
  const onScroll = useCallback(e => set({ top: e.target.scrollTop }), [])

  // Click Intersection
  const click = useStore(state => state.click)
  const onClick = useCallback(e => click(e), [click])
  return (
    <div className={styles.viewport} onScroll={onScroll} onClick={onClick} onMouseMove={onMouseMove}>
      <div className={styles.parallax} />
    </div>
  )
}

/** This renders text via canvas and projects it as a sprite */
function SpringText({ children, position, color = 'white', fontSize = 400, onClick = null }) {
  const text = useRef(null)

  return (
    <a.mesh position={position}>
      <Text
        ref={text}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        color={color}
        userData={{ click: onClick }}
        anchorY={-1.3}
        fontSize={fontSize / 100}
      >
        {children}
      </Text>
    </a.mesh>
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
function Stars({ position, isDarkMode }: { position: any; isDarkMode: boolean }) {
  let group = useRef(null)
  let theta = 90
  const tDiff = 0.1
  const rFactor = 5
  const rSlow = 10
  useFrame(() => {
    const r = rFactor * Math.sin(MathUtils.degToRad((theta += tDiff) / rSlow))
    const s = Math.cos(MathUtils.degToRad(theta))
    group.current.rotation.set(r, r, r)
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

/** This component maintains the scene */
function Scene({
  top,
  isDarkMode,
  mouse,
  set,
}: {
  top: SpringValue<number>
  mouse: SpringValue<number[]>
  isDarkMode: boolean
  set: Function
}) {
  const colorSet = isDarkMode ? ['#23262a', '#424242', '#232424', '#000'] : ['#fff', '#fff', '#fff', '#fff']
  const { size } = useThree()
  const scrollMax = size.height * 4.5
  const color = isDarkMode ? 'white' : 'black'
  const root = useRef(null)
  return (
    <>
      <Background color={top.to([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], colorSet)} />
      <Stars isDarkMode={isDarkMode} position={top.to(top => [0, -1 + top / 20, 0])} />

      <group ref={root}>
        <SpringText position={top.to(top => [0, -1 + top / 200, 0])} fontSize={50} color={color}>
          {siteConfig.title}
        </SpringText>
        <SpringText
          onClick={() => (location.href = '/wiki')}
          position={top.to(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])}
          color={color}
          fontSize={50}
        >
          Explore
        </SpringText>
      </group>

      <Intersector set={set} mouse={mouse} root={root.current} />
    </>
  )
}

function Intersector({ mouse, root, set }: { mouse: SpringValue<number[]>; root: Object3D; set: Function }) {
  const { raycaster } = useThree()
  const setClick = useStore(state => state.setClick)

  useFrame(({ camera }) => {
    const coords = {
      x: mouse.animation.fromValues[0] / window.innerWidth,
      y: mouse.animation.fromValues[1] / window.innerHeight,
    }
    setClick(e => {
      const { x, y } = { x: e.clientX, y: e.clientY }
      const mouse = [x - window.innerWidth / 2, y - window.innerHeight / 2]
      set({ mouse })
      const coords = {
        x: mouse[0] / window.innerWidth,
        y: mouse[1] / window.innerHeight,
      }
      raycaster.setFromCamera(coords, camera)
      const intersect = raycaster.intersectObject(root, true)[0]?.object
      if (intersect?.userData?.click) intersect?.userData?.click(e)
    })
    raycaster.setFromCamera(coords, camera)
    const intersect = raycaster.intersectObject(root, true)[0]?.object
    if (intersect?.userData?.click) document.body.style.cursor = 'pointer'
    else document.body.style.cursor = 'default'
  })
  return <></>
}

export default HomePage
