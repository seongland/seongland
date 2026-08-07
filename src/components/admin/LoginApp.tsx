import { useEffect } from 'react'
import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { clerkAppearance, clerkPublishableKey } from './config.ts'
import { Notice } from './ui.tsx'

function Redirect() {
  useEffect(() => {
    window.location.replace('/admin')
  }, [])
  return <p className="mono text-center text-[11px] text-ink-3">Signed in, opening the dashboard…</p>
}

export default function LoginApp() {
  if (!clerkPublishableKey) {
    return (
      <Notice title="Sign-in is not configured">Set PUBLIC_CLERK_PUBLISHABLE_KEY for this deployment, then reload.</Notice>
    )
  }
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance()}>
      <SignedOut>
        <SignIn routing="hash" fallbackRedirectUrl="/admin" appearance={clerkAppearance()} />
      </SignedOut>
      <SignedIn>
        <Redirect />
      </SignedIn>
    </ClerkProvider>
  )
}
