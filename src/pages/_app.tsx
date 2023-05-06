import React from 'react'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'
import { ThemeProvider } from 'next-themes'

import { GA4 } from '@/components/atoms/GA4'
import { Analytics } from '@vercel/analytics/react'

import 'windi.css'

import '@/styles/global.css'
import '@/styles/nprogress.css'

import type { AppProps } from 'next/app'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App(props: AppProps) {
  const { Component, pageProps } = props
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/seongland.png" />
        <meta property="fb:app_id" content="419108182355029" />
      </Head>

      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      {process.env.NEXT_PUBLIC_VERCEL_URL ? <Analytics /> : <></>}
      {process.env.NEXT_PUBLIC_VERCEL_URL ? <GA4 id="G-9T961HYDTR" /> : <></>}
    </>
  )
}

export default App
