import Head from 'next/head'
import * as React from 'react'
import Footer from '@/components/molecules/Footer'
import useDarkMode from 'use-dark-mode'

export const ErrorPage: React.FC<{ statusCode: number; title?: string; subtitle?: string }> = ({
  statusCode,
  title,
  subtitle,
}) => {
  if (!title) title = String(statusCode)
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
      <Head>
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />

        <title>{title}</title>
      </Head>

      <div text="dark:white" className="flex absolute inset-0" justify="center">
        <main className="flex items-center" justify="center" flex="col">
          <h1 text="5xl" font="semibold">
            {title}
          </h1>
          {subtitle && (
            <h2 text="2xl" font="semibold">
              {subtitle}
            </h2>
          )}
        </main>
      </div>

      <div className="absolute bottom-0" w="full">
        <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
      </div>
    </>
  )
}
