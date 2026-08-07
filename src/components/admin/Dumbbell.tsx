import { pageLabel } from './palette.ts'

/**
 * First-time against returning, per page. A dumbbell rather than two bars
 * because the question is the size of the gap, and a connected pair reads that
 * directly instead of asking the eye to difference two lengths.
 */
export default function Dumbbell({ rows }: { rows: { page: string; fresh: number; returning: number }[] }) {
  const items = rows.filter(row => row.fresh + row.returning > 0)
  if (items.length === 0) return <p className="mono text-[11px] text-ink-3">No visits yet</p>
  const max = Math.max(1, ...items.map(row => Math.max(row.fresh, row.returning)))

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {items.map(row => {
          const fresh = (row.fresh / max) * 100
          const returning = (row.returning / max) * 100
          const [from, to] = [Math.min(fresh, returning), Math.max(fresh, returning)]
          return (
            <li key={row.page} className="flex items-center gap-3">
              <span className="w-28 truncate text-[10px] text-ink-3" title={pageLabel(row.page)}>
                {pageLabel(row.page)}
              </span>
              <span className="relative h-3 flex-1">
                <span
                  className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-ink/20"
                  style={{ left: `${from}%`, width: `${Math.max(0, to - from)}%` }}
                />
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust"
                  style={{ left: `${fresh}%` }}
                  title={`${row.fresh} first-time`}
                />
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson"
                  style={{ left: `${returning}%` }}
                  title={`${row.returning} returning`}
                />
              </span>
              <span className="mono w-14 text-right text-[10px] text-ink-3">
                {row.fresh}/{row.returning}
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mono flex gap-4 text-[10px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rust" /> first-time
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-crimson" /> returning
        </span>
      </div>
    </div>
  )
}
