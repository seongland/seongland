// Client-side configuration for the owner-only surfaces. Both variables are
// PUBLIC_ on purpose: the Clerk publishable key and the Convex deployment URL
// are meant to ship to the browser. Access is enforced by requireOwner.

export const convexUrl = import.meta.env.PUBLIC_CONVEX_URL as string | undefined
export const clerkPublishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

const paper = {
  colorPrimary: '#1a1714',
  colorText: '#1a1714',
  colorTextSecondary: '#8a8478',
  colorBackground: '#f5f0e8',
  colorInputBackground: '#efe9de',
  colorInputText: '#1a1714',
}

const ink = {
  colorPrimary: '#e8e4dc',
  colorTextOnPrimaryBackground: '#111418',
  colorText: '#e8e4dc',
  colorTextSecondary: '#8a8478',
  colorBackground: '#1a1d22',
  colorInputBackground: '#111418',
  colorInputText: '#e8e4dc',
}

/** Clerk reads its palette once at mount, so resolve the theme at call time. */
export function clerkAppearance() {
  const dark = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
  return {
    variables: { ...(dark ? ink : paper), borderRadius: '0.5rem', fontFamily: 'inherit' },
    elements: {
      rootBox: 'w-full flex justify-center',
      card: 'border border-rule shadow-none',
      footer: 'hidden',
      logoBox: 'hidden',
    },
  }
}
