import React from 'react'
import { ErrorPage } from '@/components'

import type { NextPageContext } from 'next'

const ErrorP = ({ statusCode }: { statusCode: number }) => {
  return <ErrorPage statusCode={statusCode} />
}

ErrorP.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorP
