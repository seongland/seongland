import type { Place } from '@/lib/convexApi.ts'
import { useTheme } from './config.ts'

// public/world-110m.svg is drawn in an equirectangular projection, so a point
// maps to a percentage of the box with no projection maths on this side.
function position(lat: number, lon: number) {
  return { left: `${((lon + 180) / 360) * 100}%`, top: `${((90 - lat) / 180) * 100}%` }
}

export default function WorldMap({ places, height = 300 }: { places: Place[]; height?: number }) {
  const theme = useTheme()
  if (places.length === 0) return <p className="mono text-[11px] text-ink-3">No located visits yet</p>

  const max = Math.max(...places.map(place => place.sessions))

  return (
    <div className="relative w-full overflow-hidden" style={{ height, maxWidth: height * 2 }}>
      <img
        src="/world-110m.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        style={{ filter: theme === 'dark' ? 'invert(1)' : 'none', opacity: theme === 'dark' ? 0.3 : 0.14 }}
      />
      {places.map(place => {
        // Area, not radius, tracks the count so a big city does not swamp the map.
        const size = 5 + Math.sqrt(place.sessions / max) * 16
        return (
          <span
            key={`${place.lat},${place.lon}`}
            title={`${place.city ?? 'unknown'}${place.country ? `, ${place.country}` : ''} · ${place.sessions} session${place.sessions === 1 ? '' : 's'}`}
            className="absolute rounded-full border border-rust/60 bg-rust/40"
            style={{
              ...position(place.lat, place.lon),
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
          />
        )
      })}
    </div>
  )
}
