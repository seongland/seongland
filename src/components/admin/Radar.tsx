import { FLOW_HUES, pageLabel } from './palette.ts'

const SIZE = 300
const R = 110

const AXES = ['Visitors', 'Read time', 'Depth', 'Completion', 'Stickiness'] as const

export interface RadarSeries {
  page: string
  /** Already normalised to 0..1 against the busiest page on each axis. */
  values: number[]
}

function point(index: number, ratio: number): [number, number] {
  const angle = (index / AXES.length) * Math.PI * 2 - Math.PI / 2
  const c = SIZE / 2
  return [c + Math.cos(angle) * R * ratio, c + Math.sin(angle) * R * ratio]
}

/**
 * Shape comparison across at most four pages. Capped at four because the
 * categorical palette has four validated hues, and a fifth overlapping polygon
 * is unreadable regardless of colour.
 */
export default function Radar({ series }: { series: RadarSeries[] }) {
  if (series.length === 0) return <p className="mono text-[11px] text-ink-3">No visits yet</p>
  const shown = series.slice(0, FLOW_HUES.length)

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label="Page profile comparison">
        {[0.25, 0.5, 0.75, 1].map(ring => (
          <polygon
            key={ring}
            points={AXES.map((_, index) => point(index, ring).join(',')).join(' ')}
            fill="none"
            className="stroke-ink/10"
            strokeWidth={1}
          />
        ))}
        {AXES.map((axis, index) => {
          const [x, y] = point(index, 1.18)
          return (
            <text key={axis} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-ink-3 text-[9px]">
              {axis}
            </text>
          )
        })}
        {shown.map((entry, seriesIndex) => (
          <polygon
            key={entry.page}
            points={entry.values.map((value, index) => point(index, Math.max(0.02, value)).join(',')).join(' ')}
            fill={FLOW_HUES[seriesIndex]}
            fillOpacity={0.16}
            stroke={FLOW_HUES[seriesIndex]}
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <ul className="flex flex-col gap-1">
        {shown.map((entry, index) => (
          <li key={entry.page} className="mono flex items-center gap-2 text-[10px] text-ink-3">
            <span className="h-2 w-2 rounded-full" style={{ background: FLOW_HUES[index] }} />
            <span className="text-ink">{pageLabel(entry.page)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
