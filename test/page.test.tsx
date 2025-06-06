import React from 'react'
import { describe, vi, test } from 'vitest'
import { render } from '@testing-library/react'

import LandingPage, { getStaticProps } from '@/pages/index'
import Timeline from '@/pages/timeline'

declare global {
  // eslint-disable-next-line no-var
  var ResizeObserver: any
}

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Seongland Pages', () => {
  test('Landing Page', async () => {
    const { props } = await getStaticProps()
    const { unmount } = render(<LandingPage {...props} />)
    unmount()
  })

  test('Timeline Page', () => {
    const { unmount } = render(<Timeline />)
    unmount()
  })
})

vi.mock('next/router', () => {
  return { useRouter: vi.fn(() => ({ isFallback: true })) }
})
