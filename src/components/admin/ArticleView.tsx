import { useQuery } from 'convex/react'
import { statsApi } from '@/lib/convexApi.ts'
import JourneyGraph from './JourneyGraph.tsx'
import SessionTree from './SessionTree.tsx'
import { BarList, Loading, Panel, StatTile, formatDuration, formatPercent } from './ui.tsx'

function Funnel({ rows, sessions }: { rows: { milestone: number; sessions: number }[]; sessions: number }) {
  if (sessions === 0) return <p className="mono text-[11px] text-ink-3">No sessions yet</p>
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.map(row => (
        <li key={row.milestone} className="flex items-center gap-3">
          <span className="mono w-10 text-right text-[10px] text-ink-3">{row.milestone}%</span>
          <span className="h-3 flex-1 overflow-hidden rounded bg-ink/5">
            <span
              className="block h-full rounded bg-ink/30"
              style={{ width: `${Math.max(1, (row.sessions / sessions) * 100)}%` }}
            />
          </span>
          <span className="mono w-20 text-[10px] text-ink-3">
            {row.sessions} · {formatPercent(row.sessions / sessions)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function ArticleView({ articleId, days }: { articleId: string; days: number }) {
  const detail = useQuery(statsApi.articleDetail, { articleId, days })
  const journey = useQuery(statsApi.journey, { articleId, days })
  const sessions = useQuery(statsApi.recentSessions, { articleId, limit: 25 })

  if (detail === undefined) return <Loading label={`Loading ${articleId}`} />

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Visitors" value={String(detail.summary.visitors)} hint={`${detail.summary.sessions} sessions`} />
        <StatTile label="Median read" value={formatDuration(detail.summary.medianActiveMs)} hint="active time" />
        <StatTile label="Completion" value={formatPercent(detail.summary.completionRate)} hint="reached the end" />
        <StatTile label="BibTeX copies" value={String(detail.bibtexCopies)} hint={`last ${days} days`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Scroll funnel" note={detail.truncated ? 'window truncated' : undefined}>
          <Funnel rows={detail.scroll} sessions={detail.summary.sessions} />
        </Panel>
        <Panel title="Sections reached">
          <BarList rows={detail.sections} empty="No section events yet" />
        </Panel>
      </div>

      <Panel title="Reader journey" note={journey ? `${journey.sessions} sessions with sections` : undefined}>
        {journey === undefined ? <Loading /> : <JourneyGraph data={journey} />}
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Interactions">
          <BarList rows={detail.interactions} empty="No clicks recorded yet" />
        </Panel>
        <Panel title="Outbound links">
          <BarList rows={detail.outbound} empty="No outbound clicks yet" />
        </Panel>
        <Panel title="Countries">
          <BarList rows={detail.countries} />
        </Panel>
        <Panel title="Recent sessions">{sessions === undefined ? <Loading /> : <SessionTree sessions={sessions} />}</Panel>
      </div>
    </div>
  )
}
