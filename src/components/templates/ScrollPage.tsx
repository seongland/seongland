import React from 'react'
import { Canvas } from '@react-three/fiber'
import useDarkMode from 'use-dark-mode'
import { ScrollControls, Scroll } from '@react-three/drei'
import { NextSeo } from 'next-seo'

import ScrollSpace from '@/components/molecules/ScrollSpace'
import Footer from '@/components/molecules/Footer'

import { PageHead } from '../organisms/PageHead'
import siteConfig from '~/site-config'

export const ScrollPage = () => {
  const darkMode = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
    onChange: isDark => {
      if (isDark) {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
    },
  })

  return (
    <>
      <PageHead />
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <Canvas>
        <ScrollControls damping={5} pages={5}>
          {/* @ts-ignore */}
          <Scroll>
            <ScrollSpace isDarkMode={darkMode.value} />
          </Scroll>
          {/* @ts-ignore */}
          <Scroll html>
            <div text="dark:white">
              <h1 style={{ position: 'absolute', top: '30vh', left: '50vw' }}>{siteConfig.title}</h1>
              <h1 style={{ position: 'absolute', top: '120vh', left: '60vw' }}>be</h1>
              <h1 style={{ position: 'absolute', top: '198.5vh', left: '0.5vw' }}>home</h1>
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
