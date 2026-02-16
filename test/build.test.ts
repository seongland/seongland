import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

describe('build config', () => {
  it('package.json has required fields', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
    expect(pkg.name).toBe('seongland')
    expect(pkg.scripts.build).toBeDefined()
    expect(pkg.scripts.dev).toBeDefined()
  })
})
