import React, { useMemo, useEffect } from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import useDarkMode from 'use-dark-mode'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { NextSeo } from 'next-seo'

import { ScrollSpace } from '@/components/organisms/ScrollSpace'
import { Footer } from '@/components/molecules/Footer'
import { bgColor, title } from '~/site-config'

const DARK_CLASS = 'dark'
const LIGHT_CLASS = 'light'

export const ScrollPage: React.FC<{ height: number; damping?: number; children: React.ReactNode }> = ({
  height,
  damping = 5,
  children,
}) => {
  // Theme
  const darkMode = useDarkMode(false, {
    classNameDark: DARK_CLASS,
    classNameLight: LIGHT_CLASS,
    onChange: isDark => {
      if (isDark) {
        document.documentElement.classList.remove(LIGHT_CLASS)
        document.documentElement.classList.add(DARK_CLASS)
      } else {
        document.documentElement.classList.remove(DARK_CLASS)
        document.documentElement.classList.add(LIGHT_CLASS)
      }
    },
  })
  const themeColor = useMemo(() => (darkMode.value ? bgColor.dark : bgColor.light), [darkMode])
  useEffect(() => {
    document.body.style.background = themeColor
  }, [themeColor])
  useScroll()

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[DARK_CLASS]} />
        <meta name="msapplication-TileColor" content={bgColor[DARK_CLASS]} />
      </Head>
      <NextSeo title={title} titleTemplate="%s" />
      <Canvas>
        <ScrollControls damping={damping} pages={height}>
          <Scroll>
            <ScrollSpace isDarkMode={darkMode.value} />
          </Scroll>
          <Scroll html>
            <div text="dark:white"> {children}</div>
          </Scroll>
        </ScrollControls>
      </Canvas>
      <div className="fixed bottom-0 <sm:left-20vw" w="full <sm:60vw">
        <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}
