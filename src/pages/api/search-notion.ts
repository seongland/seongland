import { NextApiRequest, NextApiResponse } from 'next'

import * as types from '~/lib/types'
import { search } from '~/lib/notion'

const searchNotion = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Search', req)
  if (req.method !== 'POST') return res.status(405).send({ error: 'method not allowed' })
  const searchParams: types.SearchParams = req.body
  console.log('lambda search-notion', searchParams)
  const results = await search(searchParams)
  res.setHeader('Cache-Control', 'public, s-maxage=60, max-age=60, stale-while-revalidate=60')
  res.status(200).json(results)
}

export default searchNotion
