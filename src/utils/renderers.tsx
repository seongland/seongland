import * as React from 'react'

export const baseRenderer = {
  link({ href, children }) {
    return <a href={href}>{children}</a>
  },

  paragraph: () => <div />,
}
