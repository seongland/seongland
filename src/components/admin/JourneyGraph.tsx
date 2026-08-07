import type { Journey } from '@/lib/convexApi.ts'

const ROW = 34
const GUTTER = 110
const WIDTH = 640
const MAX_EDGES = 40

/**
 * Sections in document order down the page, with reader transitions drawn as
 * arcs in the left gutter. Document order gives the layout for free, so this
 * stays plain SVG instead of pulling in a graph library.
 */
export default function JourneyGraph({ data }: { data: Journey }) {
  if (data.nodes.length === 0) return <p className="mono text-[11px] text-ink-3">No section events yet</p>

  const index = new Map(data.nodes.map((node, position) => [node.id, position]))
  const maxSessions = Math.max(...data.nodes.map(node => node.sessions))
  const edges = data.edges.filter(edge => index.has(edge.from) && index.has(edge.to)).slice(0, MAX_EDGES)
  const maxEdge = edges.length > 0 ? Math.max(...edges.map(edge => edge.count)) : 1
  const height = data.nodes.length * ROW + 16
  const y = (position: number) => position * ROW + ROW / 2

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${WIDTH} ${height}`} width="100%" height={height} role="img" aria-label="Reader journey">
        {edges.map(edge => {
          const from = y(index.get(edge.from) as number)
          const to = y(index.get(edge.to) as number)
          const bulge = Math.min(90, 14 + Math.abs(to - from) * 0.35)
          return (
            <path
              key={`${edge.from}->${edge.to}`}
              d={`M ${GUTTER} ${from} C ${GUTTER - bulge} ${from}, ${GUTTER - bulge} ${to}, ${GUTTER} ${to}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.15 + 0.5 * (edge.count / maxEdge)}
              strokeWidth={1 + 3 * (edge.count / maxEdge)}
              className="text-ink">
              <title>{`${edge.from} → ${edge.to}: ${edge.count}`}</title>
            </path>
          )
        })}

        {data.nodes.map((node, position) => {
          const top = position * ROW + 6
          const barWidth = Math.max(3, (node.sessions / maxSessions) * (WIDTH - GUTTER - 130))
          return (
            <g key={node.id}>
              <circle cx={GUTTER} cy={y(position)} r={3.5} className="fill-ink" />
              <rect x={GUTTER + 10} y={top} width={barWidth} height={ROW - 14} rx={3} className="fill-ink/15" />
              <text x={GUTTER + 16} y={top + 14} className="fill-ink text-[11px]">
                {node.id}
              </text>
              <text x={WIDTH - 4} y={top + 14} textAnchor="end" className="fill-ink-3 text-[10px]">
                {node.sessions} in · {node.exits} left
              </text>
            </g>
          )
        })}
      </svg>
      {data.edges.length > MAX_EDGES && (
        <p className="mono mt-2 text-[10px] text-ink-3">
          showing the {MAX_EDGES} heaviest of {data.edges.length} transitions
        </p>
      )}
    </div>
  )
}
