import React, { MouseEventHandler, useState, useMemo } from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { IoSunnyOutline, IoMoonSharp, IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import useSound from 'use-sound'

import siteConfig from '~/site-config'

export const Footer: React.FC<{
  isDarkMode: boolean
  toggleDarkMode: () => void
}> = ({ isDarkMode, toggleDarkMode }) => {
  const [switch1] = useSound('/sound/switch1.mp3')
  const [switch2] = useSound('/sound/switch2.mp3')
  const [switch3] = useSound('/sound/switch3.mp3')
  const [switch4] = useSound('/sound/switch4.mp3')
  const [switch5] = useSound('/sound/switch5.mp3')
  const claps = useMemo<Array<typeof switch1>>(
    () => [switch1, switch2, switch3, switch4, switch5],
    [switch1, switch2, switch3, switch4, switch5]
  )

  const [hasMounted, setHasMounted] = React.useState(false)
  const toggleDarkModeCb = React.useCallback(
    e => {
      const index = 3
      claps[index]()
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode, claps]
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
      m="x-auto t-auto b-4"
      w="max-11/12"
      justify="between"
      flex="row <sm:col"
      select="none">
      <div select="none" text="xs" order="1 <sm:3" className="items-center flex">
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
        <span>
          Copyright {new Date().getFullYear()} {siteConfig.author}
        </span>
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
