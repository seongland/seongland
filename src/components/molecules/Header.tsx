import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

export const ThemeBtn = dynamic(async () => import('../atoms/ThemeBtn'))
export const BGMBtn = dynamic(async () => import('../atoms/BGMBtn'))

export const Header: React.FC = () => {
  return (
    <header
      className="flex items-center"
      text="dark:white"
      m="x-auto t-auto b-0"
      p="4"
      w="full max-10/12 <sm:max-12/12"
      justify="between"
      flex="row"
      select="none">
      <div order="1"></div>
      <div order="2"></div>
      <div select="none" text="sm" order="3" className="items-center flex">
        <a id="author" font="500" href="/cv.pdf" text="underline">
          CV
        </a>
        <Link m="l-4" id="author" font="500" href="https://texonom.com/portfolio" text="underline">
          Portfolio
        </Link>
      </div>
    </header>
  )
}
