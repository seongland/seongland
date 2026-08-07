import { useMemo, useState } from 'react'
import type { Flow } from '@/lib/convexApi.ts'
import { assignHues, pageLabel } from './palette.ts'

const HEIGHT = 380
const NODE_W = 11
const PAD = 7
const LABEL_W = 116

interface Placed {
  id: string
  page: string
  step: number
  sessions: number
  exits: number
  x: number
  y: number
  height: number
}

/** Ribbon between two stacked nodes, thick in proportion to the visits it carries. */
function ribbon(x0: number, y0: number, x1: number, y1: number, thickness: number): string {
  const mid = (x0 + x1) / 2
  const y0b = y0 + thickness
  const y1b = y1 + thickness
  return [
    `M${x0},${y0}`,
    `C${mid},${y0} ${mid},${y1} ${x1},${y1}`,
    `L${x1},${y1b}`,
    `C${mid},${y1b} ${mid},${y0b} ${x0},${y0b}`,
    'Z',
  ].join('')
}

function layout(data: Flow, width: number) {
  const steps = Math.max(0, ...data.nodes.map(n => n.step))
  const columns: Flow['nodes'][] = Array.from({ length: steps + 1 }, () => [])
  for (const node of data.nodes) columns[node.step].push(node)
  for (const column of columns) column.sort((a, b) => b.sessions - a.sessions || a.page.localeCompare(b.page))

  const totals = columns.map(column => column.reduce((sum, n) => sum + n.sessions, 0))
  const maxTotal = Math.max(1, ...totals)
  const busiest = Math.max(1, ...columns.map(column => column.length))
  const scale = Math.max(0, HEIGHT - PAD * (busiest - 1)) / maxTotal

  const usable = width - LABEL_W - NODE_W
  const placed = new Map<string, Placed>()
  columns.forEach((column, step) => {
    let y = 0
    for (const node of column) {
      const height = Math.max(3, node.sessions * scale)
      placed.set(node.id, {
        ...node,
        x: LABEL_W + (steps === 0 ? 0 : (step / steps) * usable),
        y,
        height,
      })
      y += height + PAD
    }
  })
  return { placed, steps }
}

export default function Sankey({ data, onPickStart }: { data: Flow; onPickStart?: (page: string) => void }) {
  const [hover, setHover] = useState<string | null>(null)
  const width = 900

  const { placed, ribbons, hues } = useMemo(() => {
    const { placed } = layout(data, width)

    const volume = new Map<string, number>()
    for (const node of data.nodes) volume.set(node.page, (volume.get(node.page) ?? 0) + node.sessions)
    const hues = assignHues([...volume.entries()].sort((a, b) => b[1] - a[1]).map(([page]) => page))

    // Ribbons leave and arrive stacked in the same order the nodes are drawn,
    // so streams do not cross more than the data itself requires.
    const outOffset = new Map<string, number>()
    const inOffset = new Map<string, number>()
    const ribbons = data.links
      .slice()
      .sort((a, b) => (placed.get(a.target)?.y ?? 0) - (placed.get(b.target)?.y ?? 0))
      .flatMap(link => {
        const from = placed.get(link.source)
        const to = placed.get(link.target)
        if (!from || !to) return []
        const scale = from.sessions === 0 ? 0 : from.height / from.sessions
        const thickness = Math.max(1.5, link.value * scale)
        const y0 = from.y + (outOffset.get(from.id) ?? 0)
        const y1 = to.y + (inOffset.get(to.id) ?? 0)
        outOffset.set(from.id, (outOffset.get(from.id) ?? 0) + thickness)
        inOffset.set(to.id, (inOffset.get(to.id) ?? 0) + thickness)
        return [
          {
            key: `${link.source}>${link.target}`,
            d: ribbon(from.x + NODE_W, y0, to.x, y1, thickness),
            colour: hues.get(from.page) ?? 'var(--color-ink-4)',
            value: link.value,
            title: `${pageLabel(from.page)} → ${pageLabel(to.page)} · ${link.value}`,
            source: from.id,
            target: to.id,
          },
        ]
      })

    return { placed, ribbons, hues }
  }, [data])

  if (data.nodes.length === 0) {
    return <p className="mono text-[11px] text-ink-3">No page-to-page movement recorded yet</p>
  }

  const nodes = [...placed.values()]
  const bottom = Math.max(...nodes.map(n => n.y + n.height))
  const lit = (id: string) => hover === null || hover === id

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${bottom + 24}`}
        width="100%"
        role="img"
        aria-label="Page to page flow"
        style={{ minWidth: 640 }}>
        {ribbons.map(r => (
          <path
            key={r.key}
            d={r.d}
            fill={r.colour}
            fillOpacity={hover === null ? 0.3 : hover === r.source || hover === r.target ? 0.62 : 0.07}
            className="transition-[fill-opacity]">
            <title>{r.title}</title>
          </path>
        ))}

        {nodes.map(node => (
          <g
            key={node.id}
            onMouseEnter={() => setHover(node.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onPickStart?.(node.page)}
            className={onPickStart ? 'cursor-pointer' : undefined}>
            <rect
              x={node.x}
              y={node.y}
              width={NODE_W}
              height={node.height}
              rx={2}
              fill={hues.get(node.page) ?? 'var(--color-ink-4)'}
              fillOpacity={lit(node.id) ? 0.95 : 0.3}>
              <title>{`${pageLabel(node.page)} · hop ${node.step + 1} · ${node.sessions} visits · ${node.exits} left here`}</title>
            </rect>
            {/* Every node is directly labelled, so identity never rests on colour. */}
            <text
              x={node.step === 0 ? node.x - 6 : node.x + NODE_W + 6}
              y={node.y + node.height / 2}
              textAnchor={node.step === 0 ? 'end' : 'start'}
              dominantBaseline="middle"
              className="fill-ink text-[10px]"
              opacity={lit(node.id) ? 1 : 0.35}>
              {pageLabel(node.page)}
              <tspan className="fill-ink-3"> {node.sessions}</tspan>
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
