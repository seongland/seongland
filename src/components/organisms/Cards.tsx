import React from 'react'
import dynamic from 'next/dynamic'

import type { Card } from '~/scripts/cards'

export const CardGrid = dynamic(async () => import('@/components/molecules/CardGrid'))

export const Cards: React.FC<{ cards: Card[] }> = ({ cards }) => {
  return <CardGrid cards={cards} />
}
