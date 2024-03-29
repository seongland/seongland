import React from 'react'
import { ErrorPage } from '@/components/templates/ErrorPage'

const Page404: React.FC = () => {
  return <ErrorPage statusCode={404} />
}

export default Page404
