import type { ReactNode } from 'react'
import type { Tally } from '@/lib/convexApi.ts'

export function formatDuration(ms: number): string {
  if (!ms) return '0s'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

/**
 * Turns a raw referrer into the page it came from. Same-site referrers become a
 * path, so an internal hop reads as the page whose link was clicked rather than
 * as the site's own hostname repeated on every row.
 */
export function formatSource(referrer?: string): string {
  if (!referrer) return 'direct'
  try {
    const url = new URL(referrer)
    if (/(^|\.)seongland\.com$/.test(url.hostname) || url.hostname === 'localhost') {
      return url.pathname === '/' ? 'home' : url.pathname.replace(/\/$/, '')
    }
    return url.hostname.replace(/^www\./, '')
  } catch {
    return referrer
  }
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    // Frosted, so the star canvas stays background rather than reading as data points.
    <section className="rounded-lg border border-rule bg-paper/60 p-4 backdrop-blur-md">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="mono text-[11px] tracking-wider text-ink-3 uppercase">{title}</h2>
        {note && <span className="mono text-[10px] text-ink-3">{note}</span>}
      </header>
      {children}
    </section>
  )
}

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-rule bg-paper/60 px-4 py-3 backdrop-blur-md">
      <div className="mono text-[10px] tracking-wider text-ink-3 uppercase">{label}</div>
      <div className="serif mt-1 text-2xl text-ink">{value}</div>
      {hint && <div className="mono mt-0.5 text-[10px] text-ink-3">{hint}</div>}
    </div>
  )
}

export function BarList({ rows, empty = 'No data yet' }: { rows: Tally[]; empty?: string }) {
  if (rows.length === 0) return <p className="mono text-[11px] text-ink-3">{empty}</p>
  const max = Math.max(...rows.map(row => row.count))
  return (
    <ul className="flex flex-col gap-1">
      {rows.map(row => (
        <li key={row.name} className="relative flex items-center justify-between gap-3 rounded px-2 py-1">
          <span
            className="absolute inset-y-0 left-0 rounded bg-rust/20"
            style={{ width: `${Math.max(2, (row.count / max) * 100)}%` }}
            aria-hidden="true"
          />
          <span className="relative truncate text-xs text-ink">{row.name}</span>
          <span className="mono relative text-[11px] text-ink-3">{row.count}</span>
        </li>
      ))}
    </ul>
  )
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return <p className="mono text-[11px] text-ink-3">{label}…</p>
}

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-rule px-6 py-5">
      <p className="serif mb-2 text-lg text-ink">{title}</p>
      <div className="mono text-[11px] leading-relaxed break-all text-ink-3">{children}</div>
    </div>
  )
}
