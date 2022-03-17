import React, { useMemo, useEffect } from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import useDarkMode from 'use-dark-mode'
import { ScrollControls, Scroll } from '@react-three/drei'
import { NextSeo } from 'next-seo'

import Title from '@/components/atoms/Title'
import Activities from '@/components/organisms/Activities'
import SmallProjects from '@/components/organisms/SmallProjects'
import BigProjects from '@/components/organisms/BigProjects'
import ScrollSpace from '@/components/organisms/ScrollSpace'
import Footer from '@/components/molecules/Footer'

import { bgColor, title } from '~/site-config'

const DARK_CLASS = 'dark'
const LIGHT_CLASS = 'light'

export const ScrollPage = () => {
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

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[DARK_CLASS]} />
        <meta name="msapplication-TileColor" content={bgColor[DARK_CLASS]} />
      </Head>
      <NextSeo title={title} titleTemplate="%s" />
      <Canvas>
        <ScrollControls damping={5} pages={5}>
          <Scroll>
            <ScrollSpace isDarkMode={darkMode.value} />
          </Scroll>
          <Scroll html>
            <div text="dark:white">
              <Title title={title} />
              <Activities title={title} />
              <SmallProjects title={title} />
              <BigProjects title={title} />
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
      <div className="absolute bottom-0" w="full">
        <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}
