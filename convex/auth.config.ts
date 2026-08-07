// Clerk to Convex bridge, reusing the Clerk instance already locked to
// seongland.com. Set with:
//   npx convex env set CLERK_ISSUER_URL https://<instance>.clerk.accounts.dev
// (Clerk dashboard, JWT Templates, "convex", Issuer URL.)
//
// With the variable unset the deployment still builds; nothing can authenticate.

const issuer = process.env.CLERK_ISSUER_URL

export default {
  providers: issuer ? [{ domain: issuer, applicationID: 'convex' }] : [],
}
