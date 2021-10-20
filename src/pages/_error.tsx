import { ErrorPage } from '@/components'
import { NextPageContext, NextPage } from 'next'

const ErrorP = ({ statusCode }: { statusCode: number }) => {
  return <ErrorPage statusCode={statusCode} />
}

ErrorP.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
