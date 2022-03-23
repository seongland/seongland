import React, { MouseEventHandler, useState } from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { IoSunnyOutline, IoMoonSharp, IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import useSound from 'use-sound'

import siteConfig from '~/site-config'

export const Footer: React.FC<{
  isDarkMode: boolean
  toggleDarkMode: () => void
}> = ({ isDarkMode, toggleDarkMode }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const toggleDarkModeCb = React.useCallback(
    e => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )
  React.useEffect(() => setHasMounted(true), [])

  // Background Sound
  const [playing, setPlay] = useState(false)
  const [start, { stop }] = useSound('/sound/loop.mp3', { loop: true })
  const togglePlay: MouseEventHandler = () => {
    setPlay(!playing)
    if (playing) stop()
    else start()
  }

  return (
    <footer
      className="flex items-center"
      text="dark:white"
      m="x-auto t-auto b-0"
      p="4"
      w="full max-11/12"
      justify="between"
      flex="row <sm:col"
      select="none">
      <div select="none" p="2" text="xs" order="1 <sm:3" className="items-center flex">
        {hasMounted ? (
          <a
            text="hover:light-blue-500 3xl"
            p="2"
            className="inline-flex "
            transition="colors"
            onClick={togglePlay}
            title="Tottle dark mode">
            {playing ? <IoPauseOutline /> : <IoPlayOutline />}
          </a>
        ) : null}
        Copyright {new Date().getFullYear()} {siteConfig.author}
      </div>
      {hasMounted ? (
        <div order="2 <sm:1">
          <a
            text="hover:light-blue-500 3xl"
            p="2"
            className="inline-flex"
            transition="colors"
            onClick={toggleDarkModeCb}
            title="Tottle dark mode">
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        </div>
      ) : null}
      <div order="3 <sm:2">
        {siteConfig.twitter ? (
          <a
            cursor="pointer"
            text="hover:light-blue-500 3xl"
            p="2"
            className="inline-flex"
            href={`https://twitter.com/${siteConfig.twitter}`}
            title={`Twitter @${siteConfig.twitter}`}
            target="_blank"
            m="r-3"
            transition="colors"
            rel="noopener noreferrer">
            <FaTwitter />
          </a>
        ) : null}
        {siteConfig.github ? (
          <a
            cursor="pointer"
            text="hover:indigo-500 3xl"
            p="2"
            className="inline-flex"
            href={`https://github.com/${siteConfig.github}`}
            title={`GitHub @${siteConfig.github}`}
            target="_blank"
            m="r-2"
            transition="colors"
            rel="noopener noreferrer">
            <FaGithub />
          </a>
        ) : null}
        {siteConfig.linkedin ? (
          <a
            cursor="pointer"
            text="hover:blue-500 3xl"
            p="2"
            className="inline-flex"
            href={`https://www.linkedin.com/in/${siteConfig.linkedin}`}
            title={`LinkedIn ${siteConfig.author}`}
            target="_blank"
            transition="colors"
            m="!r-0"
            rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        ) : null}
      </div>
    </footer>
  )
}
