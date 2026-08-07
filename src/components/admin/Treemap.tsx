import { FLOW_HUES, FLOW_NEUTRAL, pageLabel } from './palette.ts'

const WIDTH = 800
const HEIGHT = 300
const GAP = 2

interface Tile {
  page: string
  value: number
  x: number
  y: number
  w: number
  h: number
}

/**
 * Squarified treemap. Rows are filled until adding another tile would make the
 * worst aspect ratio worse, which keeps tiles close to square and therefore
 * comparable by area rather than by whichever side happens to be long.
 */
function squarify(items: { page: string; value: number }[], width: number, height: number): Tile[] {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  if (total <= 0) return []

  const scaled = items.map(item => ({ ...item, area: (item.value / total) * width * height }))
  const tiles: Tile[] = []
  let x = 0
  let y = 0
  let free = { w: width, h: height }
  let row: typeof scaled = []

  const worst = (candidate: typeof scaled, side: number) => {
    const sum = candidate.reduce((total, item) => total + item.area, 0)
    if (sum === 0) return Infinity
    const max = Math.max(...candidate.map(item => item.area))
    const min = Math.min(...candidate.map(item => item.area))
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min))
  }

  const flush = () => {
    const side = Math.min(free.w, free.h)
    const sum = row.reduce((total, item) => total + item.area, 0)
    const thickness = sum / side
    let offset = 0
    for (const item of row) {
      const length = item.area / thickness
      tiles.push(
        free.w >= free.h
          ? { page: item.page, value: item.value, x, y: y + offset, w: thickness, h: length }
          : { page: item.page, value: item.value, x: x + offset, y, w: length, h: thickness },
      )
      offset += length
    }
    if (free.w >= free.h) {
      x += thickness
      free = { w: free.w - thickness, h: free.h }
    } else {
      y += thickness
      free = { w: free.w, h: free.h - thickness }
    }
    row = []
  }

  for (const item of scaled) {
    const side = Math.min(free.w, free.h)
    if (row.length > 0 && worst([...row, item], side) > worst(row, side)) flush()
    row.push(item)
  }
  if (row.length > 0) flush()
  return tiles
}

export default function Treemap({ rows }: { rows: { page: string; value: number }[] }) {
  const items = rows.filter(row => row.value > 0).sort((a, b) => b.value - a.value)
  if (items.length === 0) return <p className="mono text-[11px] text-ink-3">No visits yet</p>

  const hues = new Map(items.map((item, index) => [item.page, index < FLOW_HUES.length ? FLOW_HUES[index] : FLOW_NEUTRAL]))
  const tiles = squarify(items, WIDTH, HEIGHT)

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="img" aria-label="Share of visits by page">
        {tiles.map(tile => (
          <g key={tile.page}>
            <rect
              x={tile.x + GAP / 2}
              y={tile.y + GAP / 2}
              width={Math.max(0, tile.w - GAP)}
              height={Math.max(0, tile.h - GAP)}
              rx={3}
              fill={hues.get(tile.page)}
              fillOpacity={0.75}>
              <title>{`${pageLabel(tile.page)} · ${tile.value}`}</title>
            </rect>
            {/* Only label tiles with room, so text never spills over a neighbour. */}
            {tile.w > 74 && tile.h > 26 && (
              <text x={tile.x + 8} y={tile.y + 19} className="fill-paper text-[11px] font-medium">
                {pageLabel(tile.page)}
                <tspan className="fill-paper/80"> {tile.value}</tspan>
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
