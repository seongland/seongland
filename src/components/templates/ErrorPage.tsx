import Head from 'next/head'
import * as React from 'react'

export const ErrorPage: React.FC<{ statusCode?: number; title?: string; subtitle?: string }> = ({
  statusCode,
  title,
  subtitle,
}) => {
  if (!title) title = String(statusCode)
  return (
    <>
      <Head>
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />

        <title>{title}</title>
      </Head>

      <div text="dark:white" className="flex absolute inset-0" justify="center">
        <main className="flex items-center container mx-10" text="center" justify="center" flex="col">
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
    </>
  )
}
