import type { NextPage as BaseNextPage } from 'next'
import type { AppProps as NextAppProps } from 'next/app'

export type NextPage<P = unknown, IP = P> = BaseNextPage<P, IP> & {
  disableLayout?: boolean
}

export type AppProps<P = unknown, IP = P> = NextAppProps<P> & {
  Component: NextPage<P, IP>
}
