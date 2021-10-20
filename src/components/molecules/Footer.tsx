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
        <div className={styles.settings} order="2 <sm:1">
          <a className={styles.toggleDarkMode} onClick={toggleDarkModeCb} title="Tottle dark mode">
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        </div>
      ) : null}
      <div className={styles.social} order="3 <sm:2">
        {config.twitter && (
          <a
            cursor="pointer"
            className={styles.twitter}
            href={`https://twitter.com/${config.twitter}`}
            title={`Twitter @${config.twitter}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaTwitter />
          </a>
        )}
        {config.github && (
          <a
            cursor="pointer"
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub />
          </a>
        )}
        {config.linkedin && (
          <a
            cursor="pointer"
            className={styles.linkedin}
            href={`https://www.linkedin.com/in/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        )}
      </div>
    </footer>
  )
}

export default Footer
