import React from 'react'
import { describe, vi, test } from 'vitest'
import { render } from '@testing-library/react'

import LandingPage from '@/pages/index'

describe('Seongland Pages', () => {
  test('Landing Page', () => {
    const { unmount } = render(<LandingPage applications={[]} webapps={[]} publications={[]} />)
    unmount()
  })
})

vi.mock('next/router', () => {
  return { useRouter: vi.fn(() => ({ isFallback: true })) }
})
