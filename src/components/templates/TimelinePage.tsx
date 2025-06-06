import React from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'

import TimelineSpace from '@/components/organisms/TimelineSpace'
import { bgColor } from '~/site-config'
import { useThemes } from '@/hooks/useApp'

export const TimelinePage: React.FC<{ pages: number; children: React.ReactNode }> = ({ pages, children }) => {
  const { theme } = useThemes()

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[theme]} />
      </Head>
      <Canvas>
        <ScrollControls damping={0.5} pages={pages}>
          <Scroll>
            <TimelineSpace pages={pages} />
          </Scroll>
          <Scroll html>
            <div text="dark:white">{children}</div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  )
}

export default TimelinePage
