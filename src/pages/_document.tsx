import React from 'react'
import { Head, Html, Main, NextScript } from 'next/document'

const noflash = `
const storageKey = 'theme'
function setDocClass(theme) {
  document.documentElement.classList.remove(...document.documentElement.classList)
  document.documentElement.classList.add(theme)
}
const preferDarkQuery = '(prefers-color-scheme: dark)'
const mql = window.matchMedia(preferDarkQuery)
const supportsColorSchemeQuery = mql.media === preferDarkQuery
let localStorageTheme = null
try {
  localStorageTheme = localStorage.getItem(storageKey)
} catch (err) {}
const localStorageExists = localStorageTheme !== null
if (localStorageExists) {
  localStorageTheme = localStorageTheme
  setDocClass(localStorageTheme)
} else if (supportsColorSchemeQuery) {
  setDocClass(mql.matches ? 'dark' : 'light')
}
`

const Document = () => {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="shortcut icon" href="/favicon-48x48.png" type="image/png" />
        <link href="/favicon-48x48.png" rel="icon" sizes="48x48" type="image/png" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        <link rel="manifest" href="/manifest.json" />

        <link href="/apple-touch-icon-57x57.png" rel="apple-touch-icon" sizes="57x57" />
        <link href="/apple-touch-icon-60x60.png" rel="apple-touch-icon" sizes="60x60" />
        <link href="/apple-touch-icon-72x72.png" rel="apple-touch-icon" sizes="72x72" />
        <link href="/apple-touch-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
        <link href="/apple-touch-icon-114x114.png" rel="apple-touch-icon" sizes="114x114" />
        <link href="/apple-touch-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
        <link href="/apple-touch-icon-144x144.png" rel="apple-touch-icon" sizes="144x144" />
        <link href="/apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
        <link href="/apple-touch-icon-167x167.png" rel="apple-touch-icon" sizes="167x167" />
      </Head>

      <body className="blur-load">
        <script dangerouslySetInnerHTML={{ __html: noflash }}></script>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
