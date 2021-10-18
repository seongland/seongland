import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import useDarkMode from 'use-dark-mode'
import { ScrollControls, Scroll } from '@react-three/drei'
import { NextSeo } from 'next-seo'

import ScrollSpace from '@/components/molecules/ScrollSpace'
import Footer from '@/components/molecules/Footer'

import { PageHead } from '../organisms/PageHead'
import siteConfig from '~/site-config'
import styles from '../styles.module.css'

const DARK_FONT = 'white'
const LIGHT_FONT = 'black'

export const ScrollPage = () => {
  const darkMode = useDarkMode(false)
  const color = useMemo(() => (darkMode.value ? DARK_FONT : LIGHT_FONT), [darkMode])

  return (
    <>
      <PageHead />
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <Canvas>
        <ScrollControls damping={4} pages={5.25}>
          {/* @ts-ignore */}
          <Scroll>
            <ScrollSpace isDarkMode={darkMode.value} />
          </Scroll>
          {/* @ts-ignore */}
          <Scroll html>
            <h1 style={{ color, position: 'absolute', top: '30vh', left: '50vw' }}>{siteConfig.title}</h1>
            <h1 style={{ color, position: 'absolute', top: '120vh', left: '60vw' }}>be</h1>
            <h1 style={{ color, position: 'absolute', top: '198.5vh', left: '0.5vw' }}>home</h1>
          </Scroll>
        </ScrollControls>
      </Canvas>
      <div className={styles.footerWrapper}>
        <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}
