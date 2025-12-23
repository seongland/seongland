import Head from 'next/head'
import React from 'react'
import { ErrorScene } from '@/components/organisms/ErrorScene'

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

      <ErrorScene />

      <div className="flex absolute inset-0 dark:text-white justify-center dark:bg-background-dark">
        <main className="flex items-center container mx-10 text-center justify-center flex-col">
          <h1 className="text-5xl font-semibold">{title}</h1>
          {subtitle && <h2 className="text-2xl font-semibold m-4">{subtitle}</h2>}
        </main>
      </div>
    </>
  )
}
