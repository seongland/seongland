// Client-side configuration for the owner-only surfaces. Both variables are
// PUBLIC_ on purpose: the Clerk publishable key and the Convex deployment URL
// are meant to ship to the browser. Access is enforced by requireOwner.

import { useEffect, useState } from 'react'

export const convexUrl = import.meta.env.PUBLIC_CONVEX_URL as string | undefined
export const clerkPublishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

// colorNeutral drives the social button's label, border and provider icon. Left
// unset it defaults to black, which is invisible on the dark card.
const paper = {
  colorPrimary: '#1a1714',
  colorTextOnPrimaryBackground: '#f5f0e8',
  colorText: '#1a1714',
  colorTextSecondary: '#8a8478',
  colorNeutral: '#1a1714',
  colorBackground: '#f5f0e8',
  colorInputBackground: '#efe9de',
  colorInputText: '#1a1714',
}

const ink = {
  colorPrimary: '#e8e4dc',
  colorTextOnPrimaryBackground: '#111418',
  colorText: '#e8e4dc',
  colorTextSecondary: '#8a8478',
  colorNeutral: '#e8e4dc',
  colorBackground: '#1a1d22',
  colorInputBackground: '#111418',
  colorInputText: '#e8e4dc',
}

export type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * Clerk resolves its palette once per mount, so the widget has to be remounted
 * when the site theme flips. Callers use the returned value both to build the
 * appearance and as a React key.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    setTheme(currentTheme())
    return () => observer.disconnect()
  }, [])
  return theme
}

export function clerkAppearance(theme: Theme = currentTheme()) {
  return {
    variables: { ...(theme === 'dark' ? ink : paper), borderRadius: '0.5rem', fontFamily: 'inherit' },
    elements: {
      rootBox: 'w-full flex justify-center',
      card: 'border border-rule shadow-none',
      footer: 'hidden',
      logoBox: 'hidden',
    },
  }
}
