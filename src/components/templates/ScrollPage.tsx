import React from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'

import { ScrollSpace } from '@/components/organisms/ScrollSpace'
import { bgColor } from '~/site-config'
import { useThemes } from '@/hooks/useApp'

export const ScrollPage: React.FC<{
  height: number
  damping?: number
  children: React.ReactNode
  three?: React.ReactNode
}> = ({ height, damping = 0.5, children, three }) => {
  // Theme
  const { theme } = useThemes()
  useScroll()

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[theme]} />
      </Head>
      <Canvas>
        <ScrollControls damping={damping} pages={height}>
          <Scroll>
            {three}
            <ScrollSpace />
          </Scroll>
          <Scroll html>
            <div text="dark:white"> {children}</div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  )
}

export default ScrollPage
