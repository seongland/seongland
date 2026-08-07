import { describe, expect, it } from 'vitest'
import { orgForIp } from '../src/lib/ipOrg.ts'

describe('orgForIp', () => {
  it('recognises university networks', () => {
    expect(orgForIp('164.67.12.9')).toBe('UCLA')
    expect(orgForIp('128.40.1.1')).toBe('UCL')
    expect(orgForIp('143.248.5.5')).toBe('KAIST')
  })

  it('honours the prefix length rather than matching on the first octet', () => {
    // 171.64.0.0/14 covers 171.64–171.67 and must not swallow 171.68.
    expect(orgForIp('171.67.255.255')).toBe('Stanford')
    expect(orgForIp('171.68.0.1')).toBeUndefined()
  })

  it('returns undefined for ordinary and malformed addresses', () => {
    expect(orgForIp('193.221.158.58')).toBeUndefined()
    expect(orgForIp('not-an-ip')).toBeUndefined()
    expect(orgForIp('999.1.1.1')).toBeUndefined()
    expect(orgForIp(undefined)).toBeUndefined()
    // IPv6 is stored but not resolved, and must not throw.
    expect(orgForIp('2a00:1450:4009::1')).toBeUndefined()
  })
})
