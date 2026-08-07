import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { statsApi } from '@/lib/convexApi.ts'
import { orgForIp } from '@/lib/ipOrg.ts'
import type { Overview as OverviewData, RecentRow } from '@/lib/convexApi.ts'
import Dumbbell from './Dumbbell.tsx'
import FlowView from './FlowView.tsx'
import Heatmap from './Heatmap.tsx'
import JourneyDrawer from './JourneyDrawer.tsx'
import Radar from './Radar.tsx'
import type { RadarSeries } from './Radar.tsx'
import Sunburst from './Sunburst.tsx'
import Treemap from './Treemap.tsx'
import Scatter from './Scatter.tsx'
import WorldMap from './WorldMap.tsx'
import { BarList, Loading, Panel, StatTile, formatDuration, formatPercent, formatSource, formatTime } from './ui.tsx'

function DailyChart({ rows }: { rows: { day: string; count: number }[] }) {
  if (rows.length === 0) return <p className="mono text-[11px] text-ink-3">No visits yet</p>
  const max = Math.max(...rows.map(row => row.count))
  return (
    <div className="flex h-24 items-end gap-[3px]">
      {rows.map(row => (
        <div
          key={row.day}
          title={`${row.day}: ${row.count}`}
          className="flex-1 rounded-t bg-rust/70 transition-colors hover:bg-rust"
          style={{ height: `${Math.max(4, (row.count / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

function Depth({ rows }: { rows: { bucket: number; count: number }[] }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0)
  if (total === 0) return <p className="mono text-[11px] text-ink-3">No sessions yet</p>
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.map((row, index) => (
        <li key={row.bucket} className="flex items-center gap-3">
          <span className="mono w-16 text-right text-[10px] text-ink-3">
            {index === rows.length - 1 ? '100%' : `${row.bucket}–${rows[index + 1].bucket}%`}
          </span>
          <span className="h-3 flex-1 overflow-hidden rounded bg-ink/5">
            {/* Buckets are ordered, so the ramp itself encodes how deep the read was. */}
            <span
              className="block h-full rounded"
              style={{
                width: `${(row.count / total) * 100}%`,
                backgroundColor: `color-mix(in srgb, var(--color-rust) ${35 + (index / Math.max(1, rows.length - 1)) * 65}%, transparent)`,
              }}
            />
          </span>
          <span className="mono w-8 text-[10px] text-ink-3">{row.count}</span>
        </li>
      ))}
    </ul>
  )
}

function VisitorSplit({ fresh, returning }: { fresh: number; returning: number }) {
  const total = fresh + returning
  if (total === 0) return <p className="mono text-[11px] text-ink-3">No visitors yet</p>
  return (
    <div>
      {/* A 2px gap keeps the two segments legible where they meet. */}
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded">
        <div className="rounded-l bg-rust" style={{ width: `${(fresh / total) * 100}%` }} title={`${fresh} first-time`} />
        <div
          className="rounded-r bg-crimson"
          style={{ width: `${(returning / total) * 100}%` }}
          title={`${returning} returning`}
        />
      </div>
      <div className="mono mt-2 flex justify-between text-[10px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rust" aria-hidden="true" />
          {fresh} first-time
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-crimson" aria-hidden="true" />
          {returning} returning
        </span>
      </div>
    </div>
  )
}

/**
 * Each axis is scaled against the best page rather than an absolute maximum, so
 * the chart answers "which page is strongest at what" instead of flattening
 * every page against a ceiling nothing reaches. Bounce is inverted into
 * stickiness so that, on every axis, further out is better.
 */
function radarSeries(data: OverviewData): RadarSeries[] {
  const top = data.articles.slice(0, 4)
  if (top.length === 0) return []
  const best = {
    visitors: Math.max(1, ...top.map(a => a.visitors)),
    read: Math.max(1, ...top.map(a => a.medianActiveMs)),
    depth: Math.max(1, ...top.map(a => a.medianScroll)),
  }
  return top.map(a => ({
    page: a.articleId,
    values: [
      a.visitors / best.visitors,
      a.medianActiveMs / best.read,
      a.medianScroll / best.depth,
      a.completionRate,
      1 - a.bounceRate,
    ],
  }))
}

function RecentTable({
  rows,
  onExcludeIp,
  onInclude,
  onOpenJourney,
  ownerHidden,
}: {
  rows: RecentRow[]
  onExcludeIp: (ip: string) => void
  onInclude: (row: RecentRow) => void
  onOpenJourney: (sessionId: string) => void
  ownerHidden: boolean
}) {
  if (rows.length === 0) return <p className="mono text-[11px] text-ink-3">Nothing recorded yet</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="mono text-[10px] tracking-wider text-ink-3 uppercase">
            <th className="pb-2 font-normal">When</th>
            <th className="pb-2 font-normal">Article</th>
            <th className="pb-2 font-normal">Where</th>
            <th className="pb-2 font-normal">Lang</th>
            <th className="pb-2 font-normal">Came from</th>
            <th className="pb-2 font-normal">IP</th>
            <th className="pb-2 text-right font-normal">Read</th>
            <th className="pb-2 text-right font-normal">Depth</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row._id} className={`border-t border-rule/60 ${row.excluded ? 'opacity-40' : ''}`}>
              <td className="mono py-1.5 text-[10px] text-ink-3">
                <button
                  onClick={() => onOpenJourney(row.sessionId)}
                  title="Show this visit as a journey"
                  className="underline-offset-2 hover:text-ink hover:underline">
                  {formatTime(row.startedAt)}
                </button>
              </td>
              <td className="py-1.5 text-[11px] text-ink">{row.articleId}</td>
              <td className="py-1.5 text-[11px] text-ink-3">
                {[row.city, row.country].filter(Boolean).join(', ') || 'unknown'}
                {row.owner && <span className="mono ml-1.5 text-[9px] text-rust">me</span>}
              </td>
              <td className="mono py-1.5 text-[10px] text-ink-3">{row.language ?? '—'}</td>
              <td className="py-1.5 text-[11px] text-ink-3">
                <span title={row.referrer || 'no referrer'}>{formatSource(row.referrer)}</span>
              </td>
              <td className="mono py-1.5 text-[10px] text-ink-3">
                {row.ip ?? '—'}
                {orgForIp(row.ip) && <span className="ml-1.5 text-rust">{orgForIp(row.ip)}</span>}
              </td>
              <td className="mono py-1.5 text-right text-[10px] text-ink-3">{formatDuration(row.activeMs)}</td>
              <td className="mono py-1.5 text-right text-[10px] text-ink-3">{row.maxScroll}%</td>
              <td className="py-1.5 text-right">
                {row.excluded ? (
                  <button
                    onClick={() => onInclude(row)}
                    title={
                      row.owner && ownerHidden
                        ? 'Hidden by the "ignore my own reading" setting, which is global'
                        : 'Count this visit again'
                    }
                    className="mono text-[10px] text-ink-3 underline-offset-2 hover:text-ink hover:underline">
                    include
                  </button>
                ) : (
                  row.ip && (
                    <button
                      onClick={() => onExcludeIp(row.ip as string)}
                      title={`Stop counting ${row.ip}`}
                      className="mono text-[10px] text-ink-3 underline-offset-2 hover:text-ink hover:underline">
                      exclude
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Overview({
  days,
  includeExcluded,
  onSelect,
}: {
  days: number
  includeExcluded: boolean
  onSelect: (articleId: string) => void
}) {
  const data = useQuery(statsApi.overview, { days, includeExcluded }) as OverviewData | undefined
  const exclusions = useQuery(statsApi.getExclusions, {})
  const save = useMutation(statsApi.setExclusions)
  const [journey, setJourney] = useState<string | null>(null)

  if (data === undefined) return <Loading label="Loading overview" />

  const excludeIp = (ip: string) => {
    if (!exclusions) return
    void save({ ...exclusions, excludedIps: [...new Set([...exclusions.excludedIps, ip])] })
  }

  // A row can be hidden by its address or by its visitor id, so putting it back
  // has to clear both; the owner rule is global and stays where it is.
  const includeAgain = (row: RecentRow) => {
    if (!exclusions) return
    void save({
      ...exclusions,
      excludedIps: exclusions.excludedIps.filter(ip => ip !== row.ip),
      excludedVisitors: exclusions.excludedVisitors.filter(id => id !== row.visitorId),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Visitors" value={String(data.totals.visitors)} hint={`${data.totals.sessions} sessions`} />
        <StatTile label="Median read" value={formatDuration(data.totals.medianActiveMs)} hint="active time" />
        <StatTile label="Completion" value={formatPercent(data.totals.completionRate)} hint="reached the end" />
        <StatTile label="Bounce" value={formatPercent(data.totals.bounceRate)} hint="under 10s, under 25%" />
        <StatTile label="Events" value={String(data.totals.events)} hint="interactions recorded" />
        <StatTile label="Ignored" value={String(data.excludedCount)} hint="excluded visits" />
      </div>

      <Panel title="Where they read" note={`${data.places.length} located places`}>
        <WorldMap places={data.places} />
      </Panel>

      <FlowView days={days} includeExcluded={includeExcluded} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Daily sessions" note={data.truncated ? 'window truncated' : undefined}>
          <DailyChart rows={data.daily} />
        </Panel>
        <Panel title="When they read">
          <Heatmap hourly={data.hourly} />
        </Panel>
      </div>

      <Panel title="Read time against depth" note="one dot per session">
        <Scatter points={data.scatter} />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="How far they got">
          <Depth rows={data.depth} />
        </Panel>
        <Panel title="First-time against returning">
          <VisitorSplit fresh={data.visitors.fresh} returning={data.visitors.returning} />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Share of visits" note="area is visits">
          <Treemap rows={data.articles.map(a => ({ page: a.articleId, value: a.sessions }))} />
        </Panel>
        <Panel title="Who is new, per page">
          <Dumbbell rows={data.articles.map(a => ({ page: a.articleId, fresh: a.fresh, returning: a.returning }))} />
        </Panel>
        <Panel title="Country and city" note="inner ring is country">
          <Sunburst geo={data.geo} />
        </Panel>
        <Panel title="Page profiles" note="busiest four, each axis relative to the best">
          <Radar series={radarSeries(data)} />
        </Panel>
      </div>

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
                <th className="pb-2 text-right font-normal">Bounce</th>
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
                  <td className="mono py-2 text-right text-[11px] text-ink-3">{formatPercent(article.bounceRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <Panel title="Recent sessions" note="newest first, including excluded">
        <RecentTable
          rows={data.recent}
          onExcludeIp={excludeIp}
          onInclude={includeAgain}
          onOpenJourney={setJourney}
          ownerHidden={exclusions?.excludeOwner ?? true}
        />
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Panel title="Languages">
          <BarList rows={data.languages} />
        </Panel>
        <Panel title="Time zones">
          <BarList rows={data.timezones} />
        </Panel>
      </div>

      {journey && <JourneyDrawer sessionId={journey} onClose={() => setJourney(null)} />}
    </div>
  )
}
