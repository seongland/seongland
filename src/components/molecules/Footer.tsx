import React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { author, twitter, linkedin, github } from '~/site-config'

export const ThemeBtn = dynamic(async () => import('../atoms/ThemeBtn'))
export const BGMBtn = dynamic(async () => import('../atoms/BGMBtn'))

export const Footer: React.FC = () => {
  return (
    <footer className="flex items-center dark:text-white mx-auto mt-auto mb-0 p-4 w-full max-w-[83.333%] max-sm:max-w-full justify-between flex-row max-sm:flex-col select-none">
      <div className="items-center flex select-none text-xs order-1 max-sm:order-3">
        <BGMBtn />
        <span>Copyright &nbsp;</span>
        <Link id="author" className="font-black underline" href="https://texonom.com/seonglae">
          {author}
        </Link>
      </div>
      <div className="order-2 max-sm:order-1">
        <ThemeBtn />
      </div>
      <div className="order-3 max-sm:order-2">
        {twitter ? (
          <Link
            className="inline-flex cursor-pointer hover:text-sky-500 text-2xl p-2 mr-3 transition-colors"
            href={`https://twitter.com/${twitter}`}
            title={`Twitter @${twitter}`}
            aria-label={`Twitter @${twitter}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaTwitter />
          </Link>
        ) : null}
        {github ? (
          <Link
            className="inline-flex cursor-pointer hover:text-indigo-500 text-2xl p-2 mr-2 transition-colors"
            href={`https://github.com/${github}`}
            title={`GitHub @${github}`}
            aria-label={`GitHub @${github}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub />
          </Link>
        ) : null}
        {linkedin ? (
          <Link
            className="inline-flex cursor-pointer hover:text-blue-500 text-2xl p-2 !mr-0 transition-colors"
            href={`https://www.linkedin.com/in/${linkedin}`}
            title={`LinkedIn ${author}`}
            aria-label={`LinkedIn ${author}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin />
          </Link>
        ) : null}
      </div>
    </footer>
  )
}
