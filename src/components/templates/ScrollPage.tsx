import React, { useMemo, useEffect } from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import useDarkMode from 'use-dark-mode'
import { ScrollControls, Scroll } from '@react-three/drei'
import { NextSeo } from 'next-seo'

import TypeTitle from '@/components/atoms/TypeTitle'
import PageTitle from '@/components/atoms/PageTitle'
import CenterPage from '@/components/atoms/CenterPage'
import Activities from '@/components/organisms/Activities'
import SmallProjects from '@/components/organisms/SmallProjects'
import BigProjects from '@/components/organisms/BigProjects'
import ScrollSpace from '@/components/organisms/ScrollSpace'
import Footer from '@/components/molecules/Footer'

import { bgColor, title } from '~/site-config'

const DARK_CLASS = 'dark'
const LIGHT_CLASS = 'light'
const HEIGHT = 5
const PAGE = 4

export const ScrollPage = () => {
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

  // Pages
  const pageStart: (page: number) => string = page => {
    const first = 0
    const last = (HEIGHT - 1) * 100
    return `${((last - first) / (PAGE - 1)) * (page - 1)}vh`
  }

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgColor[DARK_CLASS]} />
        <meta name="msapplication-TileColor" content={bgColor[DARK_CLASS]} />
      </Head>
      <NextSeo title={title} titleTemplate="%s" />
      <Canvas>
        <ScrollControls damping={HEIGHT} pages={HEIGHT}>
          <Scroll>
            <ScrollSpace isDarkMode={darkMode.value} />
          </Scroll>
          <Scroll html>
            <div text="dark:white">
              <CenterPage top={pageStart(1)}>
                <TypeTitle />
              </CenterPage>
              <CenterPage top={pageStart(2)}>
                <PageTitle title="Big Project" />
                <BigProjects />
              </CenterPage>
              <CenterPage top={pageStart(3)}>
                <PageTitle title="Small Project" />
                <SmallProjects />
              </CenterPage>
              <CenterPage top={pageStart(4)}>
                <PageTitle title="Activities" />
                <Activities />
              </CenterPage>
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
