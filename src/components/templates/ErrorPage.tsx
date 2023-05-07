import Head from 'next/head'
import React from 'react'

export const ErrorPage: React.FC<{ statusCode?: number; title?: string; subtitle?: string }> = ({
  statusCode,
  title,
  subtitle,
}) => {
  title = title || (statusCode ? String(statusCode) : 'Please retry...😥')
  subtitle = subtitle || 'Sorry 😅'
  return (
    <>
      <Head>
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <title>{title}</title>
      </Head>

      <div text="dark:white" className="flex absolute inset-0" justify="center" bg="dark:background-dark">
        <main className="flex items-center container mx-10" text="center" justify="center" flex="col">
          <h1 text="5xl" font="semibold">
            {title}
          </h1>
          {subtitle && (
            <h2 text="2xl" font="semibold" m="4">
              {subtitle}
            </h2>
          )}
        </main>
      </div>
    </>
  )
}
