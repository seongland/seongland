const WIDTH = 640
const HEIGHT = 220
const PAD = 28
const CAP_MS = 600_000

/**
 * One dot per session: how long they actually read against how far they got.
 * The time axis is logarithmic because read times span seconds to many minutes,
 * and a linear axis would pile almost every session against the left edge.
 */
export default function Scatter({ points }: { points: { activeMs: number; maxScroll: number; articleId: string }[] }) {
  if (points.length === 0) return <p className="mono text-[11px] text-ink-3">No sessions yet</p>

  const x = (ms: number) => {
    const clamped = Math.max(1000, Math.min(CAP_MS, ms || 1000))
    const ratio = Math.log(clamped / 1000) / Math.log(CAP_MS / 1000)
    return PAD + ratio * (WIDTH - PAD * 2)
  }
  const y = (scroll: number) => HEIGHT - PAD - (Math.max(0, Math.min(100, scroll)) / 100) * (HEIGHT - PAD * 2)
  const ticks = [1, 10, 60, 600]

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height={HEIGHT} role="img" aria-label="Read time vs depth">
        {[0, 25, 50, 75, 100].map(depth => (
          <g key={depth}>
            <line x1={PAD} x2={WIDTH - PAD} y1={y(depth)} y2={y(depth)} className="stroke-ink/10" strokeWidth={1} />
            <text x={4} y={y(depth) + 3} className="fill-ink-3 text-[9px]">
              {depth}%
            </text>
          </g>
        ))}
        {ticks.map(seconds => (
          <text key={seconds} x={x(seconds * 1000)} y={HEIGHT - 8} textAnchor="middle" className="fill-ink-3 text-[9px]">
            {seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
          </text>
        ))}
        {points.map((point, index) => (
          <circle key={index} cx={x(point.activeMs)} cy={y(point.maxScroll)} r={3.5} className="fill-rust/45" stroke="none">
            <title>{`${point.articleId} · ${Math.round(point.activeMs / 1000)}s · ${point.maxScroll}%`}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}
