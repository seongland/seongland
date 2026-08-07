const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** When people read, as UTC weekday by hour. */
export default function Heatmap({ hourly }: { hourly: number[][] }) {
  const max = Math.max(1, ...hourly.flat())
  if (max === 1 && hourly.flat().every(count => count === 0)) {
    return <p className="mono text-[11px] text-ink-3">No visits yet</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-separate" style={{ borderSpacing: 2 }}>
        <tbody>
          {hourly.map((row, day) => (
            <tr key={day}>
              <th className="mono pr-2 text-right text-[9px] font-normal text-ink-3">{DAYS[day]}</th>
              {row.map((count, hour) => (
                <td
                  key={hour}
                  title={`${DAYS[day]} ${String(hour).padStart(2, '0')}:00 UTC · ${count}`}
                  className="rounded-[2px]"
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor:
                      count === 0
                        ? 'var(--color-rule-light)'
                        : `color-mix(in srgb, var(--color-rust) ${20 + (count / max) * 80}%, transparent)`,
                  }}
                />
              ))}
            </tr>
          ))}
          <tr>
            <td />
            {Array.from({ length: 24 }, (_, hour) => (
              <td key={hour} className="mono text-center text-[8px] text-ink-3">
                {hour % 6 === 0 ? hour : ''}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mono mt-1 text-[9px] text-ink-3">hour of day, UTC</p>
    </div>
  )
}
