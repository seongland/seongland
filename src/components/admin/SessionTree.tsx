import type { RecentSession } from '@/lib/convexApi.ts'
import { formatDuration, formatTime } from './ui.tsx'

function place(session: RecentSession['session']): string {
  return [session.city, session.region, session.country].filter(Boolean).join(', ') || 'unknown'
}

function describe(event: RecentSession['events'][number]): string {
  if (event.type === 'scroll') return `scroll ${event.value}%`
  if (event.type === 'exit') return `exit after ${formatDuration(Number(event.value) || 0)}`
  if (event.target) return `${event.type} · ${event.target}`
  return event.type
}

/** One reader per row, expandable into the ordered path they actually took. */
export default function SessionTree({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) return <p className="mono text-[11px] text-ink-3">No sessions yet</p>

  return (
    <ul className="flex flex-col gap-1">
      {sessions.map(({ session, events }) => (
        <li key={session._id}>
          <details className="rounded-md border border-rule/60 px-3 py-2">
            <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs text-ink">{place(session)}</span>
              <span className="mono text-[10px] text-ink-3">
                {formatTime(session.startedAt)} · {formatDuration(session.activeMs)} · {session.maxScroll}%
                {session.completed ? ' · finished' : ''}
              </span>
            </summary>
            <ol className="mt-2 border-l border-rule pl-3">
              {events.map(event => (
                <li key={`${session._id}-${event.seq}`} className="mono py-0.5 text-[10px] text-ink-3">
                  <span className="text-ink-4">+{formatDuration(event.ts - session.startedAt)}</span>{' '}
                  <span className="text-ink">{describe(event)}</span>
                </li>
              ))}
            </ol>
          </details>
        </li>
      ))}
    </ul>
  )
}
