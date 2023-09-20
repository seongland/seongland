import React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { author, twitter, linkedin, github } from '~/site-config'

export const ThemeBtn = dynamic(async () => import('../atoms/ThemeBtn'))
export const BGMBtn = dynamic(async () => import('../atoms/BGMBtn'))

export const Footer: React.FC = () => {
  return (
    <footer
      className="flex items-center"
      text="dark:white"
      m="x-auto t-auto b-0"
      p="4"
      w="full max-10/12 <sm:max-12/12"
      justify="between"
      flex="row <sm:col"
      select="none">
      <div select="none" text="xs" order="1 <sm:3" className="items-center flex">
        <BGMBtn />
        <span>Copyright &nbsp;</span>
        <Link id="author" font="900" href="https://texonom.com/alan-jo" text="underline">
          {author}
        </Link>
        &nbsp;
        <Link id="resume" font="900" href="https://texonom.com/resume" text="underline">
          (Resume)
        </Link>
      </div>
      <div order="2 <sm:1">
        <ThemeBtn />
      </div>
      <div order="3 <sm:2">
        {twitter ? (
          <Link
            cursor="pointer"
            text="hover:light-blue-500 2xl"
            p="2"
            className="inline-flex"
            href={`https://twitter.com/${twitter}`}
            title={`Twitter @${twitter}`}
            target="_blank"
            m="r-3"
            transition="colors"
            rel="noopener noreferrer">
            <FaTwitter />
          </Link>
        ) : null}
        {github ? (
          <Link
            cursor="pointer"
            text="hover:indigo-500 2xl"
            p="2"
            className="inline-flex"
            href={`https://github.com/${github}`}
            title={`GitHub @${github}`}
            target="_blank"
            m="r-2"
            transition="colors"
            rel="noopener noreferrer">
            <FaGithub />
          </Link>
        ) : null}
        {linkedin ? (
          <Link
            cursor="pointer"
            text="hover:blue-500 2xl"
            p="2"
            className="inline-flex"
            href={`https://www.linkedin.com/in/${linkedin}`}
            title={`LinkedIn ${author}`}
            target="_blank"
            transition="colors"
            m="!r-0"
            rel="noopener noreferrer">
            <FaLinkedin />
          </Link>
        ) : null}
      </div>
    </footer>
  )
}
