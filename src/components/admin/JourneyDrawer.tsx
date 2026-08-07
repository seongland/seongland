import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { statsApi } from '@/lib/convexApi.ts'
import type { SessionJourney } from '@/lib/convexApi.ts'
import { orgForIp } from '@/lib/ipOrg.ts'
import { buildSessionGraph } from './sessionGraph.tsx'
import { Loading, formatDuration, formatSource, formatTime } from './ui.tsx'

export default function JourneyDrawer({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const journey = useQuery(statsApi.sessionJourney, { sessionId }) as SessionJourney | undefined
  const graph = useMemo(() => (journey ? buildSessionGraph(journey) : { nodes: [], edges: [] }), [journey])
  const org = orgForIp(journey?.ip)

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Reader journey">
      <button className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} aria-label="Close" />
      <aside className="relative flex h-full w-full max-w-3xl flex-col border-l border-rule bg-paper shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4">
          <div>
            <h2 className="serif text-lg text-ink">Reader journey</h2>
            {journey && (
              <p className="mono mt-1 text-[10px] leading-relaxed text-ink-3">
                {formatTime(journey.startedAt)} · {[journey.city, journey.country].filter(Boolean).join(', ') || 'unknown'}
                {org && <span className="text-rust"> · {org}</span>} · {journey.language ?? '—'} ·{' '}
                {formatDuration(journey.activeMs)} · from {formatSource(journey.referrer)}
              </p>
            )}
          </div>
          <button onClick={onClose} className="mono text-[11px] text-ink-3 hover:text-ink">
            close
          </button>
        </header>

        {/* min-h-0 so the flex child can actually shrink; React Flow needs a measurable box. */}
        <div className="min-h-0 flex-1">
          {journey === undefined ? (
            <div className="p-5">
              <Loading label="Loading journey" />
            </div>
          ) : graph.nodes.length === 0 ? (
            <p className="mono p-5 text-[11px] text-ink-3">Nothing recorded for this visit</p>
          ) : (
            <ReactFlow
              nodes={graph.nodes}
              edges={graph.edges}
              fitView
              proOptions={{ hideAttribution: true }}
              nodesConnectable={false}
              edgesFocusable={false}>
              <Background color="var(--color-rule)" gap={18} />
              <Controls showInteractive={false} />
              <MiniMap pannable zoomable className="!bg-paper-warm" />
            </ReactFlow>
          )}
        </div>
      </aside>
    </div>
  )
}
