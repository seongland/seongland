import * as React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'
import * as config from 'lib/config'

import styles from '../styles.module.css'

const Footer: React.FC<{
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
      <div select="none" p="2" text="xs" order="1 <sm:3">
        Copyright 2021 {config.author}
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
        {config.twitter && (
          <a
            cursor="pointer"
            text="hover:light-blue-500 3xl"
            p="2"
            className="inline-flex"
            href={`https://twitter.com/${config.twitter}`}
            title={`Twitter @${config.twitter}`}
            target="_blank"
            m="r-3"
            transition="colors"
            rel="noopener noreferrer">
            <FaTwitter />
          </a>
        )}
        {config.github && (
          <a
            cursor="pointer"
            text="hover:indigo-500 3xl"
            p="2"
            className="inline-flex"
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target="_blank"
            m="r-2"
            transition="colors"
            rel="noopener noreferrer">
            <FaGithub />
          </a>
        )}
        {config.linkedin && (
          <a
            cursor="pointer"
            text="hover:blue-500 3xl"
            p="2"
            className="inline-flex"
            href={`https://www.linkedin.com/in/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target="_blank"
            transition="colors"
            m="!r-0"
            rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        )}
      </div>
    </footer>
  )
}

export default Footer
