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

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-rule p-4">
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
    <div className="rounded-lg border border-rule px-4 py-3">
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
            className="absolute inset-y-0 left-0 rounded bg-ink/10"
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
