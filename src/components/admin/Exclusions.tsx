import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { statsApi } from '@/lib/convexApi.ts'
import { Loading, Panel } from './ui.tsx'

function List({
  label,
  values,
  onRemove,
  onAdd,
  placeholder,
}: {
  label: string
  values: string[]
  onRemove: (value: string) => void
  onAdd: (value: string) => void
  placeholder: string
}) {
  const [draft, setDraft] = useState('')
  return (
    <div>
      <div className="mono mb-1.5 text-[10px] tracking-wider text-ink-3 uppercase">{label}</div>
      <ul className="mb-2 flex flex-wrap gap-1.5">
        {values.length === 0 && <li className="mono text-[11px] text-ink-3">none</li>}
        {values.map(value => (
          <li
            key={value}
            className="mono flex items-center gap-1.5 rounded-full border border-rule px-2.5 py-0.5 text-[11px]">
            {value}
            <button onClick={() => onRemove(value)} aria-label={`Remove ${value}`} className="text-ink-3 hover:text-ink">
              ×
            </button>
          </li>
        ))}
      </ul>
      <form
        onSubmit={event => {
          event.preventDefault()
          if (!draft.trim()) return
          onAdd(draft.trim())
          setDraft('')
        }}
        className="flex gap-2">
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          placeholder={placeholder}
          className="mono flex-1 rounded-md border border-rule bg-transparent px-2.5 py-1 text-[11px] text-ink outline-none focus:border-ink-3"
        />
        <button type="submit" className="mono rounded-md border border-rule px-2.5 py-1 text-[11px] hover:bg-ink/5">
          add
        </button>
      </form>
    </div>
  )
}

export default function Exclusions() {
  const saved = useQuery(statsApi.getExclusions, {})
  const save = useMutation(statsApi.setExclusions)
  const [draft, setDraft] = useState(saved)

  useEffect(() => setDraft(saved), [saved])

  if (draft === undefined) return <Loading label="Loading settings" />

  const commit = (next: typeof draft) => {
    if (!next) return
    setDraft(next)
    void save(next)
  }

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Exclusions" note="applied when reading, so edits re-score history">
        <label className="mb-4 flex items-center gap-2 text-xs text-ink">
          <input
            type="checkbox"
            checked={draft.excludeOwner}
            onChange={event => commit({ ...draft, excludeOwner: event.target.checked })}
          />
          Ignore my own reading (any browser where I have signed in here)
        </label>

        <div className="flex flex-col gap-5">
          <List
            label="Excluded IP addresses"
            placeholder="203.0.113.4"
            values={draft.excludedIps}
            onAdd={value => commit({ ...draft, excludedIps: [...draft.excludedIps, value] })}
            onRemove={value => commit({ ...draft, excludedIps: draft.excludedIps.filter(ip => ip !== value) })}
          />
          <List
            label="Excluded visitor ids"
            placeholder="brbxgr1sov591uxjen71vk"
            values={draft.excludedVisitors}
            onAdd={value => commit({ ...draft, excludedVisitors: [...draft.excludedVisitors, value] })}
            onRemove={value => commit({ ...draft, excludedVisitors: draft.excludedVisitors.filter(id => id !== value) })}
          />
        </div>
      </Panel>
    </div>
  )
}
