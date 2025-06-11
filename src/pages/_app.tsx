import React from 'react'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'
import { ThemeProvider } from 'next-themes'

import 'windi.css'

import '@/styles/global.css'
import '@/styles/card.css'
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
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          connect-src 'self';
          style-src 'self' 'unsafe-hashes' 'unsafe-inline';
          img-src * data: blob: 'unsafe-inline';
          font-src * data: blob: ;
          frame-src * data: blob: ;
          media-src * data: blob: ;"
        />
      </Head>

      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App
