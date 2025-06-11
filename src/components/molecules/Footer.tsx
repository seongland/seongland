import React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { author, twitter, linkedin, github } from '~/site-config'

export const ThemeBtn = dynamic(async () => import('../atoms/ThemeBtn'))
export const BGMBtn = dynamic(async () => import('../atoms/BGMBtn'))

export const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-between select-none w-full p-4 mx-auto mt-auto mb-0 dark:text-white flex-col sm:flex-row">
      <div className="items-center flex select-none text-xs order-1 sm:order-3">
        <BGMBtn />
        <span>Copyright &nbsp;</span>
        <Link id="author" className="font-black underline" href="https://texonom.com/seonglae">
          {author}
        </Link>
      </div>
      <div className="order-2 sm:order-1">
        <ThemeBtn />
      </div>
      <div className="order-3 sm:order-2">
        {twitter ? (
          <Link
            className="inline-flex cursor-pointer p-2 text-2xl transition-colors hover:text-sky-500 mr-3"
            href={`https://twitter.com/${twitter}`}
            title={`Twitter @${twitter}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaTwitter />
          </Link>
        ) : null}
        {github ? (
          <Link
            className="inline-flex cursor-pointer p-2 text-2xl transition-colors hover:text-indigo-500 mr-2"
            href={`https://github.com/${github}`}
            title={`GitHub @${github}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub />
          </Link>
        ) : null}
        {linkedin ? (
          <Link
            className="inline-flex cursor-pointer p-2 text-2xl transition-colors hover:text-blue-500 mr-0"
            href={`https://www.linkedin.com/in/${linkedin}`}
            title={`LinkedIn ${author}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin />
          </Link>
        ) : null}
      </div>
    </footer>
  )
}
