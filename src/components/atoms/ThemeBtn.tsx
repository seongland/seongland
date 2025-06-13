import React, { MouseEventHandler, useMemo, useEffect, MouseEvent } from 'react'
import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'
import { useSound } from 'use-sound'
import { useThemeContext } from '@/hooks/useApp'

export const ThemeBtn: React.FC = () => {
  // Theme Change Sound
  const [switch1] = useSound('/sound/switch1.mp3')
  const [switch2] = useSound('/sound/switch2.mp3')
  const [switch3] = useSound('/sound/switch3.mp3')
  const [switch4] = useSound('/sound/switch4.mp3')
  const [switch5] = useSound('/sound/switch5.mp3')
  const claps = useMemo<Array<typeof switch1>>(
    () => [switch1, switch2, switch3, switch4, switch5],
    [switch1, switch2, switch3, switch4, switch5],
  )

  // Dark Mode
  const [hasMounted, setHasMounted] = React.useState(false)
  const { theme, setTheme } = useThemeContext()
  const toggleTheme = React.useCallback<MouseEventHandler>(
    e => {
      const index = Math.floor(Math.random() * claps.length)
      claps[index]()
      e.preventDefault()
      if (theme === 'light') setTheme('dark')
      else setTheme('light')
    },
    [setTheme, claps, theme],
  )
  React.useEffect(() => setHasMounted(true), [])

  // Shortcut
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyL') {
        e.preventDefault()
        // @ts-ignore
        toggleTheme(e as MouseEvent)
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [toggleTheme])

  return (
    <>
      {hasMounted ? (
        <span
          role="button"
          tabIndex={0}
          aria-label="Toggle dark mode"
          text="hover:yellow-500 2xl"
          p="2"
          className="inline-flex"
          transition="colors"
          onClick={toggleTheme}
          title="Toggle dark mode">
          {theme === 'dark' ? <IoMoonSharp /> : <IoSunnyOutline />}
        </span>
      ) : (
        <></>
      )}
    </>
  )
}

export default ThemeBtn
