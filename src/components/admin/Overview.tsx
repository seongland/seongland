import { useQuery } from 'convex/react'
import { statsApi } from '@/lib/convexApi.ts'
import { BarList, Loading, Panel, StatTile, formatDuration, formatPercent } from './ui.tsx'

function DailyChart({ rows }: { rows: { day: string; count: number }[] }) {
  if (rows.length === 0) return <p className="mono text-[11px] text-ink-3">No visits yet</p>
  const max = Math.max(...rows.map(row => row.count))
  return (
    <div className="flex h-24 items-end gap-[3px]">
      {rows.map(row => (
        <div
          key={row.day}
          title={`${row.day}: ${row.count}`}
          className="flex-1 rounded-t bg-ink/25 transition-colors hover:bg-ink/45"
          style={{ height: `${Math.max(4, (row.count / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

export default function Overview({ days, onSelect }: { days: number; onSelect: (articleId: string) => void }) {
  const data = useQuery(statsApi.overview, { days })
  if (data === undefined) return <Loading label="Loading overview" />

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Visitors" value={String(data.totals.visitors)} hint={`${data.totals.sessions} sessions`} />
        <StatTile label="Median read" value={formatDuration(data.totals.medianActiveMs)} hint="active time" />
        <StatTile label="Completion" value={formatPercent(data.totals.completionRate)} hint="reached the end" />
        <StatTile label="Articles" value={String(data.articles.length)} hint={`last ${days} days`} />
      </div>

      <Panel title="Daily sessions" note={data.truncated ? 'window truncated at 4000 sessions' : undefined}>
        <DailyChart rows={data.daily} />
      </Panel>

      <Panel title="Per article">
        {data.articles.length === 0 ? (
          <p className="mono text-[11px] text-ink-3">Nothing recorded yet</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="mono text-[10px] tracking-wider text-ink-3 uppercase">
                <th className="pb-2 font-normal">Article</th>
                <th className="pb-2 text-right font-normal">Visitors</th>
                <th className="pb-2 text-right font-normal">Sessions</th>
                <th className="pb-2 text-right font-normal">Median read</th>
                <th className="pb-2 text-right font-normal">Completion</th>
              </tr>
            </thead>
            <tbody>
              {data.articles.map(article => (
                <tr key={article.articleId} className="border-t border-rule/60">
                  <td className="py-2">
                    <button
                      onClick={() => onSelect(article.articleId)}
                      className="text-xs text-ink underline-offset-4 hover:underline">
                      {article.articleId}
                    </button>
                  </td>
                  <td className="mono py-2 text-right text-[11px] text-ink">{article.visitors}</td>
                  <td className="mono py-2 text-right text-[11px] text-ink-3">{article.sessions}</td>
                  <td className="mono py-2 text-right text-[11px] text-ink-3">{formatDuration(article.medianActiveMs)}</td>
                  <td className="mono py-2 text-right text-[11px] text-ink-3">{formatPercent(article.completionRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Countries">
          <BarList rows={data.countries} />
        </Panel>
        <Panel title="Cities">
          <BarList rows={data.cities} />
        </Panel>
        <Panel title="Referrers">
          <BarList rows={data.referrers} />
        </Panel>
        <Panel title="Devices">
          <BarList rows={data.devices} />
        </Panel>
      </div>
    </div>
  )
}
