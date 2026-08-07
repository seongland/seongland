import { useState } from 'react'
import { useQuery } from 'convex/react'
import { statsApi } from '@/lib/convexApi.ts'
import type { Flow } from '@/lib/convexApi.ts'
import Sankey from './Sankey.tsx'
import { pageLabel } from './palette.ts'
import { Loading, Panel } from './ui.tsx'

export default function FlowView({ days, includeExcluded }: { days: number; includeExcluded: boolean }) {
  const [start, setStart] = useState<string | null>(null)
  const data = useQuery(statsApi.flow, { days, start: start ?? undefined, includeExcluded }) as Flow | undefined

  const chip = (active: boolean) =>
    `mono rounded-md px-2 py-0.5 text-[10px] transition-colors ${
      active ? 'bg-rust/20 text-ink' : 'text-ink-3 hover:bg-ink/5 hover:text-ink'
    }`

  return (
    <Panel
      title="How readers move"
      note={data ? `${data.sessions} visits${data.truncated ? ' · window truncated' : ''}` : undefined}>
      {data === undefined ? (
        <Loading label="Loading flow" />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <span className="mono mr-1 text-[10px] tracking-wider text-ink-3 uppercase">start</span>
            <button onClick={() => setStart(null)} className={chip(start === null)}>
              anywhere
            </button>
            {data.pages.map(page => (
              <button key={page} onClick={() => setStart(page)} className={chip(start === page)}>
                {pageLabel(page)}
              </button>
            ))}
          </div>
          {/* Clicking a node re-roots the diagram there, so the start control and the chart agree. */}
          <Sankey data={data} onPickStart={setStart} />
          <p className="mono text-[10px] text-ink-3">
            Each column is where readers were on their Nth page. Click a band to start the flow there.
          </p>
        </div>
      )}
    </Panel>
  )
}
