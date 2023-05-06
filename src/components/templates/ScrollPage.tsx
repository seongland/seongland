import React from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'

import { ScrollSpace } from '@/components/organisms/ScrollSpace'
import { Footer } from '@/components/molecules/Footer'
import { bgColor } from '~/site-config'
import { useThemes } from '@/hooks/useApp'

const DARK_CLASS = 'dark'

export const ScrollPage: React.FC<{ height: number; damping?: number; children: React.ReactNode }> = ({
  height,
  damping = 5,
  children,
}) => {
  // Theme
  useThemes()
  useScroll()

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[DARK_CLASS]} />
        <meta name="msapplication-TileColor" content={bgColor[DARK_CLASS]} />
      </Head>
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
      <div className="fixed bottom-0 <sm:left-20vw" w="full <sm:60vw">
        <Footer />
      </div>
    </>
  )
}
