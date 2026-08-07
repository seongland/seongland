import { FLOW_HUES, FLOW_NEUTRAL } from './palette.ts'

const SIZE = 300
const R0 = 44
const R1 = 96
const R2 = 138

interface Geo {
  country: string
  sessions: number
  cities: { city: string; sessions: number }[]
}

/** SVG arc between two angles, as a filled ring segment. */
function arc(a0: number, a1: number, inner: number, outer: number): string {
  const c = SIZE / 2
  const point = (angle: number, radius: number) => [
    (c + Math.cos(angle - Math.PI / 2) * radius).toFixed(2),
    (c + Math.sin(angle - Math.PI / 2) * radius).toFixed(2),
  ]
  const large = a1 - a0 > Math.PI ? 1 : 0
  const [x0, y0] = point(a0, outer)
  const [x1, y1] = point(a1, outer)
  const [x2, y2] = point(a1, inner)
  const [x3, y3] = point(a0, inner)
  return `M${x0},${y0}A${outer},${outer} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${inner},${inner} 0 ${large} 0 ${x3},${y3}Z`
}

export default function Sunburst({ geo }: { geo: Geo[] }) {
  const total = geo.reduce((sum, entry) => sum + entry.sessions, 0)
  if (total === 0) return <p className="mono text-[11px] text-ink-3">No located visits yet</p>

  const hues = new Map(
    geo.map((entry, index) => [entry.country, index < FLOW_HUES.length ? FLOW_HUES[index] : FLOW_NEUTRAL]),
  )

  let angle = 0
  const countries = geo.map(entry => {
    const span = (entry.sessions / total) * Math.PI * 2
    const start = angle
    angle += span
    let inner = start
    const cities = entry.cities.map(city => {
      const citySpan = (city.sessions / total) * Math.PI * 2
      const from = inner
      inner += citySpan
      return { ...city, from, to: inner, country: entry.country }
    })
    return { ...entry, start, end: start + span, cities }
  })

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label="Visits by country and city">
        {countries.map(entry => (
          <path
            key={entry.country}
            d={arc(entry.start, entry.end, R0, R1)}
            fill={hues.get(entry.country)}
            fillOpacity={0.85}>
            <title>{`${entry.country} · ${entry.sessions}`}</title>
          </path>
        ))}
        {countries.flatMap(entry =>
          entry.cities.map(city => (
            <path
              key={`${entry.country}-${city.city}`}
              d={arc(city.from, city.to, R1 + 2, R2)}
              fill={hues.get(entry.country)}
              fillOpacity={0.4}>
              <title>{`${city.city}, ${entry.country} · ${city.sessions}`}</title>
            </path>
          )),
        )}
        <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" className="fill-ink text-[18px]">
          {total}
        </text>
        <text x={SIZE / 2} y={SIZE / 2 + 12} textAnchor="middle" className="fill-ink-3 text-[9px]">
          visits
        </text>
      </svg>
      {/* Ring order is not self-explanatory, so the countries are named outright. */}
      <ul className="flex flex-col gap-1">
        {countries.slice(0, 8).map(entry => (
          <li key={entry.country} className="mono flex items-center gap-2 text-[10px] text-ink-3">
            <span className="h-2 w-2 rounded-full" style={{ background: hues.get(entry.country) }} />
            <span className="text-ink">{entry.country}</span>
            {entry.sessions}
          </li>
        ))}
      </ul>
    </div>
  )
}
