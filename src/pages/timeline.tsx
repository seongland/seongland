import React from 'react'

import { timelineEvents } from '@/data/timeline'
import TimelinePage from '@/components/templates/TimelinePage'
import { CenterPage } from '@/components/atoms/CenterPage'
import { GridTitle } from '@/components/atoms/GridTitle'

const PAGES = timelineEvents.length * 2

const Timeline: React.FC = () => {
  return (
    <TimelinePage pages={PAGES}>
      {timelineEvents.map((e, i) => (
        <CenterPage key={i} page={i * 2 + 1} pages={PAGES}>
          <GridTitle title={`${e.year} - ${e.title}`} />
          <p>{e.description}</p>
        </CenterPage>
      ))}
    </TimelinePage>
  )
}

export default Timeline
