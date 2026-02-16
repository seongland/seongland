import { useEffect } from 'react'
import { useTheme } from 'next-themes'

import { bgColor } from '~/site-config'

export const useThemes = () => {
  const { setTheme, systemTheme, resolvedTheme } = useTheme()
  const decided = (resolvedTheme ?? systemTheme ?? 'dark') as 'light' | 'dark'

  // Apply to classList
  const changeTheme = (theme: 'light' | 'dark') => setTheme(theme)

  // Watch Local Storage
  useEffect(() => {
    window.onstorage = () => {
      const theme = localStorage.getItem('theme') as 'dark' | 'light'
      if (theme) changeTheme(theme)
    }
  })

  // Set background color for Apple devices
  useEffect(() => {
    document.body.style.background = bgColor[decided]
  }, [decided])

  return { theme: decided, setTheme: changeTheme }
}

export const useThemeContext = () => {
  const { setTheme, systemTheme, resolvedTheme } = useTheme()
  const decided = (resolvedTheme ?? systemTheme ?? 'dark') as 'light' | 'dark'
  const changeTheme = (theme: 'light' | 'dark') => setTheme(theme)
  return { theme: decided, setTheme: changeTheme }
}
