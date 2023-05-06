import React from 'react'
import { describe, vi, test } from 'vitest'
import { render } from '@testing-library/react'

import LandingPage, { getStaticProps } from '@/pages/index'

describe('Seongland Pages', () => {
  test('Landing Page', async () => {
    const { props } = await getStaticProps()
    const { unmount } = render(<LandingPage {...props} />)
    unmount()
  })
})

vi.mock('next/router', () => {
  return { useRouter: vi.fn(() => ({ isFallback: true })) }
})
