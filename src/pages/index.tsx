import React from 'react'
import { NextSeo } from 'next-seo'
import useDarkMode from 'use-dark-mode'
import { Canvas } from '@react-three/fiber'
import { useSpring } from '@react-spring/three'

import Footer from '@/components/molecules/Footer'
import ViewPort from '@/components/atoms/ViewPort'
import SpaceScene from '@/components/molecules/SpaceScene'
import siteConfig from '~/site-config'
import type { NextPage } from '@/types/next'

import styles from './index.module.css'

const HomePage: NextPage = () => {
  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })
  const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))

  return (
    <>
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <ViewPort set={set} />
      <Canvas className={styles.canvas}>
        <SpaceScene set={set} top={top} mouse={mouse} isDarkMode={darkMode.value} />
      </Canvas>
      <div className={styles.footer}>
        <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}

export default HomePage
