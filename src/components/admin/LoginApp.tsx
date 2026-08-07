import { useEffect } from 'react'
import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { clerkAppearance, clerkPublishableKey, useTheme } from './config.ts'
import { Notice } from './ui.tsx'

function Redirect() {
  useEffect(() => {
    window.location.replace('/admin')
  }, [])
  return <p className="mono text-center text-[11px] text-ink-3">Signed in, opening the dashboard…</p>
}

export default function LoginApp() {
  const theme = useTheme()
  if (!clerkPublishableKey) {
    return (
      <Notice title="Sign-in is not configured">Set PUBLIC_CLERK_PUBLISHABLE_KEY for this deployment, then reload.</Notice>
    )
  }
  const appearance = clerkAppearance(theme)
  return (
    <ClerkProvider key={theme} publishableKey={clerkPublishableKey} appearance={appearance}>
      <SignedOut>
        <SignIn routing="hash" fallbackRedirectUrl="/admin" appearance={appearance} />
      </SignedOut>
      <SignedIn>
        <Redirect />
      </SignedIn>
    </ClerkProvider>
  )
}
