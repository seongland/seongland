import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mutation = vi.fn()

vi.mock('convex/browser', () => ({
  ConvexHttpClient: class {
    mutation = mutation
  },
}))

const { POST } = await import('@/pages/api/track.ts')

function post(body: unknown, headers: Record<string, string> = {}) {
  const request = new Request('https://seongland.com/api/track', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  return POST({ request } as Parameters<typeof POST>[0])
}

const validBody = {
  articleId: 'corrsteer',
  sessionId: 'session-1',
  visitorId: 'visitor-1',
  events: [{ type: 'pageview', ts: Date.now(), meta: { device: 'desktop' } }],
}

describe('POST /api/track', () => {
  beforeEach(() => {
    mutation.mockReset()
    vi.stubEnv('CONVEX_URL', 'https://example.convex.cloud')
    vi.stubEnv('TRACK_INGEST_KEY', 'secret')
  })

  afterEach(() => vi.unstubAllEnvs())

  it('forwards events with the edge geo headers', async () => {
    const response = await post(validBody, {
      'x-vercel-ip-country': 'KR',
      'x-vercel-ip-country-region': '11',
      'x-vercel-ip-city': 'Seoul',
    })
    expect(response.status).toBe(204)
    expect(mutation).toHaveBeenCalledTimes(1)
    const args = mutation.mock.calls[0][1]
    expect(args).toMatchObject({
      ingestKey: 'secret',
      articleId: 'corrsteer',
      country: 'KR',
      region: '11',
      city: 'Seoul',
    })
    expect(args.events).toHaveLength(1)
  })

  it('decodes percent-encoded city names', async () => {
    await post(validBody, { 'x-vercel-ip-city': 'S%C3%A3o%20Paulo' })
    expect(mutation.mock.calls[0][1].city).toBe('São Paulo')
  })

  it('drops events for articles that are not tracked', async () => {
    const response = await post({ ...validBody, articleId: '../secret' })
    expect(response.status).toBe(204)
    expect(mutation).not.toHaveBeenCalled()
  })

  it('drops unknown event types and future timestamps', async () => {
    await post({
      ...validBody,
      events: [
        { type: 'pageview', ts: Date.now() },
        { type: 'exfiltrate', ts: Date.now() },
        { type: 'scroll', ts: Date.now() + 3_600_000 },
      ],
    })
    expect(mutation.mock.calls[0][1].events).toHaveLength(1)
  })

  it('caps the batch at 100 events', async () => {
    const ts = Date.now()
    await post({ ...validBody, events: Array.from({ length: 150 }, () => ({ type: 'scroll', ts })) })
    expect(mutation.mock.calls[0][1].events).toHaveLength(100)
  })

  it('rejects an oversize body without parsing it', async () => {
    const response = await post(`{"articleId":"corrsteer","pad":"${'x'.repeat(70_000)}"}`)
    expect(response.status).toBe(204)
    expect(mutation).not.toHaveBeenCalled()
  })

  it('stays quiet when the backend is not configured', async () => {
    vi.stubEnv('TRACK_INGEST_KEY', '')
    const response = await post(validBody)
    expect(response.status).toBe(204)
    expect(mutation).not.toHaveBeenCalled()
  })

  it('never surfaces a backend failure to the reader', async () => {
    mutation.mockRejectedValueOnce(new Error('convex down'))
    const response = await post(validBody)
    expect(response.status).toBe(204)
  })

  it('ignores malformed JSON', async () => {
    const response = await post('{not json')
    expect(response.status).toBe(204)
    expect(mutation).not.toHaveBeenCalled()
  })
})
