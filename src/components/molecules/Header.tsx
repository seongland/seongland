import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

export const ThemeBtn = dynamic(async () => import('../atoms/ThemeBtn'))
export const BGMBtn = dynamic(async () => import('../atoms/BGMBtn'))

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between select-none w-full p-4 mx-auto mt-auto mb-0 dark:text-white">
      <div className="order-1"></div>
      <div className="order-2"></div>
      <div className="items-center flex select-none text-sm order-3">
        <a id="author" className="font-extrabold underline" href="/cv.pdf">
          CV
        </a>
        <Link className="ml-4 font-medium underline" id="author" href="https://texonom.com/portfolio">
          Portfolio
        </Link>
      </div>
    </header>
  )
}
