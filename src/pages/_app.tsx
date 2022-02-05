import * as React from 'react'
import { DefaultSeo, SocialProfileJsonLd } from 'next-seo'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'

import siteConfig from '~/site-config'

import type { AppProps } from '@/types/next'

import 'windi.css'

import '@/styles/global.css'
import '@/styles/nprogress.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App(props: AppProps) {
  const { Component, pageProps, router } = props
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <DefaultSeo
        title="Welcome!"
        titleTemplate={`%s · ${siteConfig.title}`}
        description={siteConfig.description}
        canonical={siteConfig.url + (router.asPath || '')}
        openGraph={{
          title: siteConfig.title,
          description: siteConfig.description,
          type: 'website',
          site_name: siteConfig.title,
          images: [
            {
              url: `${siteConfig.url}/social-image.png`,
              width: 1024,
              height: 512,
              alt: siteConfig.title,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          handle: siteConfig.twitterUsername,
          site: siteConfig.twitterUsername,
        }}
      />

      <SocialProfileJsonLd
        type="person"
        name={siteConfig.title}
        url={siteConfig.url}
        sameAs={Object.values(siteConfig.socials)}
      />

      {Component.disableLayout ? (
        <Component {...pageProps} />
      ) : (
        <>
          <Component {...pageProps} />
        </>
      )}
    </>
  )
}

export default App
