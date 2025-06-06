import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'

import { ScrollSpace } from '@/components/organisms/ScrollSpace'
import { bgColor } from '~/site-config'
import { useThemes } from '@/hooks/useApp'

export const ScrollPage: React.FC<{ height: number; damping?: number; children: React.ReactNode }> = ({
  height,
  damping = 0.5,
  children,
}) => {
  // Theme
  const { theme } = useThemes()
  useScroll()

  const [blur, setBlur] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setBlur(false), 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[theme]} />
      </Head>
      <div className={`transition duration-700 ${blur ? 'blur-sm' : ''}`}>
        <Canvas>
          <ScrollControls damping={damping} pages={height}>
            <Scroll>
              <ScrollSpace />
            </Scroll>
            <Scroll html>
              <div text="dark:white"> {children}</div>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </>
  )
}

export default ScrollPage
