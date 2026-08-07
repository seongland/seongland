import { useEffect } from 'react'
import { ClerkProvider, SignOutButton, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { ConvexReactClient, useQuery } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { statsApi } from '@/lib/convexApi.ts'
import Dashboard from './Dashboard.tsx'
import { clerkAppearance, clerkPublishableKey, convexUrl } from './config.ts'
import { Loading, Notice } from './ui.tsx'

function SendToLogin() {
  useEffect(() => {
    window.location.replace('/login')
  }, [])
  return <Loading label="Redirecting to sign in" />
}

/**
 * A signed-in non-owner would otherwise hit `forbidden` on the first query, so
 * show them the claims their token carries instead of a crash.
 */
function OwnerGate({ children }: { children: React.ReactNode }) {
  const me = useQuery(statsApi.whoami, {})
  if (me === undefined) return <Loading label="Checking access" />
  if (me.authenticated && me.isOwner) return <>{children}</>
  return (
    <div className="flex flex-col items-center gap-5">
      <Notice title="Signed in, but this account has no access">
        email: {me.email ?? '(none in token)'}
        <br />
        subject: {me.subject ?? '-'}
        <br />
        owner configured: {me.configured ? 'yes' : 'no (set SEONGLAND_OWNER_EMAIL)'}
      </Notice>
      <SignOutButton>
        <button className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-80">
          Sign out
        </button>
      </SignOutButton>
    </div>
  )
}

// The island only ever runs in the browser, so one client per page load is right.
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

export default function AdminApp() {
  if (!clerkPublishableKey || !convex) {
    return (
      <Notice title="Dashboard is not configured">
        Missing {!clerkPublishableKey && 'PUBLIC_CLERK_PUBLISHABLE_KEY'}
        {!clerkPublishableKey && !convexUrl && ' and '}
        {!convexUrl && 'PUBLIC_CONVEX_URL'} for this deployment.
      </Notice>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance()}>
      <SignedOut>
        <SendToLogin />
      </SignedOut>
      <SignedIn>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <OwnerGate>
            <Dashboard />
          </OwnerGate>
        </ConvexProviderWithClerk>
      </SignedIn>
    </ClerkProvider>
  )
}
