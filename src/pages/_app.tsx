import React, { useEffect } from 'react'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'
import { ThemeProvider } from 'next-themes'

import dynamic from 'next/dynamic'
import { SpeedInsights } from '@vercel/speed-insights/next'

const GA4 = dynamic(() => import('@/components/atoms/GA4'), { ssr: false })
const Analytics = dynamic(() => import('@vercel/analytics/react').then(m => m.Analytics), { ssr: false })

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
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.remove('blur-load')
    }, 200)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preload" href="/favicon-32x32.png" as="image" fetchPriority="high" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://www.googletagmanager.com https://vercel.live https://googleads.g.doubleclick.net https://www.googleadservices.com;
          connect-src 'self' https://vitals.vercel-insights.com https://analytics.google.com https://stats.g.doubleclick.net https://*.pusher.com;
          style-src 'self' 'unsafe-hashes' 'unsafe-inline';
          img-src * data: blob: 'unsafe-inline';
          frame-src * data: blob: ;
          media-src * data: blob: ;
          worker-src 'self' blob: ;"
        />
      </Head>

      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      {process.env.NEXT_PUBLIC_VERCEL_URL ? <Analytics /> : <></>}
      {process.env.NEXT_PUBLIC_VERCEL_URL ? <GA4 id="G-CRRP8E78TC" /> : <></>}
      {process.env.NEXT_PUBLIC_VERCEL_URL ? <SpeedInsights /> : <></>}
    </>
  )
}

export default App
