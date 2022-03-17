import * as React from 'react'

export const baseRenderer = {
  link({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  },

  paragraph: () => <div />,
}
